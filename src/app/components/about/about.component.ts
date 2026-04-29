import { Component } from '@angular/core';

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
export class AboutComponent {
  stats: Stat[] = [
    { value: '1.5+', label: 'Years Experience', accent: '#818cf8' },
    { value: '4+', label: 'Projects Built', accent: '#22d3ee' },
    { value: '15+', label: 'Technologies', accent: '#a78bfa' },
    { value: '8+', label: 'Certifications', accent: '#34d399' },
  ];
}
