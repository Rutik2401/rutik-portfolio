import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Custom cursor — pure CSS positioning via translate3d on a single
 * requestAnimationFrame loop with smooth lerp on the outer ring.
 * No GSAP, no per-event tweens.
 */
@Component({
  selector: 'app-cursor',
  standalone: true,
  template: `
    <div #cursorDot class="cursor-dot"></div>
    <div #cursorRing class="cursor-ring"></div>
  `,
  styles: [`
    :host { display: block; pointer-events: none; }

    .cursor-dot,
    .cursor-ring {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      transform: translate3d(-100px, -100px, 0) translate(-50%, -50%);
      will-change: transform;
    }

    .cursor-dot {
      width: 8px;
      height: 8px;
      background: #818cf8;
      border-radius: 50%;
      z-index: 9999;
      transition: width 0.2s, height 0.2s, background 0.2s, opacity 0.2s;
      mix-blend-mode: screen;
    }

    .cursor-ring {
      width: 40px;
      height: 40px;
      border: 1.5px solid rgba(129, 140, 248, 0.5);
      border-radius: 50%;
      z-index: 9998;
      transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.2s;
    }

    :host-context(body.cursor-hover) .cursor-dot {
      width: 12px;
      height: 12px;
      background: #22d3ee;
    }

    :host-context(body.cursor-hover) .cursor-ring {
      width: 60px;
      height: 60px;
      border-color: rgba(34, 211, 238, 0.4);
    }

    .cursor-dot.is-hidden,
    .cursor-ring.is-hidden { opacity: 0; }
  `],
})
export class CursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cursorDot') cursorDot!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorRing') cursorRing!: ElementRef<HTMLDivElement>;

  private mouseX = -100;
  private mouseY = -100;
  private ringX = -100;
  private ringY = -100;
  private rafId = 0;
  private listeners: (() => void)[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initCursor();
  }

  private initCursor(): void {
    const dot = this.cursorDot.nativeElement;
    const ring = this.cursorRing.nativeElement;

    const onMove = (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };

    const tick = () => {
      // Dot snaps to cursor, ring lerps for smooth trail
      dot.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0) translate(-50%, -50%)`;

      this.ringX += (this.mouseX - this.ringX) * 0.18;
      this.ringY += (this.mouseY - this.ringY) * 0.18;
      ring.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0) translate(-50%, -50%)`;

      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);

    // Event delegation: one listener handles all interactive elements,
    // including ones added later. No MutationObserver = no scroll jank.
    const HOVER_SELECTOR = 'a, button, [data-cursor-hover]';
    const onPointerOver = (e: Event) => {
      if ((e.target as Element).closest?.(HOVER_SELECTOR)) {
        document.body.classList.add('cursor-hover');
      }
    };
    const onPointerOut = (e: Event) => {
      const from = e.target as Element;
      const to = (e as MouseEvent).relatedTarget as Element | null;
      if (from.closest?.(HOVER_SELECTOR) && !to?.closest?.(HOVER_SELECTOR)) {
        document.body.classList.remove('cursor-hover');
      }
    };

    const onLeave = () => {
      dot.classList.add('is-hidden');
      ring.classList.add('is-hidden');
    };
    const onEnter = () => {
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    this.listeners.push(
      () => document.removeEventListener('mousemove', onMove),
      () => document.removeEventListener('pointerover', onPointerOver),
      () => document.removeEventListener('pointerout', onPointerOut),
      () => document.removeEventListener('mouseleave', onLeave),
      () => document.removeEventListener('mouseenter', onEnter),
    );
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.listeners.forEach((remove) => remove());
  }
}
