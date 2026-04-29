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
  @ViewChild('heroCard') heroCard!: ElementRef;

  constructor(
    private lenisScroll: LenisScrollService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Wait one frame so styles are applied, then run timeline immediately
    requestAnimationFrame(() => this.runIntroTimeline());
  }

  // ─── Entrance Timeline ────────────────────────────────────────────────────
  private runIntroTimeline(): void {
    // ── 1. Split text into animated units ──────────────────────────────────
    // Name → per-character  (mask-reveal + blur)
    // Target inner .name-line span so gradient-text class is preserved
    const nameSpan1 = this.nameLine1.nativeElement.querySelector('.name-line') as HTMLElement;
    const nameSpan2 = this.nameLine2.nativeElement.querySelector('.name-line') as HTMLElement;
    const chars1 = this.splitIntoChars(nameSpan1, true);
    const chars2 = this.splitIntoChars(nameSpan2, true);
    // Role → per-word
    const roleWords = this.splitIntoWords(this.roleText.nativeElement);

    // ── 2. Set initial hidden states ───────────────────────────────────────
    // "Hi, I'm" — whole-line mask (outer .line-clip already clips it)
    gsap.set(this.hiLine.nativeElement, { y: '105%' });

    // Name chars — below their individual char-mask clips, with blur
    gsap.set([...chars1, ...chars2], { y: '115%', filter: 'blur(12px)' });

    // Role words — same treatment, lighter blur
    gsap.set(roleWords, { y: '110%', filter: 'blur(8px)' });

    // CSS keeps these parents at opacity:0 until JS runs, preventing FOUC on reload.
    // Now that chars are positioned off-screen and ready, reveal the parents.
    const parents = [
      this.hiLine.nativeElement,
      this.nameLine1.nativeElement,
      this.nameLine2.nativeElement,
      this.roleText.nativeElement,
    ];
    parents.forEach((el) => (el.style.animation = 'none')); // disable CSS fallback
    gsap.set(parents, { opacity: 1 });

    // ── 3. Master timeline ─────────────────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl
      // Ambient orbs fade in (slow, atmospheric)
      .to([this.orb1.nativeElement, this.orb2.nativeElement],
        { opacity: 1, duration: 2.2, ease: 'power1.inOut' }, 0)

      // Availability badge
      .to(this.badge.nativeElement,
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.25)

      // "Hi, I'm" — single line mask reveal
      .to(this.hiLine.nativeElement,
        { y: '0%', duration: 0.85 }, 0.42)

      // "Rutik" — character reveal with stagger + blur clear
      .to(chars1, {
        y: '0%',
        filter: 'blur(0px)',
        duration: 1.0,
        stagger: 0.048,
      }, 0.58)

      // "Pimpale." — character reveal, starts before "Rutik" finishes
      .to(chars2, {
        y: '0%',
        filter: 'blur(0px)',
        duration: 1.0,
        stagger: 0.044,
      }, 0.72)

      // "Full Stack Developer" — word reveal
      .to(roleWords, {
        y: '0%',
        filter: 'blur(0px)',
        duration: 0.82,
        stagger: 0.09,
      }, 1.08)

      // Description
      .to(this.description.nativeElement,
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 1.28)

      // CTA buttons
      .to(this.buttons.nativeElement,
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 1.42)

      // Social links
      .to(this.social.nativeElement,
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 1.54)

      // Code card
      .to(this.heroCard.nativeElement,
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 1.3);

    // Floating orbs (infinite loop — atmospheric depth)
    gsap.to(this.orb1.nativeElement, { y: '-=25', duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to(this.orb2.nativeElement, { y: '+=30', duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  // ─── Split Helpers ────────────────────────────────────────────────────────

  /** Wraps every character in <span class="char-mask"><span class="char-inner"> */
  private splitIntoChars(el: HTMLElement, addGradient = false): HTMLElement[] {
    const text = el.innerText;
    el.innerHTML = '';
    const inners: HTMLElement[] = [];

    for (const char of text) {
      const mask = document.createElement('span');
      mask.className = 'char-mask';

      const inner = document.createElement('span');
      inner.className = addGradient ? 'char-inner gradient-text' : 'char-inner';
      inner.textContent = char === ' ' ? '\u00A0' : char;

      mask.appendChild(inner);
      el.appendChild(mask);
      inners.push(inner);
    }

    return inners;
  }

  /** Wraps every word in <span class="char-mask"><span class="char-inner"> */
  private splitIntoWords(el: HTMLElement): HTMLElement[] {
    const words = el.innerText.split(' ');
    el.innerHTML = '';
    const inners: HTMLElement[] = [];

    words.forEach((word, i) => {
      const mask = document.createElement('span');
      mask.className = 'char-mask';

      const inner = document.createElement('span');
      inner.className = 'char-inner';
      inner.textContent = word;

      mask.appendChild(inner);
      el.appendChild(mask);
      inners.push(inner);

      if (i < words.length - 1) {
        el.appendChild(document.createTextNode('\u00A0'));
      }
    });

    return inners;
  }

  scrollTo(target: string): void {
    this.lenisScroll.scrollTo(target);
  }

  ngOnDestroy(): void { }
}
