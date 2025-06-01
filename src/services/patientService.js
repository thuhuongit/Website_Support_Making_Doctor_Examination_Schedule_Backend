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


// Hàm này để tạo lịch hẹn cho bệnh nhân và gửi email xác nhận 
let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType || 
        !data.date ||
        !data.lastName ||
        !data.firstName ||
        (data.selectedGender === undefined || data.selectedGender === null) ||  
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
          roleId: "3",
          gender: data.selectedGender,
          address: data.address,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone, 
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
      // Lấy thông tin bác sĩ từ db
      let doctor = await db.User.findOne({
         where: { id: data.doctorId },
         attributes: ['firstName', 'lastName'],
         raw: true,
    });

      if (!doctor) {
          return resolve({
             errCode: 3,
             errMessage: "Doctor not found",
     });
   }

         // Ghép tên bác sĩ đầy đủ
       let doctorName = doctor.lastName + " " + doctor.firstName;


      // Gửi email
      await emailService.sendSimpleEmail({
        receiverEmail: data.email,
        patientName: `${data.lastName} ${data.firstName}`,
        time: data.timeType, 
        date: dateString,
        doctorName: doctorName,
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

// Hàm này sẽ dùng để xác nhận lịch hẹn từ email 
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
