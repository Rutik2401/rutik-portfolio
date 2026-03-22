import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

export interface EmailPayload {
  name: string;
  email: string;
  message: string;
}

/**
 * EmailJS setup (one-time):
 * 1. Go to https://www.emailjs.com  and create a free account
 * 2. Add an Email Service → connect your Gmail (rutikpimpale2401@gmail.com)
 * 3. Create an Email Template with these variables:
 *      {{from_name}}   {{from_email}}   {{message}}
 *    Set "To Email" in the template to your Gmail address.
 * 4. Replace the three constants below with your actual IDs
 *    (Dashboard → Account → Public Key / Email Services / Email Templates)
 */
const SERVICE_ID  = 'service_yi431dn';
const TEMPLATE_ID = 'template_cg21u3m';
const PUBLIC_KEY  = 'RGyt3U9jPgVAqZB10';

@Injectable({ providedIn: 'root' })
export class EmailService {

  async send(payload: EmailPayload): Promise<void> {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name:  payload.name,
        from_email: payload.email,
        message:    payload.message,
        to_email:   'rutikpimpale2401@gmail.com',
      },
      PUBLIC_KEY,
    );
  }
}
