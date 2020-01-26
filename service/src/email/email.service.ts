import { createTestAccount, createTransport, Transporter } from 'nodemailer';

export const getMailTransporter = async (): Promise<Transporter> => {
  const testAccount = await createTestAccount();
  return createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};
