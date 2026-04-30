import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Note {
  slug: string;
  label: string;
  symbol: string;
  accent: string;
}

@Component({
  selector: 'app-resources-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './resources-footer.component.html',
  styleUrl: './resources-footer.component.scss',
})
export class ResourcesFooterComponent {
  year = new Date().getFullYear();

  notes: Note[] = [
    { slug: 'angular',        label: 'Angular Roadmap',     symbol: 'A',  accent: '#dd0031' },
    { slug: 'dotnet-senior',  label: '.NET Senior',         symbol: '#',  accent: '#a78bfa' },
    { slug: 'dotnet-fresher', label: '.NET Fresher Q&A',    symbol: '?',  accent: '#34d399' },
  ];

  comingSoon = [
    'RxJS Deep-Dive',
    'System Design Cracked',
    'DSA in C#',
    'React Hooks Mastery',
    'Spring Boot Deep-Dive',
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  scrollTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
