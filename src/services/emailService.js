require("dotenv").config();
import nodemailer from "nodemailer";


// Tạo transporter dùng chung
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hle183414@gmail.com',
      pass: 'xurappdkwhloekbi',
    },
  });
};

// Tạo nội dung email đặt lịch
const getBookingEmailBody = (data) => {
  const { language, patientName, time, doctorName, redirectLink, date } = data;

  if (language === "vi") {
    return `
      <h3><b>Xin chào ${patientName}!</b></h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên hệ thống.</p>
      <p><b>Thông tin đặt lịch:</b></p>
      <div><b>Thời gian:</b> ${time}</div>
      <div><b>Ngày:</b> ${date}</div>
      <div><b>Bác sĩ:</b> ${doctorName}</div>
      <p>Vui lòng xác nhận lịch bằng cách click vào link bên dưới:</p>
      <a href="${redirectLink}" target="_blank">Xác nhận</a>
      <div>Xin cảm ơn!</div>
    `;
  }

  return `
    <h2><b>Xin chào ${patientName}!</b></h2>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên hệ thống.</p>
      <p><h4><b>Thông tin đặt lịch:</b></h4></p>
      <div><b>Thời gian:</b> ${time}</div>
      <div><b>Ngày:</b> ${date}</div>
      <div><b>Bác sĩ:</b> ${doctorName}</div>
      <p>Vui lòng xác nhận lịch bằng cách click vào link bên dưới:</p>
      <a href="${redirectLink}" target="_blank">Xác nhận</a>
      <div>Xin cảm ơn!</div>
  `;
};



// Email lấy lại mật khẩu
const getForgotPasswordEmailBody = (data) => {
  const { redirectLink } = data;

  return `
    <h3><b>Xin chào!</b></h3>
    <p>Bạn nhận được email này vì đã yêu cầu lấy lại mật khẩu.</p>
    <p>Vui lòng nhấn vào link bên dưới để tạo mật khẩu mới:</p>
    <a href="${redirectLink}" target="_blank">Tạo lại mật khẩu</a>
    <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    <div>Xin cảm ơn!</div>
  `;
};

// Gửi email đặt lịch
const sendSimpleEmail = async (dataSend) => {
  const transporter = getTransporter();
  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Booking"}" <${process.env.EMAIL_APP}>`,
      to: dataSend.receiverEmail,
      subject: "Thông tin đặt lịch khám bệnh",
      html: getBookingEmailBody(dataSend),
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error); 
  }
};

// Gửi email quên mật khẩu
const sendForgotPasswordEmail = async (dataSend) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "Booking"}" <${process.env.EMAIL_APP}>`,
    to: dataSend.receiverEmail,
    subject: "Khôi phục mật khẩu",
    html: getForgotPasswordEmailBody(dataSend),
  });
};

module.exports = {
  sendSimpleEmail,
  sendForgotPasswordEmail,
};
