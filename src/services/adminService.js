const db = require("../models");
const moment = require("moment");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");


// Tổng doanh thu 7 ngày gần nhất 
let getWeeklyRevenue = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let invoices = await db.Invoice.findAll({
        // where: { createdAt>=moment(new Date()).subtract(3, 'days'),createdAt<=(new Date())},
        // order: [["createdAt", "DESC"]],
        attributes: ["totalCost", "createdAt"],
        raw: true,
        nest: true,
      });
      invoices.map((item) => {
        item.createdAt = moment(item.createdAt).format("YYYY-MM-DD");
        return item;
      });
      let sixDaysAgo = moment(new Date())
        .subtract(6, "days")
        .format("YYYY-MM-DD");
      let currentDate = moment(new Date()).format("YYYY-MM-DD");
      invoices = invoices.filter(
        (item) => item.createdAt >= sixDaysAgo && item.createdAt <= currentDate
      );

      let totalWeeklyRevenue = 0;
      invoices.map((item) => {
        totalWeeklyRevenue = totalWeeklyRevenue + parseInt(item.totalCost);
      });

      resolve({
        errCode: 0,
        data: { totalWeeklyRevenue: totalWeeklyRevenue },
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Tổng số người dùng mới trong ngày hôm nay 
let getTotalNewUserDay = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const startOfDay = moment().startOf("day").toDate();
      const endOfDay = moment().endOf("day").toDate();

      const users = await db.User.findAll({
        where: {
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
        attributes: ["id", "createdAt"],
        raw: true,
      });

      resolve({
        errCode: 0,
        data: { totalNewUserDay: users.length },
      });
    } catch (e) {
      reject(e);
    }
  });
};




// Tổng số cuộc hẹn sức khỏe đã hoàn thành 
let getTotalHealthAppointmentDone = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let appointmentDones = await db.Booking.findAll({
        where: { statusId: "S3" },
        attributes: ["id", "createdAt", "statusId"],
        raw: true,
        nest: true,
      });

      let totalHealthAppointmentDone = appointmentDones.length;

      resolve({
        errCode: 0,
        data: { totalHealthAppointmentDone: totalHealthAppointmentDone },
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Tổng số bác sĩ 
let getTotalDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "2" },
        attributes: ["id", "roleId"],
        raw: true,
        nest: true,
      });

      let totalDoctors = doctors.length;

      resolve({
        errCode: 0,
        data: { totalDoctors: totalDoctors },
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy 3 bác sĩ có doanh thu cao nhất trong năm 
let getTopThreeIdDoctorOfTheYear = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let invoices = await db.Invoice.findAll({
        // where: { createdAt:  },
        attributes: [
          "doctorId",
          [
            Sequelize.fn("sum", Sequelize.col("Invoice.totalCost")),
            "total_revenue",
          ],
        ],

        // order: [["Invoice.total_revenue", "DESC"]],
        group: ["Invoice.doctorId"],
        raw: true,
        nest: true,
      });

      //sap xep giam dan
      invoices.sort(function (b, a) {
        return a.total_revenue - b.total_revenue;
      });

      //chi lay ra 3 phan tu dau
      const slicedInvoices = invoices.slice(0, 3);

      resolve({
        errCode: 0,
        data: { invoices: slicedInvoices },
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy doanh thu theo 12 tháng của mỗi bác sĩ 
let getTotalRevenueDoctorEachMonthByDoctorId = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let invoices = await db.Invoice.findAll({
        where: { doctorId: doctorId },
        attributes: ["id", "doctorId", "totalCost", "createdAt"],
        include: [
          {
            model: db.User,
            as: "doctorDataInvoice",
            attributes: ["firstName", "lastName"],
          },
        ],
        raw: true,
        nest: true,
      });

      invoices.map((item) => {
        item.createdAt = moment(item.createdAt).month();
        //format("YYYY-MM-DD")
        return item;
      });

      let totalRevenueMonth0 = 0;
      let totalRevenueMonth1 = 0;
      let totalRevenueMonth2 = 0;
      let totalRevenueMonth3 = 0;
      let totalRevenueMonth4 = 0;
      let totalRevenueMonth5 = 0;
      let totalRevenueMonth6 = 0;
      let totalRevenueMonth7 = 0;
      let totalRevenueMonth8 = 0;
      let totalRevenueMonth9 = 0;
      let totalRevenueMonth10 = 0;
      let totalRevenueMonth11 = 0;

      invoices.map((item) => {
        // if (item.createdAt === 10) {
        //   totalRevenueMonth10 = totalRevenueMonth10 + parseInt(item.totalCost);
        // }
        switch (item.createdAt) {
          case 0:
            totalRevenueMonth0 = totalRevenueMonth0 + parseInt(item.totalCost);
            break;
          case 1:
            totalRevenueMonth1 = totalRevenueMonth1 + parseInt(item.totalCost);
            break;
          case 2:
            totalRevenueMonth2 = totalRevenueMonth2 + parseInt(item.totalCost);
            break;
          case 3:
            totalRevenueMonth3 = totalRevenueMonth3 + parseInt(item.totalCost);
            break;
          case 4:
            totalRevenueMonth4 = totalRevenueMonth4 + parseInt(item.totalCost);
            break;
          case 5:
            totalRevenueMonth5 = totalRevenueMonth5 + parseInt(item.totalCost);
            break;
          case 6:
            totalRevenueMonth6 = totalRevenueMonth6 + parseInt(item.totalCost);
            break;
          case 7:
            totalRevenueMonth7 = totalRevenueMonth7 + parseInt(item.totalCost);
            break;
          case 8:
            totalRevenueMonth8 = totalRevenueMonth8 + parseInt(item.totalCost);
            break;
          case 9:
            totalRevenueMonth9 = totalRevenueMonth9 + parseInt(item.totalCost);
            break;
          case 10:
            totalRevenueMonth10 =
              totalRevenueMonth10 + parseInt(item.totalCost);
            break;
          case 11:
            totalRevenueMonth11 =
              totalRevenueMonth11 + parseInt(item.totalCost);
            break;
          default:
          // code block
        }
      });

      //   console.log("totalRevenueMonth0", totalRevenueMonth0);
      //   console.log("totalRevenueMonth1", totalRevenueMonth1);
      //   console.log("totalRevenueMonth2", totalRevenueMonth2);
      //   console.log("totalRevenueMonth3", totalRevenueMonth3);
      //   console.log("totalRevenueMonth4", totalRevenueMonth4);

      let dataRevenue12Month = {};
      dataRevenue12Month.revenueMonth0 = totalRevenueMonth0;
      dataRevenue12Month.revenueMonth1 = totalRevenueMonth1;
      dataRevenue12Month.revenueMonth2 = totalRevenueMonth2;
      dataRevenue12Month.revenueMonth3 = totalRevenueMonth3;
      dataRevenue12Month.revenueMonth4 = totalRevenueMonth4;
      dataRevenue12Month.revenueMonth5 = totalRevenueMonth5;
      dataRevenue12Month.revenueMonth6 = totalRevenueMonth6;
      dataRevenue12Month.revenueMonth7 = totalRevenueMonth7;
      dataRevenue12Month.revenueMonth8 = totalRevenueMonth8;
      dataRevenue12Month.revenueMonth9 = totalRevenueMonth9;
      dataRevenue12Month.revenueMonth10 = totalRevenueMonth10;
      dataRevenue12Month.revenueMonth11 = totalRevenueMonth11;

      resolve({
        errCode: 0,
        data: {
          doctorId: doctorId,
          dataRevenue12Month: dataRevenue12Month,
          firstName: invoices[0].doctorDataInvoice.firstName,
          lastName: invoices[0].doctorDataInvoice.lastName,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

 
// Lấy 3 bác sĩ có doanh thu cao nhất trong năm và doanh thu theo 12 tháng của mỗi bác sĩ 
let getTopThreeDoctorsOfTheYear = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //lay id 3 bac si doanh thu cao nhat
      let resThreeDoctors = await getTopThreeIdDoctorOfTheYear();
      let threeDoctors = [];
      if (resThreeDoctors && resThreeDoctors.errCode === 0) {
        threeDoctors = resThreeDoctors.data.invoices;
        //resThreeDoctors.data.invoices.doctorId
      }

      //lay doanh thu theo 12 thang cua moi bac si

      var RevenueEachMonthOfThreeDoctors = [];

      if (threeDoctors) {
        threeDoctors.map(async (item) => {
          let resRevenueEachMonthOfDoctor =
            await getTotalRevenueDoctorEachMonthByDoctorId(item.doctorId);
          if (
            resRevenueEachMonthOfDoctor &&
            resRevenueEachMonthOfDoctor.errCode === 0
          ) {
            let dataRevenueDoctor = resRevenueEachMonthOfDoctor.data;
            let copy_RevenueEachMonthOfThreeDoctors = [
              ...RevenueEachMonthOfThreeDoctors,
            ];
            RevenueEachMonthOfThreeDoctors = [
              ...copy_RevenueEachMonthOfThreeDoctors,
              dataRevenueDoctor,
            ];
            if (RevenueEachMonthOfThreeDoctors.length === 3) {
              resolve({
                errCode: 0,
                data: {
                  dataRevenueThreeDoctor: RevenueEachMonthOfThreeDoctors,
                },
              });
            }
          }
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy 4 bệnh nhân vip có doan thu cao nhất trong năm 
let getTopFourVipPatient = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let invoices = await db.Invoice.findAll({
        // where: { createdAt:  },
        attributes: [
          "patientId",
          [
            Sequelize.fn("sum", Sequelize.col("Invoice.totalCost")),
            "total_revenue",
          ],
        ],
        include: [
          {
            model: db.User,
            as: "patientDataInvoice",
            attributes: ["firstName", "lastName"],
          },
        ],

        // order: [["Invoice.total_revenue", "DESC"]],
        group: ["Invoice.patientId"],
        raw: true,
        nest: true,
      });

      //sap xep giam dan
      invoices.sort(function (b, a) {
        return a.total_revenue - b.total_revenue;
      });

      //chi lay ra 3 phan tu dau
      const slicedInvoices = invoices.slice(0, 4);

      resolve({
        errCode: 0,
        data: { invoices: slicedInvoices },
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy doanh thu theo tháng của các chuyên khoa trong tháng hiện tại 
let getMonthlyRevenueSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let invoices = await db.Invoice.findAll({
        // where: { createdAt>=moment(new Date()).subtract(3, 'days'),createdAt<=(new Date())},
        // order: [["createdAt", "DESC"]],
        attributes: ["specialtyId", "totalCost", "createdAt"],
        include: [
          {
            model: db.Specialty,
            as: "specialtyInvoiceData",
            attributes: ["name"],
          },
        ],
        raw: true,
        nest: true,
      });
      invoices.map((item) => {
        item.createdAt = moment(item.createdAt).format("YYYY-MM-DD");
        return item;
      });
      //   let sixDaysAgo = moment(new Date())
      //     .subtract(6, "days")
      //     .format("YYYY-MM-DD");
      //   let currentDate = moment(new Date()).format("YYYY-MM-DD");
      const startOfMonth = moment(new Date())
        .startOf("month")
        .format("YYYY-MM-DD");
      const endOfMonth = moment(new Date()).endOf("month").format("YYYY-MM-DD");
      invoices = invoices.filter(
        (item) => item.createdAt >= startOfMonth && item.createdAt <= endOfMonth
      );

      let arrSpecialtyId = [];
      invoices.map((item) => {
        if (arrSpecialtyId.includes(item.specialtyId) === false) {
          arrSpecialtyId.push(item.specialtyId);
        }
      });

      let resultMonthlyRevenueSpecialty = [];
      arrSpecialtyId.map((item) => {
        let arr = [];
        let obj = {};
        let totalRevenueMonthly = 0; //luu total revenue month co xuong khop
        arr = invoices.filter((item2) => item2.specialtyId === item);
        arr.map((item3) => {
          totalRevenueMonthly = totalRevenueMonthly + parseInt(item3.totalCost);
        });
        if (arr.length !== 0) {
          obj.totalRevenueMonth = totalRevenueMonthly;
          obj.name = arr[0].specialtyInvoiceData.name;
        }
        resultMonthlyRevenueSpecialty.push(obj);
      });

      resolve({
        errCode: 0,
        data: resultMonthlyRevenueSpecialty,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getWeeklyRevenue: getWeeklyRevenue,
  getTotalNewUserDay: getTotalNewUserDay,
  getTotalHealthAppointmentDone: getTotalHealthAppointmentDone,
  getTotalDoctor: getTotalDoctor,
  getTopThreeDoctorsOfTheYear: getTopThreeDoctorsOfTheYear,
  getTopThreeIdDoctorOfTheYear: getTopThreeIdDoctorOfTheYear,
  getTotalRevenueDoctorEachMonthByDoctorId:
  getTotalRevenueDoctorEachMonthByDoctorId,
  getTopFourVipPatient: getTopFourVipPatient,
  getMonthlyRevenueSpecialty: getMonthlyRevenueSpecialty,
};
