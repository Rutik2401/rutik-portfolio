import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  Inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EmailService } from '../../services/email.service';

interface SocialLink {
  label: string;
  href: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements AfterViewInit {
  @ViewChild('contactSection') contactSection!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('contentGrid') contentGrid!: ElementRef;

  formName = '';
  formEmail = '';
  formMessage = '';
  formSent = signal(false);
  sending = signal(false);
  formError = signal('');

  socialLinks: SocialLink[] = [
    {
      label: 'linkedin.com/in/rutik-pimpale',
      href: 'https://www.linkedin.com/in/rutik-pimpale/',
      icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
      color: '#0077b5',
    },
    {
      label: 'github.com/Rutik2401',
      href: 'https://github.com/Rutik2401',
      icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
      color: '#f0f6fc',
    },
  ];

  constructor(
    private emailService: EmailService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);
    this.animateSection();
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

    const cols = this.contentGrid.nativeElement.children;
    gsap.from(cols, {
      scrollTrigger: { trigger: this.contentGrid.nativeElement, start: 'top 80%', once: true },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }

  async submitForm(): Promise<void> {
    if (!this.formName.trim() || !this.formEmail.trim() || !this.formMessage.trim()) return;

    this.sending.set(true);
    this.formError.set('');

    try {
      await this.emailService.send({
        name: this.formName,
        email: this.formEmail,
        message: this.formMessage,
      });
      this.formSent.set(true);
    } catch {
      this.formError.set('Failed to send. Please email me directly at rutikpimpale2401@gmail.com');
    } finally {
      this.sending.set(false);
    }
  }
}
