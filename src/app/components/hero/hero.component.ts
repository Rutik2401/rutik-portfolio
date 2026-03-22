import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { LenisScrollService } from '../../services/lenis-scroll.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements AfterViewInit, OnDestroy {

  @ViewChild('orb1') orb1!: ElementRef;
  @ViewChild('orb2') orb2!: ElementRef;
  @ViewChild('badge') badge!: ElementRef;
  @ViewChild('hiLine') hiLine!: ElementRef;
  @ViewChild('nameLine1') nameLine1!: ElementRef;
  @ViewChild('nameLine2') nameLine2!: ElementRef;
  @ViewChild('roleText') roleText!: ElementRef;
  @ViewChild('description') description!: ElementRef;
  @ViewChild('buttons') buttons!: ElementRef;
  @ViewChild('social') social!: ElementRef;
  @ViewChild('statsRow') statsRow!: ElementRef;
  @ViewChild('orbitalContainer') orbitalContainer!: ElementRef;

  outerBadges = ['Angular', 'Spring Boot', 'TypeScript'];
  innerBadges = ['Java', 'React', 'SQL'];

  private tickerFn!: () => void;
  private orbitAngle = 0;

  constructor(
    private lenisScroll: LenisScrollService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      this.runIntroTimeline();
      this.startOrbital();
    }, 150);
  }

  // ─── Entrance Timeline ────────────────────────────────────────────────────
  private runIntroTimeline(): void {
    // Ensure all animated text starts clipped (translateY 100%)
    gsap.set(
      [this.hiLine.nativeElement, this.nameLine1.nativeElement, this.nameLine2.nativeElement, this.roleText.nativeElement],
      { y: '105%' }
    );

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl
      // Orbs
      .to([this.orb1.nativeElement, this.orb2.nativeElement],
        { opacity: 1, duration: 2, ease: 'power1.inOut' }, 0)

      // Badge
      .to(this.badge.nativeElement,
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.3)

      // Text lines clip-reveal
      .to(this.hiLine.nativeElement,   { y: '0%', duration: 0.9 }, 0.5)
      .to(this.nameLine1.nativeElement, { y: '0%', duration: 1.1 }, 0.65)
      .to(this.nameLine2.nativeElement, { y: '0%', duration: 1.1 }, 0.78)
      .to(this.roleText.nativeElement,  { y: '0%', duration: 0.9 }, 0.95)

      // Description, buttons, social, stats
      .to(this.description.nativeElement,
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.1)
      .to(this.buttons.nativeElement,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.25)
      .to(this.social.nativeElement,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.38)
      .to(this.statsRow.nativeElement,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.5)

      // Orbital sphere
      .to(this.orbitalContainer.nativeElement,
        { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, 1.2);

    // Floating orbs (loop)
    gsap.to(this.orb1.nativeElement, { y: '-=25', duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to(this.orb2.nativeElement, { y: '+=30', duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  // ─── Orbital Animation (GSAP ticker) ─────────────────────────────────────
  private startOrbital(): void {
    const container = this.orbitalContainer.nativeElement;
    const outerEls  = Array.from(container.querySelectorAll('.badge-outer'))       as HTMLElement[];
    const innerEls  = Array.from(container.querySelectorAll('.badge-inner-orbit')) as HTMLElement[];

    // Radii (elliptical for 3-D feel)
    const R_OUT_X = 170;
    const R_OUT_Y = 62;   // ellipse Y = 3D tilt
    const R_IN_X  = 116;
    const R_IN_Y  = 42;

    this.tickerFn = () => {
      this.orbitAngle += 0.006;
      const neg = -this.orbitAngle * 0.65;

      outerEls.forEach((el, i) => {
        const a = this.orbitAngle + (i / outerEls.length) * Math.PI * 2;
        gsap.set(el, {
          x:       Math.cos(a) * R_OUT_X,
          y:       Math.sin(a) * R_OUT_Y,
          opacity: 0.55 + Math.sin(a) * 0.4,
          scale:   0.88 + Math.sin(a) * 0.12,
          zIndex:  Math.sin(a) > 0 ? 20 : 2,
        });
      });

      innerEls.forEach((el, i) => {
        const a = neg + (i / innerEls.length) * Math.PI * 2;
        gsap.set(el, {
          x:       Math.cos(a) * R_IN_X,
          y:       Math.sin(a) * R_IN_Y,
          opacity: 0.5 + Math.sin(a) * 0.4,
          scale:   0.85 + Math.sin(a) * 0.12,
          zIndex:  Math.sin(a) > 0 ? 20 : 2,
        });
      });
    };

    gsap.ticker.add(this.tickerFn);
  }

  scrollTo(target: string): void {
    this.lenisScroll.scrollTo(target);
  }

  ngOnDestroy(): void {
    if (this.tickerFn) gsap.ticker.remove(this.tickerFn);
  }
}
