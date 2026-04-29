import { Injectable, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Watches `.reveal` / `.reveal-x` elements and adds `.is-visible` when they
 * scroll into view. Replaces what GSAP ScrollTrigger was doing for fade-ins.
 *
 * Usage:
 *   <div class="reveal">...</div>           // fades up
 *   <div class="reveal-x">...</div>         // slides in from left
 *   <div class="reveal" data-reveal-delay="100">...</div>  // 100ms stagger
 *
 * Call `refresh()` after content changes (or once at app start when all
 * sections have rendered).
 */
@Injectable({ providedIn: 'root' })
export class RevealService implements OnDestroy {
  private observer?: IntersectionObserver;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  init(): void {
    if (!this.isBrowser || this.observer) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = el.dataset['revealDelay'];
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-visible');
          this.observer!.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    this.refresh();
  }

  /** Re-scan the document for any new reveal targets not yet observed. */
  refresh(): void {
    if (!this.isBrowser || !this.observer) return;
    document
      .querySelectorAll(
        '.reveal:not(.is-visible), .reveal-x:not(.is-visible), .reveal-bar:not(.is-visible)',
      )
      .forEach((el) => {
        this.observer!.observe(el);
      });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
