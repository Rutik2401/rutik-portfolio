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

interface Skill {
  name: string;
  level: number;
  color: string;
}

interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements AfterViewInit {
  @ViewChild('skillsSection') skillsSection!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('categoriesGrid') categoriesGrid!: ElementRef;
  @ViewChild('badgeCloud') badgeCloud!: ElementRef;

  skillCategories: SkillCategory[] = [
    {
      name: 'Frontend',
      icon: '⚡',
      skills: [
        { name: 'Angular', level: 90, color: 'linear-gradient(90deg, #dd0031, #c3002f)' },
        { name: 'TypeScript', level: 85, color: 'linear-gradient(90deg, #3178c6, #5ba5f7)' },
        { name: 'JavaScript (ES6+)', level: 88, color: 'linear-gradient(90deg, #f7df1e, #f0c000)' },
        { name: 'HTML5 / CSS3', level: 92, color: 'linear-gradient(90deg, #e44d26, #f16529)' },
        { name: 'React.js', level: 72, color: 'linear-gradient(90deg, #61dafb, #20b2d8)' },
        { name: 'Tailwind CSS', level: 85, color: 'linear-gradient(90deg, #06b6d4, #0891b2)' },
      ],
    },
    {
      name: 'Backend',
      icon: '🔧',
      skills: [
        { name: 'Java', level: 82, color: 'linear-gradient(90deg, #f89820, #d05a00)' },
        { name: 'Spring Boot', level: 78, color: 'linear-gradient(90deg, #6db33f, #4a8f25)' },
        { name: 'Spring MVC', level: 75, color: 'linear-gradient(90deg, #6db33f, #4a8f25)' },
        { name: 'SQL', level: 72, color: 'linear-gradient(90deg, #336791, #4f8dc9)' },
        { name: 'JDBC', level: 68, color: 'linear-gradient(90deg, #818cf8, #6366f1)' },
      ],
    },
    {
      name: 'Tools & Ecosystem',
      icon: '🛠',
      skills: [
        { name: 'Git & GitHub', level: 85, color: 'linear-gradient(90deg, #f05032, #d63b1f)' },
        { name: 'Postman', level: 80, color: 'linear-gradient(90deg, #ff6c37, #e55a2b)' },
        { name: 'Maven', level: 72, color: 'linear-gradient(90deg, #c71a36, #a01228)' },
        { name: 'Bootstrap', level: 88, color: 'linear-gradient(90deg, #7952b3, #6330a0)' },
        { name: 'Docker', level: 70, color: 'linear-gradient(90deg, #2496ed, #1a7bc4)' },
      ],
    },
  ];

  allTech = [
    { name: 'Angular', color: '#dd0031' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'JavaScript', color: '#f7df1e' },
    { name: 'Java', color: '#f89820' },
    { name: 'Spring Boot', color: '#6db33f' },
    { name: 'React', color: '#61dafb' },
    { name: 'Tailwind CSS', color: '#06b6d4' },
    { name: 'Bootstrap', color: '#7952b3' },
    { name: 'HTML5', color: '#e44d26' },
    { name: 'CSS3', color: '#264de4' },
    { name: 'SQL', color: '#336791' },
    { name: 'Git', color: '#f05032' },
    { name: 'Postman', color: '#ff6c37' },
    { name: 'Maven', color: '#c71a36' },
    { name: 'Docker', color: '#2496ed' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);
    this.animateSection();
  }

  private animateSection(): void {
    // Header
    gsap.from(this.header.nativeElement.children, {
      scrollTrigger: {
        trigger: this.header.nativeElement,
        start: 'top 82%',
        once: true,
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
    });

    // Category cards stagger
    const cards = this.categoriesGrid.nativeElement.querySelectorAll('.category-card');
    gsap.from(cards, {
      scrollTrigger: {
        trigger: this.categoriesGrid.nativeElement,
        start: 'top 82%',
        once: true,
      },
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      onComplete: () => this.animateBars(),
    });

    // Badge cloud
    const pills = this.badgeCloud.nativeElement.querySelectorAll('.tech-pill');
    gsap.from(pills, {
      scrollTrigger: {
        trigger: this.badgeCloud.nativeElement,
        start: 'top 88%',
        once: true,
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power2.out',
    });
  }

  private animateBars(): void {
    const bars = document.querySelectorAll('.skill-bar');
    bars.forEach((bar) => {
      const el = bar as HTMLElement;
      const level = el.getAttribute('data-level') ?? '0';
      gsap.to(el, {
        width: `${level}%`,
        duration: 1.2,
        ease: 'power2.out',
        delay: Math.random() * 0.3,
      });
    });
  }
}
