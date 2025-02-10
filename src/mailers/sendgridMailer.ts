import sgMail from '@sendgrid/mail';

class SendgridMailerService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  public sendMail({to, from, subject, text, html}) {
    const msg = { to, from, subject, text, html };
    return sgMail.send(msg);
  }
}

export const sendgridMailerService = new SendgridMailerService();