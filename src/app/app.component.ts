import {
  Component,
  OnInit,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LenisScrollService } from './services/lenis-scroll.service';
import { RevealService } from './services/reveal.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CursorComponent } from './components/cursor/cursor.component';
import { BootScreenComponent } from './components/boot-screen/boot-screen.component';
import { ScrollProgressComponent } from './components/scroll-progress/scroll-progress.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResourcesFooterComponent } from './components/resources-footer/resources-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BootScreenComponent,
    ScrollProgressComponent,
    NavbarComponent,
    CursorComponent,
    FooterComponent,
    ResourcesFooterComponent,
  ],
  template: `
    <app-boot-screen />
    <app-scroll-progress />
    <app-cursor />
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    @if (isResourcesRoute()) {
      <app-resources-footer />
    } @else {
      <app-footer />
    }
  `,
  styles: [`
    :host { display: block; }
    main { display: block; }
  `],
})
export class AppComponent implements OnInit, AfterViewInit {
  isResourcesRoute = signal(false);

  constructor(
    private lenisScroll: LenisScrollService,
    private reveal: RevealService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.lenisScroll.init();

    this.isResourcesRoute.set(this.router.url.startsWith('/resources'));

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.isResourcesRoute.set(e.urlAfterRedirects.startsWith('/resources'));
        setTimeout(() => this.reveal.refresh(), 50);
      });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.reveal.init();
  }
}
