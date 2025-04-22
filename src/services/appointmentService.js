import db from "../models";

let getAllAppointments = async () => {
  try {
    let appointments = await db.Booking.findAll({
      include: [
        {
          model: db.User,
          as: "patientData",
          attributes: ["id", "firstName", "lastName", "email", "gender", "address"],
        },
        {
          model: db.User,
          as: "doctorData",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      errCode: 0,
      data: appointments,
    };
  } catch (e) {
    console.log("Error in getAllAppointments service:", e);
    throw e;
  }
};

let updateAppointmentStatus = async (appointmentId, status) => {
  try {
    let appointment = await db.Booking.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return {
        errCode: 1,
        errMessage: "Appointment not found",
      };
    }

    // Ánh xạ status thành statusId
    let statusId = null;
    if (status === "CONFIRMED") {
      statusId = 1;  // Giả sử 1 là ID của trạng thái "CONFIRMED"
    } else if (status === "CANCELLED") {
      statusId = 2;  // Giả sử 2 là ID của trạng thái "CANCELLED"
    }

    appointment.statusId = statusId;
    await appointment.save();

    return {
      errCode: 0,
      errMessage: "Appointment status updated successfully",
    };
  } catch (e) {
    console.log("Error in updateAppointmentStatus service:", e);
    throw e;
  }
};

module.exports = {
  getAllAppointments,
  updateAppointmentStatus,
};
