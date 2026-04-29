import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  PLATFORM_ID,
  Inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { gsap } from 'gsap';
import { LenisScrollService } from '../../services/lenis-scroll.service';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  navLinks: NavLink[] = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  isScrolled = signal(false);
  isHidden = signal(false);
  mobileOpen = signal(false);
  activeSection = signal('hero');

  private lastScrollY = 0;
  private scrollThreshold = 150;
  private hideDelta = 8; // require 8px of movement to flip hide/show — kills oscillation
  private sectionObserver?: IntersectionObserver;

  constructor(
    private lenisScroll: LenisScrollService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initNavbarAnimation();
    this.initSectionObserver();
  }

  private initNavbarAnimation(): void {
    // CSS animation handles the entrance — no GSAP needed here
    // (avoids opacity:0 inline-style conflict with transition-all)
  }

  private initSectionObserver(): void {
    const sections = document.querySelectorAll('section[id]');
    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach((section) => this.sectionObserver!.observe(section));
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scrollY = window.scrollY;
    const delta = scrollY - this.lastScrollY;

    // Hysteresis around the .scrolled threshold (20 / 30) prevents the class
    // from toggling on every Lenis sub-pixel oscillation near the boundary.
    if (scrollY > 30) this.isScrolled.set(true);
    else if (scrollY < 10) this.isScrolled.set(false);

    // Only flip hidden state on a meaningful scroll delta. Lenis emits frames
    // with tiny direction jitter at scroll endpoints — without this guard the
    // navbar toggles hidden/visible repeatedly causing screen flicker.
    if (Math.abs(delta) < this.hideDelta) return;

    if (delta > 0 && scrollY > this.scrollThreshold) {
      this.isHidden.set(true);
    } else if (delta < 0) {
      this.isHidden.set(false);
    }
    this.lastScrollY = scrollY;
  }

  scrollTo(href: string): void {
    this.lenisScroll.scrollTo(href);
  }

  toggleMobileMenu(): void {
    this.mobileOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileOpen.set(false);
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
  }
}
