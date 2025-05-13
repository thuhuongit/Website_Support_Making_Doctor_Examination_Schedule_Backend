import specialtyService from "../services/speciatlyService";

let createSpecialty = async (req, res) => {
  try {
    const { name, descriptionMarkdown, descriptionHTML } = req.body;
    const imageFile = req.file;

    // Kiểm tra các thông tin bắt buộc
    if (!name || !descriptionMarkdown || !descriptionHTML || !imageFile) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu thông tin bắt buộc!",
      });
    }

    // Dữ liệu sẽ được lưu vào cơ sở dữ liệu
    const data = {
      name,
      descriptionMarkdown,
      descriptionHTML,
      image: `uploads/${imageFile.filename}`,
    };

    // Gọi service để thêm chuyên khoa
    const result = await specialtyService.createSpecialty(data);

    // Trả về kết quả thành công
    return res.status(200).json({
      errCode: 0,
      message: "Thêm chuyên khoa thành công!",
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


let getAllSpecialty = async (req, res) => {
  try {
    let infor = await specialtyService.getAllSpecialty(); // Call to the service
    return res.status(200).json(infor); // Return data to the client
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};


let getDetailSpecialtyById = async (req, res) => {
  try {
    let infor = await specialtyService.getDetailSpecialtyById(
      req.query.id,
      req.query.location
    );
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
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
};
