import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();


const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
    },
});

export const sendOtpMail = async (to, otp) => {


    const htmlTemplate = `
   <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Password Reset OTP</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial, sans-serif;">

  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:#ff6b00;padding:20px;text-align:center;color:#fff;">
      <h1 style="margin:0;font-size:22px;">🍔 Food Delivery App</h1>
    </div>

    <!-- Body -->
    <div style="padding:30px;text-align:center;">

      <h2 style="color:#333;margin-bottom:10px;">Password Reset Request</h2>

      <p style="color:#666;font-size:14px;">
        We received a request to reset your password. Use the OTP below to proceed.
      </p>

      <!-- OTP Box -->
      <div style="margin:25px 0;">
        <div style="display:inline-block;padding:15px 30px;font-size:26px;letter-spacing:6px;font-weight:bold;background:#fff3e6;color:#ff6b00;border:2px dashed #ff6b00;border-radius:8px;">
          {{OTP}}
        </div>
      </div>

      <p style="color:#999;font-size:13px;">
        This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.
      </p>

      <a href="#" style="display:inline-block;margin-top:20px;padding:12px 20px;background:#ff6b00;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
        Reset Password
      </a>

    </div>

    <!-- Footer -->
    <div style="background:#f9f9f9;padding:15px;text-align:center;font-size:12px;color:#888;">
      If you didn’t request this, you can safely ignore this email.
    </div>

  </div>

</body>
</html>
`.replace("{{OTP}}", otp);


    await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to,
        subject: "Reset password Otp", // subject line
        // plain text body
        html: htmlTemplate,
    })

    
}