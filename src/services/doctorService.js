import db from "../models/index";
require("dotenv").config();
import _ from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;


// Lấy danh sách bác sĩ nổi bật lên trang chủ 
let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Doctor_Infor,
            attributes: ["specialtyId"],
            include: [
              {
                model: db.Specialty,
                as: "specialtyData",
                attributes: ["name"],
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });
      users = users.map((user) => {
        if (user.image && Buffer.isBuffer(user.image)) {
          user.image = user.image.toString("utf8");
        }
        return user;
      });

      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy tất cả danh sách bác sĩ 
let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Doctor_Infor,
            attributes: ["specialtyId"],
            include: [
              {
                model: db.Specialty,
                as: "specialtyData",
                attributes: ["name"],
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctorInfos = async () => {
  try {
    const result = await db.Doctor_Infor.findAll({
      include: [
        {
          model: db.User,
          as: "doctorData",
          attributes: ["firstName", "lastName"]
        },
        {
          model: db.Specialty,
          as: "specialtyData",
          attributes: ["name"]
        },
        {
          model: db.Clinic,
          as: "clinicData",
          attributes: ["name"]
        },
        {
          model: db.Markdown,
          as: "markdown",
          attributes: ["contentHTML", "contentMarkdown", "description"]
        }

      ],
      raw: false,
      nest: true
    });

    return {
      errCode: 0,
      data: result.map(item => item.get({ plain: true }))
    };
  } catch (e) {
    console.error("Error getAllDoctorInfos:", e);
    return {
      errCode: -1,
      errMessage: "Lỗi server"
    };
  }
};

let checkRequiredFields = (inputData) => {
  if (inputData.action === "CREATE") {
  let arrFields = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "action",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "nameClinic",
    "addressClinic",
    "note",
    "specialtyId",
    "description",
  ];

  for (let field of arrFields) {
    if (!inputData[field]) {
      return {
        isValid: false,
        element: field,
      };  
    }
  }
  }
  return {
    isValid: true,
    element: "",
  };
};

let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Gán mặc định nếu không truyền
      if (!inputData.selectedPrice) inputData.selectedPrice = "100.000";
      if (!inputData.selectedPayment) inputData.selectedPayment = "cash";
      if (!inputData.selectedProvince) inputData.selectedProvince = "hanoi";

      // Kiểm tra đủ thông tin cần thiết
      let checkObj = checkRequiredFields(inputData);
      if (!checkObj.isValid) {
        return resolve({
          errCode: 1,
          errMessage: `Missing parameter: ${checkObj.element}`,
        });
      }

      // ======= MARKDOWN =======
      let doctorMarkdown = await db.Markdown.findOne({
        where: { doctorId: inputData.doctorId },
        raw: false,
      });

      if (!doctorMarkdown) {
        // CREATE
        await db.Markdown.create({
          contentHTML: inputData.contentHTML || '',
          contentMarkdown: inputData.contentMarkdown || '',
          description: inputData.description || '',
          doctorId: inputData.doctorId,
          specialtyId: inputData.specialtyId,
          clinicId: inputData.clinicId,
        });
      } else {
        // UPDATE
        doctorMarkdown.contentHTML = inputData.contentHTML || doctorMarkdown.contentHTML;
        doctorMarkdown.contentMarkdown = inputData.contentMarkdown || doctorMarkdown.contentMarkdown;
        doctorMarkdown.description = inputData.description || doctorMarkdown.description;
        doctorMarkdown.specialtyId = inputData.specialtyId;
        doctorMarkdown.clinicId = inputData.clinicId;
        await doctorMarkdown.save();
      }

      // ======= DOCTOR_INFOR =======
      let doctorInfor = await db.Doctor_Infor.findOne({
        where: {
          doctorId: inputData.doctorId,
        },
        raw: false,
      });

      if (!doctorInfor) {
        // CREATE
        await db.Doctor_Infor.create({
          doctorId: inputData.doctorId,
          priceId: inputData.selectedPrice,
          provinceId: inputData.selectedProvince,
          paymentId: inputData.selectedPayment,
          nameClinic: inputData.nameClinic,
          addressClinic: inputData.addressClinic,
          note: inputData.note,
          specialtyId: inputData.specialtyId,
          clinicId: inputData.clinicId,
          count: 1,
        });
      } else {
        // UPDATE
        doctorInfor.priceId = inputData.selectedPrice;
        doctorInfor.provinceId = inputData.selectedProvince;
        doctorInfor.paymentId = inputData.selectedPayment;
        doctorInfor.nameClinic = inputData.nameClinic;
        doctorInfor.addressClinic = inputData.addressClinic;
        doctorInfor.note = inputData.note;
        doctorInfor.specialtyId = inputData.specialtyId;
        doctorInfor.clinicId = inputData.clinicId;
        doctorInfor.count = (doctorInfor.count || 0) + 1;
        await doctorInfor.save();
      }

      return resolve({
        errCode: 0,
        errMessage: "Save infor doctor succeed!",
      });
    } catch (e) {
      console.error("Error in saveDetailInforDoctor:", e);
      return reject(e);
    }
  });
};

// Lấy thông tin chi tiết bác sĩ theo id lên giao diện 
let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });

       
        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }
        

        if (!data) {
          data = {};
        }

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//Xóa thông tin doctor 
let deleteDoctor = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        return resolve({
          errCode: 1,
          errMessage: "Missing doctor id",
        });
      }

      const doctor = await db.Doctor_Infor.findOne({ where: { id } });
      if (!doctor) {
        return resolve({
          errCode: 2,
          errMessage: "Doctor not found",
        });
      }

      await db.Doctor_Infor.destroy({ where: { id } });

      return resolve({
        errCode: 0,
        errMessage: "Delete doctor success",
      });
    } catch (e) {
      return reject(e);
    }
  });
};

// Sửa thông tin doctor theo id
let editDoctor = async (data) => {
  try {
    const {
      doctorId,
      specialtyId,
      clinicId,
      priceId,
      provinceId,
      paymentId,
      addressClinic,
      nameClinic,
      note,
      contentMarkdown,
      contentHTML,
      description,
    } = data;

    // Cập nhật bảng Doctor_Infor
    let doctorInfo = await db.Doctor_Infor.findOne({ where: { doctorId } });

    if (!doctorInfo) {
      return {
        errCode: 2,
        errMessage: "Không tìm thấy Doctor_Infor",
      };
    }

    doctorInfo.specialtyId = specialtyId || doctorInfo.specialtyId;
    doctorInfo.clinicId = clinicId || doctorInfo.clinicId;
    doctorInfo.priceId = priceId || doctorInfo.priceId;
    doctorInfo.provinceId = provinceId || doctorInfo.provinceId;
    doctorInfo.paymentId = paymentId || doctorInfo.paymentId;
    doctorInfo.addressClinic = addressClinic || doctorInfo.addressClinic;
    doctorInfo.nameClinic = nameClinic || doctorInfo.nameClinic;
    doctorInfo.note = note || doctorInfo.note;

    await doctorInfo.save();

    // Cập nhật bảng Markdown
    let markdown = await db.Markdown.findOne({ where: { doctorId } });

    if (!markdown) {
      return {
        errCode: 3,
        errMessage: "Không tìm thấy Markdown",
      };
    }

    markdown.contentHTML = contentHTML || markdown.contentHTML;
    markdown.contentMarkdown = contentMarkdown || markdown.contentMarkdown;
    markdown.description = description || markdown.description;

    await markdown.save();

    return {
      errCode: 0,
      errMessage: "Cập nhật thông tin bác sĩ thành công!",
    };

  } catch (err) {
    console.error("Edit doctor failed:", err);
    return {
      errCode: -1,
      errMessage: "Đã xảy ra lỗi khi cập nhật thông tin bác sĩ.",
    };
  }
};


//Lưu lịch khám cho bác sĩ (Bảng Schedule)
let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { arrSchedule, doctorId, date, maxNumber } = data;
      if (!arrSchedule || !doctorId || !date) {
        return reject({ errCode: 1, errMessage: "Missing required param" });
      }

      // kiểm tra date hợp lệ
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return reject({ errCode: 4, errMessage: "Invalid date format" });
      }

      // build danh sách schedule với maxNumber và currentNumber=0
      let schedules = arrSchedule.map(item => {
        // nếu item chỉ là string thì gán timeType = item
        const timeType = (typeof item === "object" ? item.timeType : item);
        return {
          doctorId,
          date,
          timeType,
          maxNumber: 10 ,
          currentNumber: 0
        };
      });

      // Lấy các lịch đã có của bác sĩ trong ngày
      const existing = await db.Schedule.findAll({
        where: { doctorId, date },
        attributes: ["doctorId", "date", "timeType"],
        raw: true
      });

      // Chỉ tạo những slot chưa tồn tại
      const toCreate = _.filter(schedules, sch =>
        !existing.some(ex => ex.timeType === sch.timeType)
      );

      if (toCreate.length > 0) {
        await db.Schedule.bulkCreate(toCreate);
      }

      resolve({ errCode: 0, errMessage: "OK" });
    } catch (e) {
      console.error(e);
      reject({ errCode: 500, errMessage: e.message || "Something went wrong" });
    }
  });
};


let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Schedule.findAll({
        where: {
          doctorId,
          date,
        },
        attributes: ['timeType', 'date', 'maxNumber'],
        raw: true,
      });

      resolve({
        errCode: 0,
        data,
      });
    } catch (e) {
      reject({
        errCode: -1,
        errMessage: e.message,
      });
    }
  });
};



let getExtraInforDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: { doctorId: doctorId },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!data) {
          data = [];
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getProfileDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: doctorId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

      
        if (data && data.image) {
          data.image =  new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) {
          data = {};
        }

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy danh sách bệnh nhân hiện lên bảng bác sĩ theo ngày 
let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        reject({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
        return;
      }

      let data = await db.Booking.findAll({
        where: {
          doctorId: doctorId,
          date: date,
        },
        include: [
          {
            model: db.User,
            as: "patientData",
            attributes: ["email", "firstName", "lastName", "address", "gender", "phone"],
          },
          {
            model: db.Allcode,
            as: "timeTypeDataPatient",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: false,
        nest: true,
      });

      resolve({
        errCode: 0,
        data: data,
      });
    } catch (e) {
      reject({
        errCode: 2,
        errMessage: e.message || "An unexpected error occurred",
      });
    }
  });
};

// Xóa thông tin lịch khám 
let deleteSchedule = async (req, res) => {
  try {
    const { doctorId, date, timeType } = req.body;

    // Kiểm tra đủ thông tin
    if (!doctorId || !date || !timeType) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu thông tin cần thiết",
      });
    }

    // Xoá theo điều kiện
    const deleted = await db.Schedule.destroy({
      where: {
        doctorId,
        date,
        timeType,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({
        errCode: 2,
        errMessage: "Không tìm thấy lịch khám để xoá",
      });
    }

    return res.status(200).json({
      errCode: 0,
      errMessage: "Xoá lịch khám thành công",
    });
  } catch (error) {
    console.error("deleteSchedule error:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi server",
    });
  }
};

// Hủy  lịch hẹn 
let cancelBooking = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("appointmentId:", data.appointmentId);

      if (!data.appointmentId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: appointmentId",
        });
      }

      let appointment = await db.Booking.findOne({
        where: {
          id: data.appointmentId,
          statusId: "S2", 
        },
        raw: false,
      });

      if (!appointment) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy lịch hẹn phù hợp hoặc trạng thái không hợp lệ",
        });
      }

      appointment.statusId = "S4"; 
      await appointment.save();

      return resolve({
        errCode: 0,
        errMessage: "Hủy lịch hẹn thành công",
      });
    } catch (e) {
      console.log("Lỗi khi hủy lịch hẹn:", e);
      reject(e);
    }
  });
};


// Xác nhận lịch hẹn 
let sendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("doctorId:", data.doctorId);
      console.log("patientId:", data.patientId);
      console.log("timeType:", data.timeType);
      console.log("date:", data.date);

      // Kiểm tra thiếu tham số
      if (!data.doctorId || !data.patientId || !data.timeType || !data.date) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      }
     
      // Cập nhật trạng thái từ S2 => S3
      const [updated] = await db.Booking.update(
        { statusId: 'S3' },
        {
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            date: data.date,
            statusId: 'S2'
          }
        }
      );

      console.log("Rows affected: ", updated); 

      if (updated === 0) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy lịch hẹn phù hợp hoặc trạng thái không hợp lệ",
        });
      }

      return resolve({
        errCode: 0,
        errMessage: "Cập nhật trạng thái thành công",
      });
    } catch (e) {
      console.log("Lỗi khi cập nhật trạng thái:", e);
      reject(e);
    }
  });
};


module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  getAllDoctorInfos, 
  editDoctor,
  deleteDoctor,
  saveDetailInforDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  getListPatientForDoctor,
  sendRemedy,
  cancelBooking,
  deleteSchedule,
};
