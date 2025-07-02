import express, { Router } from "express"
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import adminController from "../controllers/adminController";
import upload from '../middleware/uploadImage';
 
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD); 
    router.get('/edit-crud', homeController.getEditCRUD); 
    router.post('/put-crud', homeController.putCRUD); 
    router.get('/delete-crud', homeController.deleteCRUD);
    router.post('/api/login', userController.handleLogin);
    router.get('/allcode', userController.getAllCode); 
    router.post("/api/user-forgot-password", userController.postForgotPassword);
    router.post(
      "/api/verify-retrieve-password",
      userController.postVerifyRetrievePassword
    );
    router.get("/api/allcode", userController.getAllCode);
    router.get(
      "/api/get-extra-infor-doctor-by-id",
      doctorController.getExtraInforDoctorById
    );
    router.get(
      "/api/get-profile-doctor-by-id",
      doctorController.getProfileDoctorById
    );

// Giao diện Admin 

     // Màn hình Dashboarh 
    router.get("/api/get-weekly-revenue", adminController.getWeeklyRevenue); //Tổng doanh thu 7 ngày gần nhất
    router.get("/api/get-total-new-user-day", adminController.getTotalNewUserDay); // Tổng số người dùng mới trong hôm nay 
    router.get(
      "/api/get-total-health-appointment-done",
      adminController.getTotalHealthAppointmentDone
    ); // Tổng số cuộc hẹn đã hoàn thành
    router.get("/api/get-total-doctor", adminController.getTotalDoctor);//Tổng số bác sĩ

    // Màn hình ManageUser
    router.get('/api/get-all-users', userController.getAllUsers); // Hiển thị tất cả user 
    router.post('/api/create-new-user', upload.single('avatar'), userController.handleCreateNewUser); //Thêm user
    router.delete('/api/delete-user', userController.handleDeleteUser); // Xóa user
    router.put("/api/edit-user", upload.single("avatar"), userController.handleEditUser); // Sửa user

    // Màn hình Quản lý kế hoạch khám bệnh 
    router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
    router.delete("/api/delete-schedule", doctorController.deleteSchedule); // Chỉnh sửa lịch khám bệnh

    // Màn hình Quản lý chuyên khoa 
    router.get("/api/get-specialty", specialtyController.getAllSpecialty);// lấy tất cả chuyên khoa
    router.post("/api/create-new-specialty", upload.single("image"), specialtyController.createSpecialty); // Thêm chuyên khoa 
    router.delete("/api/delete-specialty", specialtyController.deleteSpecialty); // xóa chuyên khoa 
    router.put('/api/edit-specialty', upload.single("image"), specialtyController.editSpecialty); // sửa chuyên khoa 



    // Màn hình phòng khám 
    router.get("/api/get-clinic", clinicController.getAllClinic); // lấy tất cả phòng khám 
    router.post("/api/create-new-clinic", upload.single("image"), clinicController.createClinic); //Thêm phòng khám
    router.delete("/api/delete-clinic", clinicController.deleteClinic);//xóa phòng khám
    router.put('/api/edit-clinic', upload.single("image"), clinicController.editClinic); //Sửa phòng khám


    // Màn hình quản lý thông tin bác sĩ 
    router.get("/api/get-all-doctors", doctorController.getAllDoctors);
    router.post("/api/save-infor-doctors", doctorController.postInforDoctor);
    router.get("/api/get-all-doctor-infos", doctorController.getAllDoctorInfos);
    router.delete("/api/delete-doctor", doctorController.deleteDoctor); 
    router.put('/api/edit-doctor', doctorController.editDoctor);
   



// Giao diện người dùng 
    // Chuyên khoa phổ biến     
    router.get("/api/get-specialty", specialtyController.getAllSpecialty); // Lấy danh sách chuyên khoa 
        // Giao diện thông tin chi tiết chuyên khoa 
        router.get(
      "/api/get-detail-specialty-by-id",
      specialtyController.getDetailSpecialtyById
    );

    // Cở sở y tế nổi bật 
    router.get("/api/get-clinic", clinicController.getAllClinic);
      // Giao diện thông tin chi tiết cở sở y tế
       router.get(
      "/api/get-detail-clinic-by-id",
      clinicController.getDetailClinicById
     );
    
    // Bác sĩ nổi bật 
    router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
         // Giao diện thông tin chi tiết bác sĩ 
           router.get(
             "/api/get-detail-doctor-by-id",
          doctorController.getDetailDoctorById
         );


    // Giao diện khi bấm vào bác sĩ đã chọn rồi đặt lịch lưu doctorId/ ngày / giờ 
     router.get(
      "/api/get-schedule-doctor-by-date",
      doctorController.getScheduleByDate
    ); 
    // Bảng Booking 
    router.post(
      "/api/patient-book-appointment",
      patientController.postBookAppointment
    ); 
    // Xác nhận lịch hẹn khi gửi trog email 
    router.post(
      "/api/verify-book-appointment",
      patientController.postVerifyBookAppointment
    );


    
// Giao diện Doctor - Dashboard 
    router.get(
      "/api/get-list-patient-for-doctor",
      doctorController.getListPatientForDoctor
    ); // Lấy danh sách bệnh nhân từ bảng Booking và UserUser sang giao diện doctor 

    router.post("/api/send-remedy", doctorController.sendRemedy); // xác nhận lịch hẹn trong doctor 
    router.post("/api/cancel-booking", doctorController.cancelBooking);// từ chối lịch hẹn trong doctor 


     return app.use("/", router);

}

module.exports = initWebRoutes;  