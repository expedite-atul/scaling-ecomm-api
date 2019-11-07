// import * as nodemailer from 'nodemailer';

// export const sendEmail = async (options: any) => {
//   // create a transporter
//   const transporter: nodemailer.Transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });
//   // create the email options
//   const mailOptions = {
//     from: 'Atul Singh <atul@atuls.dev>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//   };
//   // actually send the email
//   await transporter.sendMail(mailOptions);
// };
