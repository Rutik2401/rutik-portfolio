import { Component } from '@angular/core';

interface Skill {
  name: string;
  level: number;
  color: string;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  skillCategories: SkillCategory[] = [
    {
      name: 'FRONTEND',
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
      name: 'BACKEND',
      skills: [
        { name: 'Java', level: 82, color: 'linear-gradient(90deg, #f89820, #d05a00)' },
        { name: 'Spring Boot', level: 78, color: 'linear-gradient(90deg, #6db33f, #4a8f25)' },
        { name: 'Spring MVC', level: 75, color: 'linear-gradient(90deg, #6db33f, #4a8f25)' },
        { name: 'SQL', level: 72, color: 'linear-gradient(90deg, #336791, #4f8dc9)' },
        { name: 'JDBC', level: 68, color: 'linear-gradient(90deg, #818cf8, #6366f1)' },
      ],
    },
    {
      name: 'TOOLS',
      skills: [
        { name: 'Git & GitHub', level: 85, color: 'linear-gradient(90deg, #f05032, #d63b1f)' },
        { name: 'Postman', level: 80, color: 'linear-gradient(90deg, #ff6c37, #e55a2b)' },
        { name: 'Maven', level: 72, color: 'linear-gradient(90deg, #c71a36, #a01228)' },
        { name: 'Docker', level: 70, color: 'linear-gradient(90deg, #2496ed, #1a7bc4)' },
      ],
    },
  ];
}
