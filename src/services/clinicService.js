const db = require("../models");

// Thêm phòng khám mới vào db ở bên Admin 
let createClinic = async (data) => {
  try {
    let clinic = await db.Clinic.create({
      name: data.name,
      address: data.address,
      image: data.image,  
      description: data.description,
    });

    return clinic;  
  } catch (e) {
    throw e;
  }
};

// Lấy danh sách phòng khám từ db lên giao diện 
let getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      
      let data = await db.Clinic.findAll();

      if (data && data.length > 0) {
           data.forEach((item) => { 
            if (item.image) { 
              image: Buffer.from(item.image, 'base64').toString('base64')
             } else {
              console.log("No image data found for item", item);
       }
   });
}

resolve({
  errCode: 0,
  errMessage: "Ok!",
  data,
});

    } catch (e) {
      reject(e); 
    }
  });
};



// Lấy chi tiết phòng khám theo ID và vị trí 
let getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Clinic.findOne({
          where: { id: inputId },
          attributes: [
            "name",
            "address",
            "description",
            "image",
          ],
        });
        if (data) {
          let doctorClinic = [];
          doctorClinic = await db.Doctor_Infor.findAll({
            where: { clinicId: inputId },
            attributes: ["doctorId", "provinceId"],
          });
          data.doctorClinic = doctorClinic;
        } else {
          data = {};
        }
        resolve({
          errCode: 0,
          errMessage: "Ok!",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa phòng khám theo ID 
let deleteClinic = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        return resolve({
          errCode: 1,
          errMessage: "Missing clinic id",
        });
      }

      const spec = await db.Clinic.findOne({ where: { id } });
      if (!spec) {
        return resolve({
          errCode: 2,
          errMessage: "Clinic not found",
        });
      }

      await db.Clinic.destroy({ where: { id } });

      resolve({
        errCode: 0,
        errMessage: "Delete clinic success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
  deleteClinic, 
};
