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

    const onEnterLink = () => document.body.classList.add('cursor-hover');
    const onLeaveLink = () => document.body.classList.remove('cursor-hover');

    document.addEventListener('mousemove', onMove);

    // Attach hover listeners to interactive elements dynamically
    const attachHoverListeners = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
        el.addEventListener('mouseenter', onEnterLink);
        el.addEventListener('mouseleave', onLeaveLink);
      });
    };

    // Observe DOM for newly added interactive elements
    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    attachHoverListeners();

    // Hide cursor when leaving window
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    this.listeners.push(
      () => document.removeEventListener('mousemove', onMove),
      () => document.removeEventListener('mouseleave', onLeave),
      () => document.removeEventListener('mouseenter', onEnter),
      () => observer.disconnect(),
    );
  }

  ngOnDestroy(): void {
    this.listeners.forEach((remove) => remove());
  }
}
