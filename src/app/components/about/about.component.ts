import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Stat {
  value: string;
  label: string;
  accent: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('aboutSection') aboutSection!: ElementRef;
  @ViewChild('textCol') textCol!: ElementRef;
  @ViewChild('statsCol') statsCol!: ElementRef;

  stats: Stat[] = [
    { value: '1.5+', label: 'Years Experience', accent: '#818cf8' },
    { value: '4+', label: 'Projects Built', accent: '#22d3ee' },
    { value: '3+', label: 'Tech Stacks', accent: '#a78bfa' },
    { value: '2', label: 'Certifications', accent: '#34d399' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);
    this.animateSection();
  }

  private animateSection(): void {
    // Text column
    gsap.from(this.textCol.nativeElement.children, {
      scrollTrigger: {
        trigger: this.textCol.nativeElement,
        start: 'top 80%',
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
    });

    // Stats stagger
    const cards = this.statsCol.nativeElement.querySelectorAll('.stat-card');
    gsap.from(cards, {
      scrollTrigger: {
        trigger: this.statsCol.nativeElement,
        start: 'top 80%',
        once: true,
      },
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }
}
