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
    //router.get('/about', homeController.getAboutPage);
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
  


// Giao diện Admin 
    // Màn hình ManageUser
    router.get('/api/get-all-users', userController.getAllUsers); 
    router.post('/api/create-new-user', upload.single('avatar'), userController.handleCreateNewUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.put('/api/edit-user', userController.handleEditUser);

    // Màn hình Quản lý kế hoạch khám bệnh 
    router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule); //lưu kế hoạch khám bệnh của bác sĩ

    // Màn hình Quản lý chuyên khoa 
    router.post("/api/create-new-specialty", upload.single("image"), specialtyController.createSpecialty); // Upload hình ảnh chỗ chuyên khoa phổ biếnbiến
    
    // Màn hình phòng khám 
     router.post("/api/create-new-clinic", upload.single("image"), clinicController.createClinic);


    // Thông tin bác sĩ 
    router.get("/api/get-all-doctors", doctorController.getAllDoctors);
    router.post("/api/save-infor-doctors", doctorController.postInforDoctor);
    




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
  











    
    router.get(
      "/api/get-extra-infor-doctor-by-id",
      doctorController.getExtraInforDoctorById
    );
    router.get(
      "/api/get-profile-doctor-by-id",
      doctorController.getProfileDoctorById
    );


    
  
  
   
  
    
    router.get("/api/get-weekly-revenue", adminController.getWeeklyRevenue);
    router.get("/api/get-total-new-user-day", adminController.getTotalNewUserDay);
    router.get(
      "/api/get-total-health-appointment-done",
      adminController.getTotalHealthAppointmentDone
    );
    router.get("/api/get-total-doctor", adminController.getTotalDoctor);
    router.get(
      "/api/get-top-three-doctors-of-the-year",
      adminController.getTopThreeDoctorsOfTheYear
    );
    router.get(
      "/api/get-top-four-vip-patient",
      adminController.getTopFourVipPatient
    );
    router.get(
      "/api/get-monthly-revenue-specialty",
      adminController.getMonthlyRevenueSpecialty
    );




  






     return app.use("/", router);

}

module.exports = initWebRoutes;  