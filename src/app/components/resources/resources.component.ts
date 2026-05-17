import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RevealService } from '../../services/reveal.service';

interface HubCard {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  badgeTone: 'live' | 'soon' | 'notes';
  ready: boolean;
  externalUrl: string;
  cover: {
    initials: string;
    gradientFrom: string;
    gradientTo: string;
  };
}

const LEARN_HUB_BASE = 'https://dotnet-zero-to-heroo.vercel.app';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
})
export class ResourcesComponent implements OnInit, AfterViewInit {
  readonly hubUrl = LEARN_HUB_BASE;

  cards: HubCard[] = [
    {
      slug: 'dotnet',
      title: '.NET Roadmap',
      tagline: 'Backend · 9 phases',
      description:
        'Zero-to-hero .NET interview roadmap — C#, ASP.NET Core, EF Core, system design, DevOps. Real examples in Indian English, phase-by-phase.',
      badge: 'LIVE',
      badgeTone: 'live',
      ready: true,
      externalUrl: `${LEARN_HUB_BASE}/dotnet`,
      cover: { initials: '.NET', gradientFrom: '#512BD4', gradientTo: '#8B5CF6' },
    },
    {
      slug: 'angular',
      title: 'Angular Roadmap',
      tagline: 'Frontend · Modern',
      description:
        'Angular 19+ — standalone components, signals, control flow, RxJS deep-dive, OnPush strategy, modern routing and SSR.',
      badge: 'SOON',
      badgeTone: 'soon',
      ready: false,
      externalUrl: `${LEARN_HUB_BASE}/angular`,
      cover: { initials: 'NG', gradientFrom: '#DD0031', gradientTo: '#C3002F' },
    },
    {
      slug: 'react',
      title: 'React Roadmap',
      tagline: 'Frontend · Next.js',
      description:
        'Hooks, Context, Redux Toolkit, React Query, Next.js App Router, Server Components and streaming — the modern React stack.',
      badge: 'SOON',
      badgeTone: 'soon',
      ready: false,
      externalUrl: `${LEARN_HUB_BASE}/react`,
      cover: { initials: 'REACT', gradientFrom: '#61DAFB', gradientTo: '#0EA5E9' },
    },
    {
      slug: 'notes',
      title: 'Notes & PDFs',
      tagline: 'Premium · Interview Prep',
      description:
        '4 interview-ready PDFs — Angular, .NET Senior, .NET Fresher, React. Direct download, read on screen or print.',
      badge: 'NEW',
      badgeTone: 'notes',
      ready: true,
      externalUrl: `${LEARN_HUB_BASE}/notes`,
      cover: { initials: 'PDF', gradientFrom: '#F59E0B', gradientTo: '#DC2626' },
    },
  ];

  constructor(
    private reveal: RevealService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.reveal.init();
  }
}
