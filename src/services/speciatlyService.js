const db = require("../models");

// Thêm chuyên khoa mới vào db ở bên Admin 
let createSpecialty = async (data) => {
  try {
    
    let specialty = await db.Specialty.create({
      name: data.name,
      image: data.image,
      descriptionMarkdown: data.descriptionMarkdown,
      descriptionHTML: data.descriptionHTML,
    });
    return specialty;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách chuyên khoa từ db lên giao diện 
let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      
      let data = await db.Specialty.findAll();

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

// Lấy chi tiết chuyên khoa theo ID và vị trí 
let getDetailSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: { id: inputId },
          attributes: ["name", "descriptionHTML", "descriptionMarkdown"],
        });
        if (data) {
          let doctorSpecialty = [];
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId, provinceId: location },
              attributes: ["doctorId", "provinceId"],
            });
          }
          data.doctorSpecialty = doctorSpecialty;
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

// Xóa chuyên khoa theo ID 
let deleteSpecialty = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        return resolve({
          errCode: 1,
          errMessage: "Missing specialty id",
        });
      }
      const spec = await db.Specialty.findOne({ where: { id } });
      if (!spec) {
        return resolve({
          errCode: 2,
          errMessage: "Specialty not found",
        });
      }
      await db.Specialty.destroy({ where: { id } });
      resolve({
        errCode: 0,
        errMessage: "Delete specialty success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Sửa chuyên khoa theo ID
let editSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, name, descriptionMarkdown, descriptionHTML, image } = data;

      if (!id || !name || !descriptionMarkdown || !descriptionHTML) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }
      const specialty = await db.Specialty.findOne({ where: { id } });
      if (!specialty) {
        return resolve({
          errCode: 1,
          errMessage: "Specialty not found",
        });
      }

      await db.Specialty.update(
        {
          name,
          descriptionMarkdown,
          descriptionHTML,
          ...(image && { image }),
        },
        { where: { id } }
      );
      return resolve({
        errCode: 0,
        errMessage: "Update specialty success",
      });
    } catch (error) {
      console.error("editSpecialty service error:", error);
      return reject(error);
    }
  });
};

module.exports = {
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  deleteSpecialty, 
  editSpecialty, 
};
