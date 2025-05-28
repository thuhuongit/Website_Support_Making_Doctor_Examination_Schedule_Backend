import patientService from "../services/patientService";



// Hàm này để tạo lịch hẹn cho bệnh nhân và gửi email xác nhận 
let postBookAppointment = async (req, res) => {
  try {
    let infor = await patientService.postBookAppointment(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};



// Hàm này sẽ dùng để xác nhận lịch hẹn từ email 
let postVerifyBookAppointment = async (req, res) => {
  try {
    let infor = await patientService.postVerifyBookAppointment(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server", 
    });
  }
};

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
};
