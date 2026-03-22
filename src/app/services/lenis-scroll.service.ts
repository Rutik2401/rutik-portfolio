import { Injectable, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class LenisScrollService implements OnDestroy {
  private lenis: any = null;
  private rafId: number = 0;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async init(): Promise<void> {
    if (!this.isBrowser) return;

    try {
      const LenisModule = await import('lenis');
      const Lenis = LenisModule.default;

      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      // Connect Lenis to GSAP ticker for perfect sync
      gsap.ticker.add((time) => {
        this.lenis?.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      // Sync Lenis scroll with ScrollTrigger
      this.lenis.on('scroll', ScrollTrigger.update);

      // Recalculate all scroll positions after Lenis is ready
      setTimeout(() => ScrollTrigger.refresh(), 300);
    } catch (e) {
      // Lenis not available — fall back to native scroll
      console.warn('Lenis smooth scroll not available, using native scroll.');
    }
  }

  scrollTo(target: string | HTMLElement, options?: { offset?: number; duration?: number }): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, {
        offset: options?.offset ?? -72,
        duration: options?.duration ?? 1.2,
      });
    } else if (this.isBrowser && typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  stop(): void {
    this.lenis?.stop();
  }

  start(): void {
    this.lenis?.start();
  }

  destroy(): void {
    this.lenis?.destroy();
    this.lenis = null;
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
