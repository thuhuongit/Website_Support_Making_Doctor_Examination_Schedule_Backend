import express, { Router } from "express"
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import adminController from "../controllers/adminController";

 
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
    router.get('/api/get-all-users', userController.getAllUsers); 
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/allcode', userController.getAllCode); 
    router.post("/api/user-forgot-password", userController.postForgotPassword);
    router.post(
      "/api/verify-retrieve-password",
      userController.postVerifyRetrievePassword
    );
  
    router.get("/api/allcode", userController.getAllCode);
  
    router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
    router.get("/api/get-all-doctors", doctorController.getAllDoctors);
    router.post("/api/save-infor-doctors", doctorController.postInforDoctor);
    router.get(
      "/api/get-detail-doctor-by-id",
      doctorController.getDetailDoctorById
    );
    router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
    router.get(
      "/api/get-schedule-doctor-by-date",
      doctorController.getScheduleByDate
    );
    router.get(
      "/api/get-extra-infor-doctor-by-id",
      doctorController.getExtraInforDoctorById
    );
    router.get(
      "/api/get-profile-doctor-by-id",
      doctorController.getProfileDoctorById
    );
    router.get(
      "/api/get-list-patient-for-doctor",
      doctorController.getListPatientForDoctor
    );
    router.post("/api/send-remedy", doctorController.sendRemedy);
    router.post("/api/create-remedy", doctorController.createRemedy);
    router.post("/api/cancel-booking", doctorController.cancelBooking);
  
    router.post(
      "/api/patient-book-appointment",
      patientController.postBookAppointment
    );
    router.post(
      "/api/verify-book-appointment",
      patientController.postVerifyBookAppointment
    );
  
    router.post("/api/create-new-specialty", specialtyController.createSpecialty);
    router.get("/api/get-specialty", specialtyController.getAllSpecialty);
    router.get(
      "/api/get-detail-specialty-by-id",
      specialtyController.getDetailSpecialtyById
    );
  
    router.post("/api/create-new-clinic", clinicController.createClinic);
    router.get("/api/get-clinic", clinicController.getAllClinic);
    router.get(
      "/api/get-detail-clinic-by-id",
      clinicController.getDetailClinicById
    );
  
    //admin
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