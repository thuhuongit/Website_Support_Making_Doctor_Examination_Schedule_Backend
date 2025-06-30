import adminService from "../services/adminService";


// Tổng doanh thu 7 ngày gần nhất 
let getWeeklyRevenue = async (req, res) => {
  try {
    let infor = await adminService.getWeeklyRevenue();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Tổng số người dùng mới trong hôm nay 
let getTotalNewUserDay = async (req, res) => {
  try {
    let infor = await adminService.getTotalNewUserDay();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Tổng số cuộc hẹn đã hoàn thành 
let getTotalHealthAppointmentDone = async (req, res) => {
  try {
    let infor = await adminService.getTotalHealthAppointmentDone();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Tổng số bác sĩ 
let getTotalDoctor = async (req, res) => {
  try {
    let infor = await adminService.getTotalDoctor();
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
  getWeeklyRevenue,
  getTotalNewUserDay,
  getTotalHealthAppointmentDone,
  getTotalDoctor,
};
