import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
let buildUrlEmail = (doctorId, token) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:5173"; 
  const result = `${baseUrl}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};



let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra thiếu trường
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType || // chính là giờ rồi
        !data.date ||
        !data.fullName ||
        !data.selectedGender ||
        !data.address
      ) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      }

      // Tạo token duy nhất cho lịch hẹn
      const token = uuidv4();

      // Tạo hoặc lấy user
      let [user] = await db.User.findOrCreate({
        where: { email: data.email },
        defaults: {
          email: data.email,
          roleId: "R3",
          gender: data.selectedGender,
          address: data.address,
          firstName: data.fullName,
        },
      });

      // Tạo booking
      await db.Booking.create({
        statusId: "S1",
        doctorId: data.doctorId,
        patientId: user.id,
        date: data.date,
        timeType: data.timeType, 
        token: token,
      });

      // Format ngày từ `data.date`
      let dateString = moment(data.date).format("DD/MM/YYYY");

      // Gửi email
      await emailService.sendSimpleEmail({
        receiverEmail: data.email,
        patientName: data.fullName,
        time: data.timeType, 
        date: dateString,
        doctorName: data.doctorName,
        language: data.language,
        redirectLink: buildUrlEmail(data.doctorId, token),
      });

      resolve({
        errCode: 0,
        errMessage: "Save info patient succeed!",
      });
    } catch (e) {
      console.error("Error in postBookAppointment:", e);
      reject(e);
    }
  });
};

// let postBookAppointment = (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Kiểm tra các tham số cần thiết
//       if (
//         !data.email ||
//         !data.doctorId ||
//         !data.timeType ||
//         !data.date ||
//         !data.fullName ||
//         !data.selectedGender ||
//         !data.address
//       ) {
//         resolve({
//           errCode: 1,
//           errMessage: "Missing required parameter",
//         });
//         return; // Đảm bảo thoát khỏi hàm khi thiếu tham số
//       }

//       // Tạo token duy nhất cho lịch hẹn
//       let token = uuidv4();

//       // Set cứng tên bác sĩ
//       let doctorName = 'Hoa Lê';  // Set tên bác sĩ cứng

//       // Lấy giờ từ bảng Booking
//       let booking = await db.Booking.findOne({
//         where: { doctorId: data.doctorId, date: data.date, timeType: data.timeType }
//       });

//       // Kiểm tra nếu không tìm thấy giờ tương ứng
//       if (!booking) {
//         resolve({
//           errCode: 1,
//           errMessage: "No booking found for the specified time",
//         });
//         return;
//       }

//       let timeString = booking.timeType || 'Unknown Time'; // Lấy giờ từ bảng Booking

//       // Kiểm tra và format ngày
//       let dateMoment = moment(data.date, 'YYYY-MM-DD'); // Đảm bảo định dạng ngày chuẩn 'YYYY-MM-DD'
//       let dateString = dateMoment.isValid() ? dateMoment.format('DD/MM/YYYY') : 'Invalid date';

//       if (dateString === 'Invalid date') {
//         resolve({
//           errCode: 1,
//           errMessage: "Invalid date format",
//         });
//         return; // Ngừng thực hiện nếu ngày không hợp lệ
//       }

//       // Gửi email xác nhận lịch khám
//       await emailService.sendSimpleEmail({
//         receiverEmail: data.email,
//         patientName: data.fullName,
//         time: timeString,
//         date: dateString,
//         doctorName: doctorName, // Tên bác sĩ cứng
//         language: data.language,
//         redirectLink: buildUrlEmail(data.doctorId, token),  // Gọi hàm tạo link
//       });

//       // Kiểm tra và tạo user nếu chưa tồn tại
//       let [user, created] = await db.User.findOrCreate({
//         where: { email: data.email },
//         defaults: {
//           email: data.email,
//           roleId: "R3",  // Bệnh nhân
//           gender: data.selectedGender,
//           address: data.address,
//           firstName: data.fullName,
//           phone: data.phone || null,
//         },
//       });

//       if (user) {
//         // Tạo lịch hẹn
//         await db.Booking.create({
//           statusId: "S1",  // Lịch hẹn mới, đang chờ xác nhận
//           doctorId: data.doctorId,
//           patientId: user.id,
//           date: data.date,
//           timeType: data.timeType,
//           token: token,  // Ghi token vào lịch hẹn
//         });

//         resolve({
//           errCode: 0,
//           errMessage: "Save patient information and booking succeed!",
//         });
//       } else {
//         resolve({
//           errCode: 1,
//           errMessage: "Failed to create user.",
//         });
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };





let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Received data:", data);  // Log dữ liệu nhận từ frontend
      
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        // Kiểm tra trong DB có tồn tại lịch hẹn với token và doctorId chưa
        let appointment = await db.Booking.findOne({
          where: { doctorId: data.doctorId, token: data.token, statusId: "S1" },
          raw: false,
        });

        if (appointment) {
          console.log("Found appointment, updating status...");  // Log khi tìm thấy lịch hẹn
          appointment.statusId = "S2"; // Cập nhật trạng thái
          await appointment.save(); // Lưu vào cơ sở dữ liệu
          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed!",
          });
        } else {
          console.log("Appointment not found or already updated");  // Log khi không tìm thấy lịch hẹn
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist!",
          });
        }
      }
    } catch (e) {
      console.error("Error in updating appointment:", e);  // Log lỗi
      reject(e);
    }
  });
};


module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
};
