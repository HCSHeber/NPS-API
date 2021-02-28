import nodemailer, { Transporter } from 'nodemailer';
import handlebars from "handlebars";
import fs from 'fs';

class SendMailService{
  private client: Transporter;
  constructor() {
    nodemailer.createTestAccount((err, account) => {
      if (err) {
          console.error('Failed to create a testing account. ' + err.message);
          return process.exit(1);
      }
  
      const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
              user: account.user,
              pass: account.pass
          },
          tls: {
            rejectUnauthorized: false
        }
      });

      this.client = transporter;

    });
  }

  async execute(to, subject, body: object, path) {
    const templateFileContent = fs.readFileSync(path).toString("utf8");

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse(body);
    const message = await this.client.sendMail({
        to,
        subject,
        html,
        from: "noreply@contato.com"
      });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }

}

export default new SendMailService();