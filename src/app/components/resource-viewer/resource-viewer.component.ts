import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MarkdownModule } from 'ngx-markdown';
import { LenisScrollService } from '../../services/lenis-scroll.service';
import { SupabaseService } from '../../services/supabase.service';

interface ResourceMeta {
  slug: string;
  title: string;
  shortName: string;
  category: string;
  mdPath: string;
  pdfPath: string;
  htmlPath: string;
  accentColor: string;
  icon: string;
}

type ViewMode = 'markdown' | 'html';

const RESOURCES: Record<string, ResourceMeta> = {
  angular: {
    slug: 'angular',
    title: 'Angular Interview Roadmap',
    shortName: 'angular-roadmap',
    category: 'ANGULAR · JUNIOR → SENIOR',
    mdPath: 'assets/notes/angular/notes.md',
    pdfPath: 'assets/notes/angular/notes.pdf',
    htmlPath: 'assets/notes/angular/notes.html',
    accentColor: '#ff5577',
    icon: 'A',
  },
  'dotnet-senior': {
    slug: 'dotnet-senior',
    title: '.NET Interview Roadmap',
    shortName: 'dotnet-senior',
    category: '.NET · 0 – 2.5 YRS · SENIOR-STYLE',
    mdPath: 'assets/notes/dotnet-senior/notes.md',
    pdfPath: 'assets/notes/dotnet-senior/notes.pdf',
    htmlPath: 'assets/notes/dotnet-senior/notes.html',
    accentColor: '#a78bfa',
    icon: '#',
  },
  'dotnet-fresher': {
    slug: 'dotnet-fresher',
    title: '.NET & C# Interview Q&A',
    shortName: 'dotnet-fresher',
    category: '.NET · FRESHER → MID-LEVEL',
    mdPath: 'assets/notes/dotnet-fresher/notes.md',
    pdfPath: 'assets/notes/dotnet-fresher/notes.pdf',
    htmlPath: 'assets/notes/dotnet-fresher/notes.html',
    accentColor: '#34d399',
    icon: '?',
  },
  react: {
    slug: 'react',
    title: 'React Interview Roadmap',
    shortName: 'react-roadmap',
    category: 'REACT · 0 – 3 YRS · SENIOR-STYLE',
    mdPath: 'assets/notes/react/notes.md',
    pdfPath: 'assets/notes/react/notes.pdf',
    htmlPath: 'assets/notes/react/notes.html',
    accentColor: '#22d3ee',
    icon: '⚛',
  },
};

@Component({
  selector: 'app-resource-viewer',
  standalone: true,
  imports: [MarkdownModule, RouterLink],
  templateUrl: './resource-viewer.component.html',
  styleUrl: './resource-viewer.component.scss',
})
export class ResourceViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  resource = signal<ResourceMeta | null>(null);
  notFound = signal(false);
  readingProgress = signal(0);
  viewMode = signal<ViewMode>('markdown');
  htmlSrc = signal<SafeResourceUrl | null>(null);
  showBackToTop = signal(false);
  iframeLoaded = signal(false);

  accent = computed(() => this.resource()?.accentColor ?? '#818cf8');

  private scrollHandler = () => this.handleScroll();

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private lenisScroll: LenisScrollService,
    public supabase: SupabaseService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      const meta = RESOURCES[slug];
      if (meta) {
        this.resource.set(meta);
        this.notFound.set(false);
        this.htmlSrc.set(this.sanitizer.bypassSecurityTrustResourceUrl(meta.htmlPath));
        this.viewMode.set('markdown');
        this.iframeLoaded.set(false);
      } else {
        this.resource.set(null);
        this.notFound.set(true);
        this.htmlSrc.set(null);
      }
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.updateProgress();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('scroll', this.scrollHandler);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
    if (mode === 'html') this.iframeLoaded.set(false);
    if (isPlatformBrowser(this.platformId)) {
      this.lenisScroll.scrollToTop(0.8);
    }
  }

  scrollToTop(): void {
    this.lenisScroll.scrollToTop(1.4);
  }

  private handleScroll(): void {
    this.updateProgress();
    // Show back-to-top after scrolling 600px (about one viewport on phone).
    this.showBackToTop.set(window.scrollY > 600);
  }

  /**
   * Inject screen-only styles into the iframe document after it loads.
   * Existing notes.html files were generated before the @media screen block
   * was added to styles.css — this gives them the side-padding + modern
   * scrollbar without needing to regenerate. Future regenerations include
   * the same rules in the inline <style> so this becomes a no-op.
   */
  onIframeLoad(event: Event): void {
    this.iframeLoaded.set(true);
    const iframe = event.target as HTMLIFrameElement;
    const doc = iframe.contentDocument;
    if (!doc) return;
    if (doc.getElementById('rutik-screen-overlay')) return;

    const style = doc.createElement('style');
    style.id = 'rutik-screen-overlay';
    // Same rules as tools/notes-generator/styles.css @media screen blocks.
    // Wrapped so PDF generation is never touched. Three breakpoints.
    // Mirrors the @media screen rules in tools/notes-generator/styles.css.
    // Appended last so it overrides any older inline copy in pre-existing
    // notes.html files (those generated before the cover-page screen fix).
    style.textContent = `
      @media screen {
        html { scrollbar-width: thin; scrollbar-color: rgba(15,23,42,0.3) transparent; }
        html, body { overflow-x: clip; }
        body {
          max-width: 920px;
          margin: 0 auto;
          padding: 32px 36px 64px;
          background: #fafafa;
        }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: rgba(15, 23, 42, 0.25);
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: padding-box;
          transition: background 0.2s ease;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(15, 23, 42, 0.55);
          background-clip: padding-box;
        }
        pre { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; }

        /* Cover stays at native A4 (794x1123px) on desktop, gains a
           rounded "digital artifact" frame so it reads as a doc, not
           a print page. */
        .cover-page {
          border-radius: 14px;
          box-shadow:
            0 24px 60px -22px rgba(15, 23, 42, 0.55),
            0 6px 16px rgba(15, 23, 42, 0.16),
            0 0 0 1px rgba(15, 23, 42, 0.04);
          margin-left: auto;
          margin-right: auto;
        }
      }
      @media screen and (min-width: 601px) and (max-width: 1024px) {
        body { padding: 24px 22px 50px; }
        .toc-title { font-size: 28pt; }

        .cover-page {
          transform-origin: top left;
          --_cv-scale: min(1, calc((100vw - 44px) / 794px));
          transform: scale(var(--_cv-scale));
          margin-bottom: calc(1123px * var(--_cv-scale) - 1123px);
          border-radius: 14px;
        }
      }
      @media screen and (max-width: 600px) {
        body { padding: 14px 14px 48px; max-width: 100%; }
        .toc-page { padding: 0; }
        .toc-grid { column-count: 1; column-gap: 0; }
        .toc-title { font-size: 20pt; }
        .toc-kicker { font-size: 7pt; letter-spacing: 3px; padding: 3px 12px; }
        .toc-sub { font-size: 7.5pt; padding: 0 8px; }
        .toc-card { margin-bottom: 12px; padding: 12px; }
        .toc-num { width: 24px; height: 24px; font-size: 9pt; }
        .toc-topic-title { font-size: 9pt; }
        .toc-qs li a { font-size: 8pt; line-height: 1.4; }
        h1 { font-size: 18pt; padding-bottom: 8px; margin-bottom: 12px; }
        h2 { font-size: 11.5pt; padding: 10px 14px; letter-spacing: 0.5px; margin: 24px 0 16px; }
        h3 { font-size: 11pt; padding: 9px 12px; margin: 20px 0 12px; line-height: 1.35; }
        h4 { font-size: 10pt; }
        pre { font-size: 7.8pt; padding: 26px 14px 12px; border-radius: 6px; }
        pre code { white-space: pre; word-break: normal; font-size: 7.8pt; }
        /* Inline code on mobile: WRAP instead of nowrap so long identifiers
           never overflow the right edge. */
        code { font-size: 8.4pt; padding: 1px 5px; white-space: normal; word-break: break-word; overflow-wrap: anywhere; }
        /* Soften the highlighter background on small screens — solid colored
           chips on every <strong> looks busy on mobile. */
        strong { background: linear-gradient(180deg, transparent 75%, rgba(234,88,12,0.10) 75%); }
        table { font-size: 8.5pt; }
        th, td { white-space: nowrap; padding: 6px 10px; }
        p { text-align: left; hyphens: manual; line-height: 1.7; margin-bottom: 12px; }
        ul, ol { padding-left: 18px; }
        li { line-height: 1.65; margin: 5px 0; }
        blockquote { padding: 10px 14px; margin: 14px 0; }

        /* Cover scales fluidly to fit mobile width while preserving A4
           ratio and all internal mm/pt sizing — looks identical to the
           printed PDF, just smaller. */
        .cover-page {
          transform-origin: top left;
          --_cv-scale: calc((100vw - 28px) / 794px);
          transform: scale(var(--_cv-scale));
          margin-bottom: calc(1123px * var(--_cv-scale) - 1123px);
          border-radius: 12px;
          box-shadow:
            0 18px 40px -18px rgba(15, 23, 42, 0.55),
            0 4px 10px rgba(15, 23, 42, 0.18);
        }
      }
    `;
    doc.head.appendChild(style);
  }

  private updateProgress(): void {
    const doc = document.documentElement;
    const total = doc.scrollHeight - window.innerHeight;
    const pct = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0;
    this.readingProgress.set(pct);
  }

  async download(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const r = this.resource();
    if (!r) return;
    await this.supabase.gatedDownload(r.slug, r.pdfPath, `${r.shortName}.pdf`);
  }
}
