import { Component, OnInit, PLATFORM_ID, Inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LenisScrollService } from '../../services/lenis-scroll.service';

const COUNTER_KEY = 'rutik.transmissions';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit {
  visitorCount = signal('0000');

  constructor(
    private lenisScroll: LenisScrollService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.bumpCounter();
  }

  scrollTo(target: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.lenisScroll.scrollTo(target);
  }

  private bumpCounter(): void {
    try {
      const prev = Number(localStorage.getItem(COUNTER_KEY) ?? '0');
      const next = prev + 1;
      localStorage.setItem(COUNTER_KEY, String(next));
      // 4-digit zero-padded display, capped at 9999
      this.visitorCount.set(String(Math.min(next, 9999)).padStart(4, '0'));
    } catch {
      this.visitorCount.set('0001');
    }
  }
}
