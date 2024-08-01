import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendConfirmationEmail(email: string, token: string) {
    const url = `http://localhost:3333/auth/verify?token=${token}`;
    await this.transporter.sendMail({
      to: email,
      subject: 'Email Confirmation',
      html: `
        <div style="text-align: center; padding: 20px;">
          <h2>Merhaba!</h2>
          <p>Hesabınızı doğrulamak için aşağıdaki butona tıklayınız:</p>
          <a href="${url}" style="
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            cursor: pointer;
          ">Hesabı Doğrula</a>
        </div>
      `,
    });
  }
}