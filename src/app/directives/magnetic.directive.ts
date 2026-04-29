import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Subtle magnetic cursor pull on hoverable elements.
 *
 * Apply with `appMagnetic` to any element (CTA, link). The element
 * smoothly translates toward the cursor when the pointer is inside
 * its bounding box, and springs back on leave.
 *
 * Skips on touch devices entirely (no hover, no value).
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements OnInit, OnDestroy {
  /** How far the element travels at the cursor's edge, in pixels. */
  @Input() magneticStrength = 14;

  private listeners: (() => void)[] = [];
  private rafId = 0;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;

  constructor(
    private host: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const el = this.host.nativeElement;
    el.style.willChange = 'transform';

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      this.targetX = dx * this.magneticStrength;
      this.targetY = dy * this.magneticStrength;
      this.startLoop();
    };

    const onLeave = () => {
      this.targetX = 0;
      this.targetY = 0;
      this.startLoop();
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    this.listeners.push(
      () => el.removeEventListener('mousemove', onMove),
      () => el.removeEventListener('mouseleave', onLeave),
    );
  }

  private startLoop(): void {
    if (this.rafId) return;
    const tick = () => {
      // ease toward target
      this.currentX += (this.targetX - this.currentX) * 0.18;
      this.currentY += (this.targetY - this.currentY) * 0.18;

      const el = this.host.nativeElement;
      el.style.transform = `translate3d(${this.currentX.toFixed(2)}px, ${this.currentY.toFixed(2)}px, 0)`;

      const stillMoving =
        Math.abs(this.targetX - this.currentX) > 0.05 ||
        Math.abs(this.targetY - this.currentY) > 0.05;

      if (stillMoving) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        // Snap to exact target and stop
        el.style.transform = `translate3d(${this.targetX.toFixed(2)}px, ${this.targetY.toFixed(2)}px, 0)`;
        this.rafId = 0;
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.listeners.forEach((off) => off());
    this.host.nativeElement.style.transform = '';
    this.host.nativeElement.style.willChange = '';
  }
}
