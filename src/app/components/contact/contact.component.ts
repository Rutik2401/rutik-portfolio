import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { EmailService } from '../../services/email.service';

interface SocialLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
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
    },
    {
      label: 'github.com/Rutik2401',
      href: 'https://github.com/Rutik2401',
    },
    {
      label: 'instagram.com/rutik_pimpale',
      href: 'https://www.instagram.com/rutik_pimpale/',
    },
    {
      label: 'twitter.com/rutik_pimpale',
      href: 'https://twitter.com/',
    },
  ];

  constructor(private emailService: EmailService) {}

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
