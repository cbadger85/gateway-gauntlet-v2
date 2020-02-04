import formatDistance from 'date-fns/formatDistance';
import fs from 'fs';
import mjml2html from 'mjml';
import { createTransport, Transporter } from 'nodemailer';
import { Service } from 'typedi';
import util from 'util';
import User from '../users/entities/users.entity';
import { getEmojiLog } from '../utils/getEmojiLog';

@Service()
class EmailService {
  private readonly FIRST_NAME = '%FIRST_NAME%';
  private readonly PASSWORD_EXPIRATION = '%PASSWORD_EXPIRATION%';
  private readonly PASSWORD_LINK = '%PASSWORD_LINK%';
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  readTemplateFromDisk = async (template: EmailTemplate): Promise<string> => {
    const readFile = util.promisify(fs.readFile);

    return await readFile(`${__dirname}/templates/${template}.mjml`, 'utf8');
  };

  sendNewUserEmail = async ({
    firstName,
    passwordExpiration,
    id,
    email,
    passwordResetId,
  }: User): Promise<void> => {
    const template = await this.readTemplateFromDisk('new-user');

    const expirationDate = formatDistance(
      passwordExpiration || new Date(Date.now()),
      new Date(Date.now()),
    );

    const passwordResetLink = `${process.env.ROOT_URL}/users/${id}/password/${passwordResetId}/reset?new=true`;

    const newUserEmail = template
      .replace(this.PASSWORD_LINK, passwordResetLink)
      .replace(this.PASSWORD_EXPIRATION, expirationDate)
      .replace(this.FIRST_NAME, firstName);

    const { html, errors } = mjml2html(newUserEmail);

    if (errors && errors.length) {
      console.log('Malformed email "new-user"');
      console.error(errors);
      return;
    }

    this.transporter
      .sendMail({
        from: '"NO REPLY" <NO_REPLY@gatewaygauntlet.com>',
        to: email,
        subject: 'Gateway Gauntlet - Registration',
        text: `Your account has been set up. Please go to ${passwordResetLink} to set your password. This link will expire in ${expirationDate}`,
        html,
      })
      .then(info => {
        console.log(
          getEmojiLog('👋', 'New user email sent!'),
          `messageId: ${info.messageId}`,
        );
      })
      .catch(e => {
        console.error(e);
      });
  };

  sendResetPasswordEmail = async ({
    firstName,
    passwordExpiration,
    id,
    passwordResetId,
    email,
  }: User): Promise<void> => {
    const template = await this.readTemplateFromDisk('reset-password');

    const expirationDate = formatDistance(
      passwordExpiration || new Date(Date.now()),
      new Date(Date.now()),
    );

    const passwordResetLink = `${process.env.ROOT_URL}/users/${id}/password/${passwordResetId}/reset`;

    const newUserEmail = template
      .replace(this.PASSWORD_LINK, passwordResetLink)
      .replace(this.PASSWORD_EXPIRATION, expirationDate)
      .replace(this.FIRST_NAME, firstName);

    const { html, errors } = mjml2html(newUserEmail);

    if (errors && errors.length) {
      console.log('Malformed email "reset-password"');
      console.error(errors);
      return;
    }

    this.transporter
      .sendMail({
        from: '"NO REPLY" <NO_REPLY@gatewaygauntlet.com>',
        to: email,
        subject: 'Gateway Gauntlet - Reset Password',
        text: `Your password has been reset. Go to ${passwordResetLink} to change it. This link will expire in ${expirationDate}`,
        html,
      })
      .then(info => {
        console.log(
          getEmojiLog('🔏', 'Password reset email sent!!'),
          `messageId: ${info.messageId}`,
        );
      })
      .catch(e => {
        console.error(e);
      });
  };
}

export default EmailService;

type EmailTemplate = 'new-user' | 'reset-password';
