import db from "../models/index";
require("dotenv").config();
import _ from "lodash";
import emailService from "../services/emailService";
const textToImage = require("text-to-image");

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
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
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
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

// let getAllDoctors = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let doctors = await db.User.findAll({
//         where: { roleId: "R2" },
//         attributes: {
//           exclude: ["password", "image"],
//         },
//       });

//       resolve({
//         errCode: 0,
//         data: doctors,
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
let checkRequiredFields = (inputData) => {
  let arrFields = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "action",
    "selectedPrice",
    "selectedPayment",
    "selectedProvice",
    "nameClinic",
    "addressClinic",
    "note",
    "specialtyId",
  ];

  let isValid = true;
  let element = "";
  for (let i = 0; i < arrFields.length; i++) {
    if (!inputData[arrFields[i]]) {
      isValid = false;
      element = arrFields[i];
      break;
    }
  }
  return {
    isValid: isValid,
    element: element,
  };
};

let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredFields(inputData);
      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing parameter: ${checkObj.element}`,
        });
      } else {
        //upsert to Markdown
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });

          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            doctorMarkdown.doctorId = inputData.doctorId;
            // doctorMarkdown.updatedAt = new Date();
            await doctorMarkdown.save();
          }
        }

        //upsert to Doctor_infor tabel
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });

        if (doctorInfor) {
          //update
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectedPrice;
          doctorInfor.provinceId = inputData.selectedProvice;
          doctorInfor.paymentId = inputData.selectedPayment;
          doctorInfor.nameClinic = inputData.nameClinic;
          doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.clinicId = inputData.clinicId;

          await doctorInfor.save();
        } else {
          //create
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            provinceId: inputData.selectedProvice,
            paymentId: inputData.selectedPayment,
            nameClinic: inputData.nameClinic,
            addressClinic: inputData.addressClinic,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Save infor doctor succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

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

        //convert image tu buffer sang base64
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

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra các tham số bắt buộc
      if (!data.arrSchedule || !data.doctorId || !data.date) {
        return reject({
          errCode: 1,
          errMessage: "Missing required param",
        });
      }

      // Kiểm tra xem date có phải là hợp lệ không
      let date = new Date(data.date);
      if (isNaN(date.getTime())) {
        return reject({
          errCode: 4,
          errMessage: "Invalid date format",
        });
      }

      let schedule = data.arrSchedule;

      // Kiểm tra kiểu dữ liệu của arrSchedule để tránh lỗi
      if (Array.isArray(schedule) && schedule.length > 0) {
        // Chuyển đổi thành đối tượng và thêm maxNumber nếu cần
        schedule = schedule.map((item) => {
          if (typeof item !== 'object') {
            return { 
              timeType: item, 
              maxNumber: MAX_NUMBER_SCHEDULE, 
              date: data.date, 
              doctorId: data.doctorId 
            };
          }
          return {
            ...item,
            maxNumber: MAX_NUMBER_SCHEDULE,
            date: data.date,
            doctorId: data.doctorId,
          };
        });        
      } else {
        return reject({
          errCode: 2,
          errMessage: "Invalid arrSchedule format",
        });
      }

      // Lấy danh sách lịch khám đã có của bác sĩ trong ngày
      let existing = await db.Schedule.findAll({
        where: { doctorId: data.doctorId, date: data.date },
        attributes: ["timeType", "date", "doctorId", "maxNumber"],
        raw: true,
      });

      // So sánh để tìm lịch khám cần tạo
      let toCreate = _.differenceWith(schedule, existing, (a, b) => {
        return a.timeType === b.timeType && +a.date === +b.date;
      });

      // Nếu có lịch khám mới, lưu vào cơ sở dữ liệu
      if (toCreate && toCreate.length > 0) {
        await db.Schedule.bulkCreate(toCreate);
      }

      // Trả về kết quả thành công
      resolve({
        errCode: 0,
        errMessage: "OK",
      });
    } catch (e) {
      // Xử lý lỗi khi xảy ra
      reject({
        errCode: 500,
        errMessage: e.message || "Something went wrong",
      });
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

        //convert image tu buffer sang base64
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

let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        reject({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
        return; // Dừng lại ngay sau khi lỗi được ném ra
      } else {
        let data = await db.Booking.findAll({
          where: { doctorId: doctorId },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: [
                "email",
                "firstName",
                "address",
                "gender",
                "phone",
              ],
            },
            
          ],
          raw: false,
          nest: true,
        });

        if (data.length === 0) {
          data = {}; // Nếu không có dữ liệu, trả về đối tượng rỗng
        }

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject({
        errCode: 2,
        errMessage: e.message || "An unexpected error occurred",
      });
    }
  });
};

let cancelBooking = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.date || !data.doctorId || !data.patientId || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        //update booking status
        let appoinment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            date: data.date,
            statusId: "S2",
          },
          raw: false,
        });

        if (appoinment) {
          appoinment.statusId = "S4";
          await appoinment.save();
        }

        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let sendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        //update patient status
        let appoinment = await db.Booking.update(
          { statusId: 'S2' },
            {
              where: {
                 doctorId: doctorId,
                 patientId: patientId,
                 date: date,
                 timeType: timeType,
                 statusId: 'S1'  // chỉ cập nhật nếu đang ở s1
    }
  }
);
          
        if (appoinment) {
          appoinment.statusId = "S3";
          await appoinment.save();
        }

        //send email remedy
        await emailService.sendAttachment(data);

        //create invoice table
        await db.Invoice.create({
          doctorId: data.doctorId,
          patientId: data.patientId,
          specialtyId: data.specialtyId,
          totalCost: data.totalCost ? data.totalCost : 0,
        });

        //update to Revenue User table
        let userTotalRevenue = await db.User.findOne({
          where: { id: data.doctorId },
          raw: false,
        });

        if (userTotalRevenue) {
          userTotalRevenue.totalRevenue =
            userTotalRevenue.totalRevenue + parseInt(data.totalCost);
          await userTotalRevenue.save();
        }

        //update to totalCost User table
        let userTotalCost = await db.User.findOne({
          where: { id: data.patientId },
          raw: false,
        });
        if (userTotalCost) {
          userTotalCost.totalCost =
            userTotalCost.totalCost + parseInt(data.totalCost);
          await userTotalCost.save();
        }

        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let createRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.doctorId ||
        !data.patientId ||
        !data.timeType ||
        !data.date ||
        !data.token ||
        !data.patientName ||
        !data.email ||
        !data.listMedicine ||
        !data.desciption
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        //create image remedy
        //get today
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + "/" + dd + "/" + yyyy;
        let contentImageVi = `
        Thông tin đơn thuốc ngày ${today}
        Bác sĩ phụ trách: ${data.doctorName}

        Bệnh nhân ${data.patientName}
        Email: ${data.email}

        Danh sách các thuốc:
        ${data.listMedicine}

        Thông tin mô tả cách sử dụng:
        ${data.desciption}
        `;
        const dataUriBase64 = textToImage.generateSync(contentImageVi, {
          debug: false,
          maxWidth: parseInt("720"),
          fontSize: parseInt("30"),
          fontFamily: "Arial",
          lineHeight: parseInt("50"),
          margin: 10,
          bgColor: "#ffffff",
          textColor: "#000000",
        });

        //update patient status
        let appoinment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            date: data.date,
            token: data.token,
          },
          raw: false,
        });

        if (appoinment) {
          appoinment.imageRemedy = dataUriBase64;
          await appoinment.save();
        }

        //create row histories table
        await db.History.create({
          doctorId: data.doctorId,
          patientId: data.patientId,
          description: data.desciption,
          files: dataUriBase64,
        });

        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailInforDoctor: saveDetailInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy,
  cancelBooking: cancelBooking,
  createRemedy: createRemedy,
};
