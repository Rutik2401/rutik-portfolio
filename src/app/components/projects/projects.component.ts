import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationService } from '../../services/animation.service';

interface ProjectStat {
  value: string;
  label: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  stats: ProjectStat[];
  tags: string[];
  github: string;
  live: string | null;
  accentColor: string;
  previewGradient: string;
  icon: string;
  featured: boolean;
  status?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgClass],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('projectsSection') projectsSection!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('projectsGrid') projectsGrid!: ElementRef;

  private tiltCleanup: (() => void)[] = [];

  projects: Project[] = [
    {
      id: 1,
      title: 'Psychometric Test Application',
      category: 'ENTERPRISE ASSESSMENT PLATFORM',
      description:
        'Enterprise-level psychometric assessment platform built at IWEXE. Features dynamic test generation, adaptive scoring algorithms, and a comprehensive analytics dashboard for organizational talent management.',
      stats: [
        { value: 'RBAC', label: 'Auth' },
        { value: 'REST', label: 'APIs' },
        { value: 'SPA', label: 'Type' },
      ],
      tags: ['Angular', 'TypeScript', 'Spring Boot', 'Java', 'REST API'],
      github: 'https://github.com/Rutik2401',
      live: null,
      accentColor: '#818cf8',
      previewGradient: 'linear-gradient(135deg, #1a1f3c 0%, #0d1225 100%)',
      icon: '🧠',
      featured: true,
      status: 'In Progress @ IWEXE',
    },
    {
      id: 2,
      title: 'Movie Recommendation System',
      category: 'RECOMMENDATION ENGINE',
      description:
        'Personalized movie recommendation engine using collaborative filtering algorithms. Features secure JWT-based authentication, Spring MVC architecture, and a fully responsive UI.',
      stats: [
        { value: 'MVC', label: 'Architecture' },
        { value: 'JWT', label: 'Auth' },
        { value: '100%', label: 'Responsive' },
      ],
      tags: ['Java', 'Spring MVC', 'JDBC', 'HTML5', 'CSS3', 'Bootstrap'],
      github: 'https://github.com/Rutik2401',
      live: 'https://primetechies.in',
      accentColor: '#22d3ee',
      previewGradient: 'linear-gradient(135deg, #0c2340 0%, #061525 100%)',
      icon: '🎬',
      featured: true,
    },
    {
      id: 3,
      title: 'Cinema Explorer',
      category: 'MOVIE DISCOVERY APP',
      description:
        'Real-time movie discovery platform powered by the TMDB API. Built with React and Axios for live data fetching. Features instant search, category browsing, and smooth navigation.',
      stats: [
        { value: 'TMDB', label: 'API' },
        { value: 'React', label: 'Frontend' },
        { value: 'SPA', label: 'Type' },
      ],
      tags: ['React', 'JavaScript ES6+', 'Axios', 'React Router', 'Bootstrap 5'],
      github: 'https://github.com/Rutik2401',
      live: 'https://moviebyprime.netlify.app/',
      accentColor: '#a78bfa',
      previewGradient: 'linear-gradient(135deg, #1e1040 0%, #0f0820 100%)',
      icon: '🎥',
      featured: false,
    },
    {
      id: 4,
      title: 'Loan Prediction ML Model',
      category: 'MACHINE LEARNING MODEL',
      description:
        'Machine learning pipeline for loan approval prediction using SVM, Random Forest, and Decision Tree algorithms. Achieved 45% improvement in accuracy through rigorous feature engineering.',
      stats: [
        { value: '45%', label: 'Accuracy boost' },
        { value: '3', label: 'ML Algorithms' },
        { value: 'SVM', label: 'Best model' },
      ],
      tags: ['Machine Learning', 'SVM', 'Random Forest', 'JavaScript', 'HTML5'],
      github: 'https://github.com/Rutik2401',
      live: null,
      accentColor: '#34d399',
      previewGradient: 'linear-gradient(135deg, #0c2a1f 0%, #061510 100%)',
      icon: '🤖',
      featured: false,
    },
  ];

  constructor(
    private animationService: AnimationService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);
    this.animateSection();
    this.initTiltEffects();
  }

  private animateSection(): void {
    gsap.from(this.header.nativeElement.children, {
      scrollTrigger: { trigger: this.header.nativeElement, start: 'top 82%', once: true },
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
    });

    const cards = this.projectsGrid.nativeElement.querySelectorAll('.project-card');
    gsap.from(cards, {
      scrollTrigger: { trigger: this.projectsGrid.nativeElement, start: 'top 82%', once: true },
      y: 60,
      opacity: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }

  private initTiltEffects(): void {
    setTimeout(() => {
      const cards = this.projectsGrid.nativeElement.querySelectorAll('.project-card');
      cards.forEach((card: HTMLElement) => {
        const cleanup = this.animationService.addTiltEffect(card, 4);
        this.tiltCleanup.push(cleanup);
      });
    }, 500);
  }

  ngOnDestroy(): void {
    this.tiltCleanup.forEach((fn) => fn());
  }
}
