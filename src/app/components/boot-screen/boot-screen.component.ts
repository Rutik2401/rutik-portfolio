import {
  Component,
  OnInit,
  PLATFORM_ID,
  Inject,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface BootLine {
  text: string;
  delay: number;
}

@Component({
  selector: 'app-boot-screen',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="boot-screen" [class.is-fading]="fading()">
        <div class="boot-stage">
          <div class="boot-name">
            <span class="glitch" data-text="RUTIK">RUTIK</span>
          </div>
          <div class="boot-status">
            <span class="boot-status-text">{{ currentLine() }}</span>
            <span class="boot-status-dots"></span>
          </div>
          <div class="boot-progress">
            <div class="boot-progress-fill" [style.width.%]="progress()"></div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
    }

    .boot-screen {
      position: fixed;
      inset: 0;
      background: #050505;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      animation: boot-screen-in 0.3s ease-out both;
      transition: opacity 0.6s ease-out, visibility 0.6s;
      background-image:
        linear-gradient(180deg, transparent 50%, rgba(255, 255, 255, 0.012) 50%);
      background-size: 100% 3px;
    }

    @keyframes boot-screen-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .boot-screen.is-fading {
      opacity: 0;
      visibility: hidden;
    }

    .boot-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.75rem;
      padding: 2rem;
    }

    .boot-name {
      font-family: 'JetBrains Mono', monospace;
      font-size: clamp(3.5rem, 12vw, 8rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #fafafa;
      line-height: 1;
      text-transform: uppercase;
      animation: boot-name-flicker 1.8s steps(1) 0.1s;
    }

    @keyframes boot-name-flicker {
      0%, 8%   { opacity: 0;   transform: translate(0, 0); }
      9%       { opacity: 1;   transform: translate(-2px, 1px); }
      10%      { opacity: 0.4; transform: translate(2px, -1px); }
      11%, 18% { opacity: 1;   transform: translate(0, 0); }
      19%      { opacity: 0.6; transform: translate(-1px, 0); }
      20%, 100%{ opacity: 1;   transform: translate(0, 0); }
    }

    .boot-status {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      letter-spacing: 0.16em;
      color: rgba(255, 255, 255, 0.55);
      text-transform: uppercase;
      min-height: 1.4em;
      transition: opacity 0.2s ease;
    }

    .boot-status-text {
      color: #c9a86a;
    }

    .boot-status-dots::after {
      content: '';
      display: inline-block;
      letter-spacing: 0.25em;
      animation: boot-dots 1s steps(4) infinite;
    }

    @keyframes boot-dots {
      0%   { content: ''; }
      25%  { content: '.'; }
      50%  { content: '..'; }
      75%  { content: '...'; }
      100% { content: ''; }
    }

    .boot-progress {
      width: clamp(180px, 28vw, 280px);
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      overflow: hidden;
      position: relative;
    }

    .boot-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #c9a86a, #818cf8);
      transition: width 0.3s linear;
    }

    /* Glitch effect (matches global .glitch utility) */
    .glitch {
      position: relative;
      display: inline-block;
    }

    .glitch::before, .glitch::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
    }

    .glitch::before {
      color: rgba(34, 211, 238, 0.85);
      transform: translate(-2px, 0);
      clip-path: polygon(0 0, 100% 0, 100% 38%, 0 38%);
      animation: gx-1 0.6s steps(1) infinite;
      mix-blend-mode: screen;
    }

    .glitch::after {
      color: rgba(255, 77, 109, 0.85);
      transform: translate(2px, 0);
      clip-path: polygon(0 62%, 100% 62%, 100% 100%, 0 100%);
      animation: gx-2 0.7s steps(1) infinite;
      mix-blend-mode: screen;
    }

    @keyframes gx-1 {
      0%, 100% { transform: translate(-2px, 0); }
      30%      { transform: translate(2px, -1px); }
      60%      { transform: translate(-3px, 1px); }
    }
    @keyframes gx-2 {
      0%, 100% { transform: translate(2px, 0); }
      40%      { transform: translate(-2px, 1px); }
      70%      { transform: translate(3px, -1px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .boot-name, .glitch::before, .glitch::after { animation: none; }
    }
  `],
})
export class BootScreenComponent implements OnInit {
  private readonly LINES: BootLine[] = [
    { text: 'INITIALIZING',         delay: 0 },
    { text: 'LOADING PROFILE',      delay: 500 },
    { text: 'COMPILING ASSETS',     delay: 1000 },
    { text: 'READY',                delay: 1700 },
  ];
  private readonly TOTAL_MS = 2200;
  private readonly FADE_MS = 600;

  visible = signal(false);
  fading = signal(false);
  private currentIndex = signal(0);
  currentLine = computed(() => this.LINES[this.currentIndex()]?.text ?? '');
  progress = signal(0);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Only run the loader when the user lands on the home URL.
    // Direct visits to /resources, /resources/:slug, etc. skip the boot animation.
    const path = window.location.pathname;
    if (path !== '/' && path !== '') return;

    this.visible.set(true);

    // Step through the loading lines
    this.LINES.forEach((line, i) => {
      setTimeout(() => this.currentIndex.set(i), line.delay);
    });

    // Drive the progress bar
    const startedAt = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const pct = Math.min(100, (elapsed / this.TOTAL_MS) * 100);
      this.progress.set(pct);
      if (elapsed < this.TOTAL_MS) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Fade out then fully unmount
    setTimeout(() => this.fading.set(true), this.TOTAL_MS);
    setTimeout(() => this.visible.set(false), this.TOTAL_MS + this.FADE_MS);
  }
}
