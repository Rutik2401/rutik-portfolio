import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  createClient,
  SupabaseClient,
  Session,
  User,
  AuthChangeEvent,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

interface PendingDownload {
  pdfPath: string;
  pdfName: string;
  expiresAt: number;
}

const PENDING_KEY = 'rutik:pendingDownload';
const PENDING_TTL_MS = 10 * 60 * 1000; // 10 minutes — auth flow rarely takes longer

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient | null = null;
  private readonly isBrowser: boolean;
  private readonly isConfigured: boolean;

  // Reactive auth state — components subscribe via signals
  readonly session = signal<Session | null>(null);
  readonly user = computed<User | null>(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  // Tracks the slug currently being processed so the UI can show a per-card spinner
  readonly downloadingSlug = signal<string | null>(null);
  readonly lastError = signal<string | null>(null);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isConfigured =
      !!environment.supabase.url &&
      !!environment.supabase.anonKey &&
      !environment.supabase.url.startsWith('YOUR_') &&
      !environment.supabase.anonKey.startsWith('YOUR_');

    if (this.isConfigured) {
      this.client = createClient(environment.supabase.url, environment.supabase.anonKey, {
        auth: {
          persistSession: this.isBrowser,
          autoRefreshToken: this.isBrowser,
          detectSessionInUrl: this.isBrowser,
          flowType: 'pkce',
        },
      });
    }

    if (this.isBrowser && this.client) {
      this.bootstrap();
    }
  }

  private async bootstrap(): Promise<void> {
    if (!this.client) return;
    const { data } = await this.client.auth.getSession();
    this.session.set(data.session);

    this.client.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      this.session.set(session);
      if (event === 'SIGNED_IN' && session) {
        // User just came back from Google — resume any pending download
        this.resumePendingDownload();
      }
    });

    // Cover the case where the session was already restored from storage on
    // refresh and the user had a pending download (no SIGNED_IN event fires
    // because session was already there).
    if (data.session) this.resumePendingDownload();
  }

  /**
   * Public entry point. Auth-gates the download:
   *   1. logged in   → log to DB + trigger download
   *   2. logged out  → save pending intent, redirect to Google, resume after.
   */
  async gatedDownload(slug: string, pdfPath: string, pdfName: string): Promise<void> {
    if (!this.isBrowser) return;

    // Graceful fallback: if Supabase is not yet configured, just download.
    // This keeps the site usable while env vars are being wired up.
    if (!this.client) {
      console.warn('[SupabaseService] Supabase not configured — falling back to direct download.');
      this.triggerBrowserDownload(pdfPath, pdfName);
      return;
    }

    this.lastError.set(null);
    this.downloadingSlug.set(slug);

    try {
      const { data } = await this.client.auth.getSession();

      if (data.session) {
        await this.logDownload(pdfName);
        this.triggerBrowserDownload(pdfPath, pdfName);
        this.downloadingSlug.set(null);
        return;
      }

      // Not authed — store intent and redirect to Google.
      this.savePending({ pdfPath, pdfName, expiresAt: Date.now() + PENDING_TTL_MS });
      await this.signInWithGoogle();
      // Browser will navigate away; spinner stays on until the redirect lands.
    } catch (err) {
      this.downloadingSlug.set(null);
      this.lastError.set(this.errorMessage(err));
      console.error('[SupabaseService] gatedDownload failed:', err);
    }
  }

  private async signInWithGoogle(): Promise<void> {
    if (!this.client) throw new Error('Supabase not configured');
    const redirectTo = window.location.href; // come back to whatever page we're on
    const { error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    if (!this.client) return;
    await this.client.auth.signOut();
  }

  private async logDownload(pdfName: string): Promise<void> {
    if (!this.client) return;
    const u = this.user();
    if (!u?.email) throw new Error('No authenticated user');

    const { error } = await this.client.from('pdf_downloads').insert({
      user_email: u.email,
      user_name: (u.user_metadata?.['full_name'] as string) ?? u.user_metadata?.['name'] ?? null,
      pdf_name: pdfName,
    });

    // Don't block the download on logging failure — log and continue.
    if (error) console.warn('[SupabaseService] download log failed:', error.message);
  }

  private triggerBrowserDownload(pdfPath: string, pdfName: string): void {
    // Force an absolute path so SPA route rewrites can't redirect this to
    // index.html. `pdfPath` may come in as either "assets/..." or "/assets/...".
    const href =
      pdfPath.startsWith('http://') || pdfPath.startsWith('https://') || pdfPath.startsWith('/')
        ? pdfPath
        : '/' + pdfPath;
    const a = document.createElement('a');
    a.href = href;
    a.download = pdfName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ── pending download persistence ──────────────────────────────────────

  private savePending(p: PendingDownload): void {
    try {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(p));
    } catch {
      /* storage unavailable — silently skip; user can re-click after auth */
    }
  }

  private readPending(): PendingDownload | null {
    try {
      const raw = sessionStorage.getItem(PENDING_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw) as PendingDownload;
      if (Date.now() > p.expiresAt) {
        sessionStorage.removeItem(PENDING_KEY);
        return null;
      }
      return p;
    } catch {
      return null;
    }
  }

  private clearPending(): void {
    try {
      sessionStorage.removeItem(PENDING_KEY);
    } catch {
      /* noop */
    }
  }

  private async resumePendingDownload(): Promise<void> {
    const pending = this.readPending();
    if (!pending) return;
    this.clearPending();

    try {
      await this.logDownload(pending.pdfName);
      this.triggerBrowserDownload(pending.pdfPath, pending.pdfName);
    } catch (err) {
      this.lastError.set(this.errorMessage(err));
      console.error('[SupabaseService] resume failed:', err);
    } finally {
      this.downloadingSlug.set(null);
    }
  }

  private errorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    return 'Something went wrong. Please try again.';
  }
}
