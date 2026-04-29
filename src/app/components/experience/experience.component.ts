import { Component } from '@angular/core';

interface Experience {
  role: string;
  company: string;
  companyUrl: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tags: string[];
  current: boolean;
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
  grade?: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  experiences: Experience[] = [
    {
      role: 'Angular Developer',
      company: 'Sdaemon Infotech Pvt. Ltd',
      companyUrl: '#',
      period: 'Jul 2025 – Present',
      location: 'Pune, Maharashtra, India',
      description:
        'Building and maintaining scalable Angular applications for enterprise clients. Focused on frontend architecture, performance optimization, and clean UI development.',
      highlights: [
        'Developing feature-rich Angular applications for enterprise use cases',
        'Collaborating on frontend architecture and component design',
        'Writing clean, maintainable TypeScript code',
        'Working with REST APIs and integrating third-party services',
      ],
      tags: ['Angular', 'JavaScript', 'TypeScript', 'REST API'],
      current: true,
    },
    {
      role: 'Software Trainee',
      company: 'IWEXE',
      companyUrl: '#',
      period: 'Jun 2024 – Jul 2025',
      location: 'Hinjawadi, Pune, Maharashtra',
      description:
        'Built enterprise-level web applications with Angular and Spring Boot. Led frontend architecture for the Psychometric Test platform serving organizational clients.',
      highlights: [
        'Developed dynamic test engine with configurable question banks',
        'Built real-time scoring and analytics dashboard in Angular',
        'Integrated RESTful APIs with Spring Boot backend',
        'Implemented role-based access control (RBAC)',
      ],
      tags: ['Angular', 'TypeScript', 'Spring Boot', 'Java', 'REST API'],
      current: false,
    },
  ];

  education: Education[] = [
    {
      degree: 'B.E. – Computer Engineering',
      institution: 'Modern Education Society College of Engineering',
      period: 'Jul 2019 – May 2023',
      location: 'Pune, Maharashtra',
      grade: 'Graduated with distinction',
    },
    {
      degree: 'HSC – Science (12th)',
      institution: 'Shri Chhatrapati Shivaji Mahavidyalaya',
      period: 'Jun 2018 – Apr 2019',
      location: 'Shrigonda, Ahmednagar',
    },
    {
      degree: 'SSC – Semi-English (10th)',
      institution: 'Shri Aranyeshwar Vidyalaya, Arangoan',
      period: 'Jun 2016 – Apr 2017',
      location: 'Jamkhed, Ahmednagar',
    },
  ];
}
