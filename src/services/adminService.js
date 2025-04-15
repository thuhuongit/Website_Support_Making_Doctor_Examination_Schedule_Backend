const db = require("../models");
const moment = require("moment");
const { Sequelize } = require("sequelize");

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

let getTotalNewUserDay = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let currentDate = moment(new Date()).format("YYYY-MM-DD");
      let users = await db.User.findAll({
        // where: { createdAt==currentDate},
        // order: [["createdAt", "DESC"]],
        attributes: ["id", "createdAt"],
        raw: true,
        nest: true,
      });

      users.map((item) => {
        item.createdAt = moment(item.createdAt).format("YYYY-MM-DD");
        return item;
      });
      users = users.filter((item) => item.createdAt == currentDate);

      let totalNewUserDay = users.length;

      resolve({
        errCode: 0,
        data: { totalNewUserDay: totalNewUserDay },
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getTotalHealthAppointmentDone = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let apointmentDones = await db.Booking.findAll({
        where: { statusId: "S3" },
        attributes: ["id", "createdAt", "statusId"],
        raw: true,
        nest: true,
      });

      let totalHealthApointmentDone = apointmentDones.length;

      resolve({
        errCode: 0,
        data: { totalHealthApointmentDone: totalHealthApointmentDone },
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getTotalDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
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
