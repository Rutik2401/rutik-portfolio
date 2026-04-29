import { Component, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';

interface ProjectStat {
  value: string;
  label: string;
}

interface Project {
  id: number;
  title: string;
  shortName: string;       // file-list label, e.g. "codeshield-ai"
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
  year: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgClass],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  selectedIndex = signal(0);

  projects: Project[] = [
    {
      id: 1,
      title: 'CodeShield AI',
      shortName: 'codeshield-ai',
      category: 'AI CODE REVIEWER & SECURITY AUDITOR',
      description:
        'AI-powered code reviewer and security auditor that analyzes code for bugs, vulnerabilities, and best practices. Multi-provider AI pipeline with Google Gemini as primary and Groq + Cerebras as automatic fallbacks. Features Monaco editor, JWT + OAuth (Google & GitHub), PDF/Markdown export, and a dashboard with Chart.js statistics. Ships as a Web app and a GitHub bot.',
      stats: [
        { value: '3', label: 'AI Providers' },
        { value: 'OAuth', label: 'Google + GitHub' },
        { value: 'PDF', label: 'Export' },
      ],
      tags: ['Angular 19', 'Spring Boot 4', 'PostgreSQL', 'Gemini AI', 'Tailwind CSS', 'Monaco'],
      github: 'https://github.com/Rutik2401/codeshield-ai',
      live: 'https://revidex.vercel.app/',
      accentColor: '#10b981',
      previewGradient: 'linear-gradient(135deg, #052e2b 0%, #021a17 100%)',
      icon: '🛡️',
      featured: true,
      year: '2025',
    },
    {
      id: 2,
      title: 'Movie Recommendation System',
      shortName: 'movie-recommend',
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
      year: '2024',
    },
    {
      id: 3,
      title: 'StriRatna — स्त्रीरत्न',
      shortName: 'striratna',
      category: 'PREMIUM JEWELLERY E-COMMERCE',
      description:
        'Production-ready storefront for a 1gm art jewellery brand from Maharashtra. Supabase backend with Row-Level Security, Cashfree Drop-In payments via a signed Edge Function webhook, WhatsApp order channel, and a protected admin console for products, categories, and orders.',
      stats: [
        { value: 'Cashfree', label: 'Payments' },
        { value: 'RLS', label: 'Security' },
        { value: 'Admin', label: 'Console' },
      ],
      tags: ['Angular 19', 'Supabase', 'Tailwind v4', 'Cashfree', 'PostgreSQL', 'Edge Functions'],
      github: 'https://github.com/Rutik2401',
      live: 'https://striratna.vercel.app/',
      accentColor: '#f59e0b',
      previewGradient: 'linear-gradient(135deg, #2d1b0c 0%, #160d05 100%)',
      icon: '💎',
      featured: true,
      year: '2025',
    },
    {
      id: 4,
      title: 'Loan Prediction ML Model',
      shortName: 'loan-prediction-ml',
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
      year: '2023',
    },
  ];

  selected = computed(() => this.projects[this.selectedIndex()]);

  select(i: number): void {
    this.selectedIndex.set(i);
  }

  statusLabel(p: Project): string {
    if (p.status) return p.status;
    return p.live ? 'LIVE' : 'ARCHIVED';
  }

  statusClass(p: Project): string {
    if (p.status) return 'is-progress';
    return p.live ? 'is-active' : '';
  }
}
