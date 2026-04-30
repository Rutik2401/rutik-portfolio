import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealService } from '../../services/reveal.service';

interface Resource {
  slug: string;
  title: string;
  shortName: string;
  badge: string;
  badgeTone: 'new' | 'senior' | 'fresher';
  level: string;
  audience: string;
  description: string;
  topics: string[];
  pages: string;
  questions: string;
  updated: string;
  pdfPath: string;
  pdfSize: string;
  cover: {
    icon: string;
    initials: string;
    gradientFrom: string;
    gradientTo: string;
    accent: string;
  };
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
})
export class ResourcesComponent implements OnInit, AfterViewInit {
  resources: Resource[] = [
    {
      slug: 'angular',
      title: 'Angular Interview Roadmap',
      shortName: 'angular-roadmap',
      badge: 'BEST SELLER',
      badgeTone: 'new',
      level: 'Junior → Senior',
      audience: 'For Angular developers preparing for product-company interviews.',
      description:
        'A complete Angular 17/18 interview prep — covers signals, change detection internals, RxJS patterns, NgRx, lazy-loading, SSR, and architectural questions asked at top product companies.',
      topics: ['Signals', 'Change Detection', 'RxJS', 'NgRx', 'SSR', 'Performance', 'Testing'],
      pages: '130+',
      questions: '90+',
      updated: 'Apr 2025',
      pdfPath: 'assets/notes/angular/notes.pdf',
      pdfSize: '8 MB',
      cover: {
        icon: 'A',
        initials: 'NG',
        gradientFrom: '#dd0031',
        gradientTo: '#7d0019',
        accent: '#ff5577',
      },
    },
    {
      slug: 'dotnet-senior',
      title: '.NET Interview Roadmap',
      shortName: 'dotnet-senior',
      badge: 'LATEST',
      badgeTone: 'senior',
      level: '0 – 2.5 years experience',
      audience: 'Senior-style answers tuned for the 0–2.5 years experience window.',
      description:
        'Premium edition with senior-style answers covering C# 12, .NET 8, ASP.NET Core internals, EF Core, Clean Architecture, and the trickiest follow-ups asked in product-company interviews.',
      topics: ['C# 12', '.NET 8', 'ASP.NET Core', 'EF Core', 'Clean Arch.', 'Web API', 'SOLID'],
      pages: '135+',
      questions: '80+',
      updated: 'Apr 2025',
      pdfPath: 'assets/notes/dotnet-senior/notes.pdf',
      pdfSize: '6.8 MB',
      cover: {
        icon: '#',
        initials: '.NET',
        gradientFrom: '#512bd4',
        gradientTo: '#1f0d63',
        accent: '#a78bfa',
      },
    },
    {
      slug: 'dotnet-fresher',
      title: '.NET & C# Interview Q&A',
      shortName: 'dotnet-fresher',
      badge: 'FRESHER FRIENDLY',
      badgeTone: 'fresher',
      level: 'Fresher → Mid-level',
      audience: 'Fast-paced Q&A pack designed for fresher and mid-level interviews.',
      description:
        '75+ modern, tricky and most-asked C# / .NET questions with crisp direct answers, key points, code snippets and follow-up Qs — designed for quick revision before interviews.',
      topics: ['C# Fundamentals', 'OOP', 'LINQ', 'Async', 'EF Core', 'Web API', 'Tricky Qs'],
      pages: '90+',
      questions: '75+',
      updated: 'Apr 2025',
      pdfPath: 'assets/notes/dotnet-fresher/notes.pdf',
      pdfSize: '5.6 MB',
      cover: {
        icon: '?',
        initials: 'C#',
        gradientFrom: '#10b981',
        gradientTo: '#064e3b',
        accent: '#34d399',
      },
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

  download(resource: Resource, ev?: Event): void {
    ev?.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    const a = document.createElement('a');
    a.href = resource.pdfPath;
    a.download = `${resource.shortName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
