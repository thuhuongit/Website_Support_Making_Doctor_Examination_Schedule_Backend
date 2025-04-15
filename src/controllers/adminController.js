import adminService from "../services/adminService";

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

let getTopThreeDoctorsOfTheYear = async (req, res) => {
  try {
    let infor = await adminService.getTopThreeDoctorsOfTheYear();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getTopFourVipPatient = async (req, res) => {
  try {
    let infor = await adminService.getTopFourVipPatient();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getMonthlyRevenueSpecialty = async (req, res) => {
  try {
    let infor = await adminService.getMonthlyRevenueSpecialty();
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
  getWeeklyRevenue: getWeeklyRevenue,
  getTotalNewUserDay: getTotalNewUserDay,
  getTotalHealthAppointmentDone: getTotalHealthAppointmentDone,
  getTotalDoctor: getTotalDoctor,
  getTopThreeDoctorsOfTheYear: getTopThreeDoctorsOfTheYear,
  getTopFourVipPatient: getTopFourVipPatient,
  getMonthlyRevenueSpecialty: getMonthlyRevenueSpecialty,
};
