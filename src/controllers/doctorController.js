import doctorService from "../services/doctorService";

// Lấy danh scahs bác sĩ nổi bật lên trang chủchủ
let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getTopDoctorHome(+limit); 
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

// Lấy danh scahs tất cả bác sĩ 
let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status.json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};


let postInforDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status.json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};


let getDetailDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Lưu lịch khám cho bác sĩ (Bảng Schedule )
const MAX_NUMBER_SCHEDULE = 10;
let bulkCreateSchedule = async (req, res) => {
  try {
    const { arrSchedule, doctorId, date } = req.body;
    if (!arrSchedule || !doctorId || !date) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameters: arrSchedule, doctorId, date",
      });
    }

    // truyền MAX_NUMBER vào service
    let infor = await doctorService.bulkCreateSchedule({
      arrSchedule,
      doctorId,
      date,
      maxNumber: MAX_NUMBER_SCHEDULE,
    });
    return res.status(200).json(infor);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};


let getScheduleByDate = async (req, res) => {
  try {
    let { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing doctorId or date",
      });
    }

    let data = await doctorService.getScheduleByDate(doctorId, date);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};




let getExtraInforDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getProfileDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getProfileDoctorById(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};


// Lấy danh sách bệnh nhận cho bác sĩ theo ngày 
const getListPatientForDoctor = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing doctorId or date",
      });
    }

    const infor = await doctorService.getListPatientForDoctor(doctorId, date);
    return res.status(200).json(infor);
  } catch (e) {
    console.error("Error in getListPatientForDoctor:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};





// Xác nhận lịch hẹn bên doctor 
let sendRemedy = async (req, res) => {
  try {
    let infor = await doctorService.sendRemedy(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log("Error in sendRemedy:", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi server",
    });
  }
};


// Hủy lịch hẹn bên doctor 
let cancelBooking = async (req, res) => {
  try {

    let infor = await doctorService.cancelBooking(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postInforDoctor: postInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy,
  cancelBooking: cancelBooking,
};
