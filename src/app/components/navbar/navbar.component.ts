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
    gsap.from('nav', {
      y: -80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5,
    });
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
    this.isScrolled.set(scrollY > 20);
    this.isHidden.set(scrollY > this.lastScrollY && scrollY > this.scrollThreshold);
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
