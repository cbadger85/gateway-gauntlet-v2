import mjml2html from 'mjml';
import { createTransport } from 'nodemailer';
import EmailService from '../../email/email.service';
import Container from 'typedi';
import { Role } from '../../auth/models/Role';
import formatDistance from 'date-fns/formatDistance';

jest.mock('util', () => ({
  promisify: jest
    .fn()
    .mockReturnValue(
      jest
        .fn()
        .mockResolvedValue(
          '%FIRST_NAME% %PASSWORD_EXPIRATION% %PASSWORD_LINK%',
        ),
    ),
}));

jest.mock('mjml', () => jest.fn());

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: '1234' }),
  }),
}));

beforeEach(jest.clearAllMocks);

describe('EmailService', () => {
  let emailService: EmailService;

  beforeAll(() => {
    Container.set(EmailService, new EmailService());
    emailService = Container.get(EmailService);
  });

  describe('constructor', () => {
    it('should create a transport', () => {
      const options = {
        host: expect.stringContaining('smtp'),
        port: expect.any(Number),
        secure: expect.any(Boolean),
        auth: {
          user: expect.any(String),
          pass: expect.any(String),
        },
      };

      new EmailService();

      expect(createTransport).toBeCalledWith(options);
    });
  });

  describe('sendNewUserEmail', () => {
    it('should read the template from the disk', async () => {
      (mjml2html as jest.Mock).mockReturnValueOnce({
        html: '<html>email</html>',
        errors: [],
      });

      jest.spyOn(emailService, 'readTemplateFromDisk');

      const user = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
        passwordExpiration: new Date(Date.now() + 3600000),
      };

      await emailService.sendNewUserEmail(user);

      expect(emailService.readTemplateFromDisk).toBeCalledWith('new-user');
    });

    it('should parse the template', async () => {
      (mjml2html as jest.Mock).mockReturnValueOnce({
        html: '<html>email</html>',
        errors: [],
      });
      const user = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
        passwordExpiration: new Date(Date.now() + 3600000),
      };
      const passwordResetLink = `${process.env.ROOT_URL}/password/reset/${user.id}`;

      const expirationDate = formatDistance(
        user.passwordExpiration,
        new Date(Date.now()),
      );

      const parsedTemplate = `${user.firstName} ${expirationDate} ${passwordResetLink}`;

      await emailService.sendNewUserEmail(user);

      expect(mjml2html).toBeCalledWith(parsedTemplate);
    });

    it('should call transporter.sendMail', async () => {
      (mjml2html as jest.Mock).mockReturnValueOnce({
        html: '<html>email</html>',
        errors: [],
      });
      const user = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
        passwordExpiration: new Date(Date.now() + 3600000),
      };

      const sendMailOptions = {
        from: expect.any(String),
        to: user.email,
        subject: expect.any(String),
        text: expect.any(String),
        html: '<html>email</html>',
      };

      await emailService.sendNewUserEmail(user);

      expect(createTransport().sendMail).toBeCalledWith(sendMailOptions);
    });

    it('should call transporter.sendMail', async () => {
      (mjml2html as jest.Mock).mockReturnValueOnce({
        html: '<html>email</html>',
        errors: [],
      });
      const user = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
        passwordExpiration: new Date(Date.now() + 3600000),
      };

      const sendMailOptions = {
        from: expect.any(String),
        to: user.email,
        subject: expect.any(String),
        text: expect.any(String),
        html: '<html>email</html>',
      };

      await emailService.sendNewUserEmail(user);

      expect(createTransport().sendMail).toBeCalledWith(sendMailOptions);
    });

    it('should not call transporter.sendMail if there are errors in the template', async () => {
      (mjml2html as jest.Mock).mockReturnValueOnce({
        html: null,
        errors: [new Error('oops')],
      });
      const user = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
        passwordExpiration: new Date(Date.now() + 3600000),
      };

      await emailService.sendNewUserEmail(user);

      expect(createTransport().sendMail).not.toBeCalled();
    });
  });

  describe('sendResetPassword', () => {
    it('should read the template from the disk', async () => {
      (mjml2html as jest.Mock).mockReturnValueOnce({
        html: '<html>email</html>',
        errors: [],
      });

      jest.spyOn(emailService, 'readTemplateFromDisk');

      const user = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
        passwordExpiration: new Date(Date.now() + 3600000),
      };

      await emailService.sendResetPasswordEmail(user);

      expect(emailService.readTemplateFromDisk).toBeCalledWith(
        'reset-password',
      );
    });

    it('should parse the template', async () => {
      (mjml2html as jest.Mock).mockReturnValueOnce({
        html: '<html>email</html>',
        errors: [],
      });
      const user = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
        passwordExpiration: new Date(Date.now() + 3600000),
      };
      const passwordResetLink = `${process.env.ROOT_URL}/password/reset/${user.id}`;

      const expirationDate = formatDistance(
        user.passwordExpiration,
        new Date(Date.now()),
      );

      const parsedTemplate = `${user.firstName} ${expirationDate} ${passwordResetLink}`;

      await emailService.sendResetPasswordEmail(user);

      expect(mjml2html).toBeCalledWith(parsedTemplate);
    });

    it('should call transporter.sendMail', async () => {
      (mjml2html as jest.Mock).mockReturnValueOnce({
        html: '<html>email</html>',
        errors: [],
      });
      const user = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
        passwordExpiration: new Date(Date.now() + 3600000),
      };

      const sendMailOptions = {
        from: expect.any(String),
        to: user.email,
        subject: expect.any(String),
        text: expect.any(String),
        html: '<html>email</html>',
      };

      await emailService.sendResetPasswordEmail(user);

      expect(createTransport().sendMail).toBeCalledWith(sendMailOptions);
    });

    it('should call transporter.sendMail', async () => {
      (mjml2html as jest.Mock).mockReturnValueOnce({
        html: '<html>email</html>',
        errors: [],
      });
      const user = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
        passwordExpiration: new Date(Date.now() + 3600000),
      };

      const sendMailOptions = {
        from: expect.any(String),
        to: user.email,
        subject: expect.any(String),
        text: expect.any(String),
        html: '<html>email</html>',
      };

      await emailService.sendNewUserEmail(user);

      expect(createTransport().sendMail).toBeCalledWith(sendMailOptions);
    });

    it('should not call transporter.sendMail if there are errors in the template', async () => {
      (mjml2html as jest.Mock).mockReturnValueOnce({
        html: null,
        errors: [new Error('oops')],
      });
      const user = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
        passwordExpiration: new Date(Date.now() + 3600000),
      };

      await emailService.sendResetPasswordEmail(user);

      expect(createTransport().sendMail).not.toBeCalled();
    });
  });
});
