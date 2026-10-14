import nodemailer from "nodemailer";
export const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: email,
      subject,
      text: message,
    });
  } catch (error) {
    console.log("Email sending failed:", error.message);
    throw error;
  }
};
