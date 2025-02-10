import nodemailer from 'nodemailer';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class NodeMailer {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'rpshreevarshini@gmail.com',
          pass: 'shdjlzmzubooipdu',
      },
    });
  }

  public sendMail(mailOptions: MailOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            reject(error);
        } else {
            resolve(info.response);
        }
      });
    });
  }
}

export const nodeMailerService = new NodeMailer();
