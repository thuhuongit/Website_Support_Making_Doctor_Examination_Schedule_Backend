import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
let buildUrlEmail = (doctorId) => {
  const token = uuidv4(); // Tạo token ngẫu nhiên
  const baseUrl = process.env.BASE_URL || "http://localhost:5173"; 
  const result = `${baseUrl}/verify-booking?token=${token}&doctorId=${doctorId}`; // Tạo đường dẫn
  return result;
};


let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra các tham số cần thiết
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
        return; // Đảm bảo thoát khỏi hàm khi thiếu tham số
      }

      // Tạo token duy nhất cho lịch hẹn
      let token = uuidv4();

      // Lấy tên bác sĩ từ doctorId
      let doctor = await db.User.findOne({
        where: { id: data.doctorId },
        attributes: ['firstName', 'lastName'],
      });

      if (!doctor) {
        resolve({
          errCode: 1,
          errMessage: "Doctor not found",
        });
        return;
      }

      let doctorName = `${doctor.lastName} ${doctor.firstName}`;

      // Lấy giờ từ bảng Booking
      let booking = await db.Booking.findOne({
        where: { doctorId: data.doctorId, date: data.date, timeType: data.timeType }
      });

      // Kiểm tra nếu không tìm thấy giờ tương ứng
      if (!booking) {
        resolve({
          errCode: 1,
          errMessage: "No booking found for the specified time",
        });
        return;
      }

      let timeString = booking.timeType || 'Unknown Time'; // Lấy giờ từ bảng Booking

      // Kiểm tra và format ngày
      let dateMoment = moment(data.date, 'YYYY-MM-DD'); // Đảm bảo định dạng ngày chuẩn 'YYYY-MM-DD'
      let dateString = dateMoment.isValid() ? dateMoment.format('DD/MM/YYYY') : 'Invalid date';

      if (dateString === 'Invalid date') {
        resolve({
          errCode: 1,
          errMessage: "Invalid date format",
        });
        return; // Ngừng thực hiện nếu ngày không hợp lệ
      }

      // Gửi email xác nhận lịch khám
      await emailService.sendSimpleEmail({
        receiverEmail: data.email,
        patientName: data.fullName,
        time: timeString,
        date: dateString,
        doctorName: doctorName,
        language: data.language,
        redirectLink: buildUrlEmail(data.doctorId, token),  // Gọi hàm tạo link
      });

      // Kiểm tra và tạo user nếu chưa tồn tại
      let [user, created] = await db.User.findOrCreate({
        where: { email: data.email },
        defaults: {
          email: data.email,
          roleId: "R3",  // Bệnh nhân
          gender: data.selectedGender,
          address: data.address,
          firstName: data.fullName,
          phone: data.phone || null,
        },
      });

      if (user) {
        // Tạo lịch hẹn
        await db.Booking.create({
          statusId: "S1",  // Lịch hẹn mới, đang chờ xác nhận
          doctorId: data.doctorId,
          patientId: user.id,
          date: data.date,
          timeType: data.timeType,
          token: token,  // Ghi token vào lịch hẹn
        });

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
