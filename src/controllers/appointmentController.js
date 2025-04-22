import appointmentService from "../services/appointmentService";

let getAllAppointments = async (req, res) => {
  try {
    let data = await appointmentService.getAllAppointments();
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error in getAllAppointments: ", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let updateAppointmentStatus = async (req, res) => {
  try {
    let appointmentId = req.params.id;
    let { status } = req.body;

    if (!appointmentId || !status) {
      return res.status(400).json({ errCode: 1, errMessage: "Missing data" });
    }

    // Kiểm tra nếu status là giá trị hợp lệ
    const validStatuses = ["CONFIRMED", "CANCELLED"];  // Cập nhật danh sách trạng thái hợp lệ
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ errCode: 2, errMessage: "Invalid status" });
    }

    let data = await appointmentService.updateAppointmentStatus(appointmentId, status);
    if (data.errCode === 0) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json(data); // Trường hợp không tìm thấy lịch hẹn
    }
  } catch (e) {
    console.log("Error in updateAppointmentStatus: ", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

module.exports = {
  getAllAppointments,
  updateAppointmentStatus,
};
