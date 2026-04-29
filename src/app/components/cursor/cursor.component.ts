import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-cursor',
  standalone: true,
  template: `
    <div #cursorDot class="cursor-dot"></div>
    <div #cursorRing class="cursor-ring"></div>
  `,
  styles: [`
    :host { display: block; pointer-events: none; }

    .cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      width: 8px;
      height: 8px;
      background: #818cf8;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, background 0.2s;
      mix-blend-mode: screen;
    }

    .cursor-ring {
      position: fixed;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      border: 1.5px solid rgba(129, 140, 248, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
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
  `],
})
export class CursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cursorDot') cursorDot!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorRing') cursorRing!: ElementRef<HTMLDivElement>;

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
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: 'power2.out',
      });
    };

    document.addEventListener('mousemove', onMove);

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
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);

    // Hide cursor when leaving window
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
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
    this.listeners.forEach((remove) => remove());
  }
}
