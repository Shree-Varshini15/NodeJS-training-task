import cron from 'node-cron';
import { nodeMailerService } from '../mailers/nodeMailer';
import { sendgridMailerService } from '../mailers/sendgridMailer';

export const setupCronJobs = () => {
  // Sendgrid Mailer
  cron.schedule('0 0 * * *', async () => {
    console.log('Cron job running every minute!');
    try {
      const mailOptions = {
        from: 'rpshreevarshini@gmail.com',
        to: 'rpshreevarshini@gmail.com',
        subject: 'Test Email',
        text: 'Hello from Node.js!',
        html: '<b>Hello from Node.js!</b>',
      };

      const response = await sendgridMailerService.sendMail(mailOptions);
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  })
  
  // NodeMailer
  cron.schedule('0 0 * * *', async () => {
    console.log('Cron job running every minute!');
    try {
      const mailOptions = {
          from: 'rpshreevarshini@gmail.com',
          to: 'recipient@example.com',
          subject: 'Test Email',
          text: 'Hello from Node.js!',
          html: '<b>Hello from Node.js!</b>',
      };

      const response = await nodeMailerService.sendMail(mailOptions);
      console.log(response);
  } catch (error) {
    console.log(error.message);
  }
  });
  console.log('Cron jobs have been scheduled.');
};
