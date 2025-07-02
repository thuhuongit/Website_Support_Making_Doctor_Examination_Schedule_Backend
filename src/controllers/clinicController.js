import clinicService from "../services/clinicService";

// Thêm quản lý phòng khám từ admin 
let createClinic = async (req, res) => {
  try {
    const { name, address, description } = req.body;
    const imageFile = req.file; 

    if (!name || !address || !imageFile || !description) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu thông tin bắt buộc!",
      });
    }

    
    const data = {
      name,
      address,
      description,
      image: `uploads/${imageFile.filename}`,
    }

     
        const result = await clinicService.createClinic(data);
    
        return res.status(200).json({
          errCode: 0,
          message: "Thêm phòng khám thành công!",
          data: result,
        });
      } catch (e) {
       
        console.error(e);
        return res.status(500).json({
          errCode: -1,
          errMessage: "Lỗi server",
        });
      }
    };


// Lấy danh sách phòng khám từ db lên giao diện 
let getAllClinic = async (req, res) => {
  try {
    let infor = await clinicService.getAllClinic();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Lấy chi tiết phòng khám theo ID 
let getDetailClinicById = async (req, res) => {
  try {
    let infor = await clinicService.getDetailClinicById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};


// Xóa phòng khám theo ID
let deleteClinic = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await clinicService.deleteClinic(id);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Sửa thông tin phòng khám theo ID
let editClinic = async (req, res) => {
  try {
    const { id, name, address, description } = req.body;
    const imageFile = req.file; 

    if (!id || !name || !address || !description) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu thông tin bắt buộc!",
      });
    }

    const data = {
      id,
      name,
      address,
      description,
    };

    if (imageFile) {
      data.image = `uploads/${imageFile.filename}`;
    }

    const result = await clinicService.editClinic(data);

    if (result && result.errCode === 0) {
      return res.status(200).json({
        errCode: 0,
        message: "Sửa phòng khám thành công!",
        data: result.data || null,
      });
    } else {
      return res.status(500).json({
        errCode: result.errCode || -1,
        errMessage: result.errMessage || "Có lỗi xảy ra khi sửa phòng khám!",
      });
    }

  } catch (e) {
    console.error("Lỗi editClinic:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi server nội bộ!",
    });
  }
};


module.exports = {
  createClinic,
  getAllClinic,
  getDetailClinicById,
  deleteClinic, 
  editClinic, 

};
