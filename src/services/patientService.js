import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId) => {
  const token = uuidv4(); // Tạo token ngẫu nhiên
  const baseUrl = process.env.BASE_URL || "http://localhost:5173"; // URL gốc, ưu tiên từ biến môi trường
  const result = `${baseUrl}/verify-booking?token=${token}&doctorId=${doctorId}`; // Tạo đường dẫn
  return result;
};


let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem có thiếu thông tin không
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.selectedGender ||
        !data.address 
        
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        // Tạo token duy nhất cho lịch hẹn
        let token = uuidv4();

        // Gửi email xác nhận lịch khám
        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId),
        });

        // Kiểm tra và tạo user nếu chưa tồn tại
        let [user, created] = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3", // Bệnh nhân
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
            phone: data.phone, // Lưu số điện thoại vào User
          },
        });

        // Nếu tạo thành công user thì tạo lịch khám
        if (user) {
          await db.Booking.create({
            statusId: "S1", // Lịch hẹn mới, đang chờ xác nhận
            doctorId: data.doctorId,
            patientId: user.id,
            date: data.date,
            timeType: data.timeType,
            token: token,
          });

          // Trả về kết quả thành công
          resolve({
            errCode: 0,
            errMessage: "Save patient information and booking succeed!",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "Failed to create user.",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};




let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: { doctorId: data.doctorId, token: data.token, statusId: "S1" },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S2"; // Cập nhật trạng thái
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
};
