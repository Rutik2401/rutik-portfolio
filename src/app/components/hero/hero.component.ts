import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LenisScrollService } from '../../services/lenis-scroll.service';
import { MagneticDirective } from '../../directives/magnetic.directive';

const COUNTER_KEY = 'rutik.profile.visits';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MagneticDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('section') sectionRef!: ElementRef<HTMLElement>;

  visitorCount = signal('0000');

  private rafId = 0;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private mouseListener?: () => void;

  constructor(
    private lenisScroll: LenisScrollService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.bumpCounter();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    this.setupOrbParallax();
  }

  scrollTo(target: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.lenisScroll.scrollTo(target);
  }

  private bumpCounter(): void {
    try {
      const prev = Number(localStorage.getItem(COUNTER_KEY) ?? '0');
      const next = prev + 1;
      localStorage.setItem(COUNTER_KEY, String(next));
      // 4-digit zero-padded display, capped at 9999
      this.visitorCount.set(String(Math.min(next, 9999)).padStart(4, '0'));
    } catch {
      this.visitorCount.set('0001');
    }
  }

  /** Subtle parallax: hero ambient orbs drift toward the cursor. */
  private setupOrbParallax(): void {
    const sectionEl = this.sectionRef?.nativeElement;
    if (!sectionEl) return;

    const onMove = (e: MouseEvent) => {
      const rect = sectionEl.getBoundingClientRect();
      // -1 to 1 range, normalized to section center
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      this.targetX = x * 18; // max 18px drift
      this.targetY = y * 12;
      if (!this.rafId) this.rafId = requestAnimationFrame(() => this.tick(sectionEl));
    };

    const onLeave = () => {
      this.targetX = 0;
      this.targetY = 0;
      if (!this.rafId) this.rafId = requestAnimationFrame(() => this.tick(sectionEl));
    };

    sectionEl.addEventListener('mousemove', onMove);
    sectionEl.addEventListener('mouseleave', onLeave);
    this.mouseListener = () => {
      sectionEl.removeEventListener('mousemove', onMove);
      sectionEl.removeEventListener('mouseleave', onLeave);
    };
  }

  private tick(sectionEl: HTMLElement): void {
    this.currentX += (this.targetX - this.currentX) * 0.08;
    this.currentY += (this.targetY - this.currentY) * 0.08;

    // Apply via CSS custom properties — orb-* selectors read these
    sectionEl.style.setProperty('--orb-x', `${this.currentX.toFixed(2)}px`);
    sectionEl.style.setProperty('--orb-y', `${this.currentY.toFixed(2)}px`);

    const stillMoving =
      Math.abs(this.targetX - this.currentX) > 0.05 ||
      Math.abs(this.targetY - this.currentY) > 0.05;

    if (stillMoving) {
      this.rafId = requestAnimationFrame(() => this.tick(sectionEl));
    } else {
      this.rafId = 0;
    }
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.mouseListener?.();
  }
}
