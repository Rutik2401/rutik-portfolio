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
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LenisScrollService } from '../../services/lenis-scroll.service';

interface NavLink {
  label: string;
  href: string;       // anchor on the home page (e.g. "#about")
  routerPath?: string; // if set, this link routes to a different page (e.g. "/resources")
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
    { label: 'Resources', href: '/resources', routerPath: '/resources' },
    { label: 'Contact', href: '#contact' },
  ];

  isScrolled = signal(false);
  isHidden = signal(false);
  mobileOpen = signal(false);
  activeSection = signal('hero');
  currentUrl = signal('/');

  private lastScrollY = 0;
  private scrollThreshold = 150;
  private hideDelta = 8;
  private sectionObserver?: IntersectionObserver;

  constructor(
    private lenisScroll: LenisScrollService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.currentUrl.set(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentUrl.set(e.urlAfterRedirects);
        // Section observer must be re-bound after route changes — sections
        // exist only on the home route.
        setTimeout(() => this.initSectionObserver(), 50);
      });

    this.initSectionObserver();
  }

  private initSectionObserver(): void {
    this.sectionObserver?.disconnect();
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );

    sections.forEach((section) => this.sectionObserver!.observe(section));
  }

  isOnHome(): boolean {
    return this.currentUrl() === '/' || this.currentUrl().startsWith('/#');
  }

  isLinkActive(link: NavLink): boolean {
    if (link.routerPath) {
      return this.currentUrl().startsWith(link.routerPath);
    }
    return this.isOnHome() && this.activeSection() === link.href.slice(1);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scrollY = window.scrollY;
    const delta = scrollY - this.lastScrollY;

    if (scrollY > 30) this.isScrolled.set(true);
    else if (scrollY < 10) this.isScrolled.set(false);

    if (Math.abs(delta) < this.hideDelta) return;

    if (delta > 0 && scrollY > this.scrollThreshold) {
      this.isHidden.set(true);
    } else if (delta < 0) {
      this.isHidden.set(false);
    }
    this.lastScrollY = scrollY;
  }

  navigateTo(link: NavLink): void {
    if (link.routerPath) {
      this.router.navigateByUrl(link.routerPath);
      return;
    }

    // Anchor link — scroll on home, otherwise navigate home then scroll.
    if (this.isOnHome()) {
      this.lenisScroll.scrollTo(link.href);
    } else {
      this.router.navigateByUrl('/').then(() => {
        // give the home component a tick to render its sections
        setTimeout(() => this.lenisScroll.scrollTo(link.href), 80);
      });
    }
  }

  goHome(): void {
    if (this.isOnHome()) {
      this.lenisScroll.scrollTo('#hero');
    } else {
      this.router.navigateByUrl('/');
    }
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
