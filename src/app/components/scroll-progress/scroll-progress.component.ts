import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Thin progress bar pinned to the top of the viewport that tracks
 * how far the user has scrolled down the page.
 *
 * Updates via passive scroll + rAF throttle, so it stays smooth even
 * when Lenis is firing many scroll events per second.
 */
@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  template: `<div class="bar" [style.transform]="transform()"></div>`,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      z-index: 60;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.04);
    }
    .bar {
      height: 100%;
      background: linear-gradient(90deg, #c9a86a 0%, #818cf8 70%, #22d3ee 100%);
      transform-origin: left center;
      transform: scaleX(0);
      will-change: transform;
      transition: transform 0.05s linear;
      box-shadow: 0 0 12px rgba(201, 168, 106, 0.35);
    }
  `],
})
export class ScrollProgressComponent implements OnInit, OnDestroy {
  private rafScheduled = false;
  private listener?: () => void;

  transform = signal('scaleX(0)');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const onScroll = () => {
      if (this.rafScheduled) return;
      this.rafScheduled = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        this.transform.set(`scaleX(${pct})`);
        this.rafScheduled = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    this.listener = () => window.removeEventListener('scroll', onScroll);
    // initial
    onScroll();
  }

  ngOnDestroy(): void {
    this.listener?.();
  }
}
