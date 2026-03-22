import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class AnimationService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  /**
   * Split text into individual character spans for animation.
   * Returns an array of span elements inserted into the target element.
   */
  splitTextIntoChars(element: HTMLElement): HTMLElement[] {
    const text = element.textContent || '';
    element.innerHTML = '';
    const chars: HTMLElement[] = [];

    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      element.appendChild(span);
      chars.push(span);
    });

    return chars;
  }

  /**
   * Split text into word spans.
   */
  splitTextIntoWords(element: HTMLElement): HTMLElement[] {
    const text = element.textContent || '';
    element.innerHTML = '';
    const words: HTMLElement[] = [];

    text.split(' ').forEach((word, i) => {
      const wrapper = document.createElement('span');
      wrapper.style.display = 'inline-block';
      wrapper.style.overflow = 'hidden';
      wrapper.style.verticalAlign = 'top';

      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = word;
      wrapper.appendChild(inner);

      if (i < text.split(' ').length - 1) {
        wrapper.innerHTML += '&nbsp;';
      }

      element.appendChild(wrapper);
      words.push(inner);
    });

    return words;
  }

  /**
   * Animate elements into view on scroll using ScrollTrigger.
   */
  fadeInOnScroll(
    elements: HTMLElement | HTMLElement[] | string,
    options: {
      y?: number;
      x?: number;
      opacity?: number;
      duration?: number;
      stagger?: number;
      delay?: number;
      ease?: string;
      start?: string;
      once?: boolean;
    } = {}
  ): ScrollTrigger | undefined {
    if (!this.isBrowser) return;

    const {
      y = 40,
      x = 0,
      opacity = 0,
      duration = 0.8,
      stagger = 0,
      delay = 0,
      ease = 'power3.out',
      start = 'top 85%',
      once = true,
    } = options;

    const trigger = typeof elements === 'string'
      ? (document.querySelector(elements) as HTMLElement)
      : Array.isArray(elements) ? elements[0] : elements;

    return ScrollTrigger.create({
      trigger,
      start,
      once,
      onEnter: () => {
        gsap.from(elements, {
          y,
          x,
          opacity,
          duration,
          stagger,
          delay,
          ease,
          clearProps: 'all',
        });
      },
    });
  }

  /**
   * Create a GSAP ScrollTrigger timeline.
   */
  createScrollTimeline(
    trigger: HTMLElement | string,
    options: {
      start?: string;
      end?: string;
      scrub?: boolean | number;
      pin?: boolean;
      once?: boolean;
    } = {}
  ): gsap.core.Timeline {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: options.start ?? 'top 80%',
        end: options.end,
        scrub: options.scrub,
        pin: options.pin,
        once: options.once ?? true,
        toggleActions: options.once ? 'play none none none' : 'play none none reverse',
      },
    });

    return tl;
  }

  /**
   * Animate a section label + title on scroll.
   */
  animateSectionHeader(container: HTMLElement): void {
    if (!this.isBrowser) return;

    const label = container.querySelector('.section-label');
    const title = container.querySelector('.section-title');
    const subtitle = container.querySelector('.section-subtitle');

    const elements = [label, title, subtitle].filter(Boolean) as HTMLElement[];

    gsap.from(elements, {
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        once: true,
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
    });
  }

  /**
   * 3D tilt effect on mouse move — attach to card elements.
   */
  addTiltEffect(element: HTMLElement, intensity = 10): () => void {
    if (!this.isBrowser) return () => {};

    const onMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      gsap.to(element, {
        rotateY: dx * intensity,
        rotateX: -dy * intensity,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const onLeave = () => {
      gsap.to(element, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    element.addEventListener('mousemove', onMove);
    element.addEventListener('mouseleave', onLeave);

    return () => {
      element.removeEventListener('mousemove', onMove);
      element.removeEventListener('mouseleave', onLeave);
    };
  }

  /**
   * Refresh ScrollTrigger (call after layout changes).
   */
  refreshScrollTrigger(): void {
    if (this.isBrowser) {
      ScrollTrigger.refresh();
    }
  }

  /**
   * Kill all GSAP animations and ScrollTriggers.
   */
  killAll(): void {
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf('*');
    }
  }
}
