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



module.exports = {
  getWeeklyRevenue,
  getTotalNewUserDay,
  getTotalHealthAppointmentDone,
  getTotalDoctor,
};
