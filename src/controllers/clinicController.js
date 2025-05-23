import clinicService from "../services/clinicService";

let createClinic = async (req, res) => {
  try {
    const { name, address, descriptionMarkdown } = req.body;
    const imageFile = req.file; 

    if (!name || !address || !imageFile || !descriptionMarkdown) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu thông tin bắt buộc!",
      });
    }

    // Dữ liệu sẽ được lưu vào cơ sở dữ liệu
    const data = {
      name,
      address,
      descriptionMarkdown,
      image: `uploads/${imageFile.filename}`,
    }

    // Gọi service để thêm chuyên khoa
        const result = await clinicService.createClinic(data);
    
        // Trả về kết quả thành công
        return res.status(200).json({
          errCode: 0,
          message: "Thêm phòng khám thành công!",
          data: result,
        });
      } catch (e) {
        // Xử lý lỗi
        console.error(e);
        return res.status(500).json({
          errCode: -1,
          errMessage: "Lỗi server",
        });
      }
    };


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

module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
};
