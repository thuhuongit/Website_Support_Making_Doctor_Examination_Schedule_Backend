import userService from "../services/userService";

let handleLogin = async function (req, res) {
    let email = req.body.email;
    console.log('your email: ' + email)
    let password = req.body.password;
    

    if (!email || !password){
        return res.status(500).json({
            errCode: 1,
            message: 'missing inputs'
        })
    }

    let userData = await userService.handleUserLogin(email, password); 
    

    
    res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage, 
        user: userData.user ? userData.user : {}
          
        

    })
}

let getAllUsers = async(req, res) => {
    let id = req.query.id;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: []

        })
        
    
        
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users: users || []
    })
}
let getOne = async(req, res) => {
    let id = req.query.id;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: []

        })
        
    
        
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
  try {
    const data = req.body;
    const avatarFile = req.file;

    // Nếu có file thì thêm đường dẫn file vào data
    if (avatarFile) {
      data.avatar = `/uploads/${avatarFile.filename}`; // đường dẫn để client truy cập
    }

    const message = await userService.createNewUser(data);
    return res.status(200).json(message);
  } catch (e) {
    console.error("Error in handleCreateNewUser:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi server" });
  }
};

let handleEditUser = async(req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
    

}

let handleDeleteUser = async (req, res) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing user ID",
      });
    }
  
    try {
      const result = await userService.deleteUser(id);
      if (result) {
        return res.status(200).json({
          errCode: 0,
          errMessage: "User deleted successfully",
        });
      } else {
        return res.status(404).json({
          errCode: 2,
          errMessage: "User not found",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        errCode: -1,
        errMessage: "An error occurred while deleting the user",
      });
    }
  };
  
let getAllCode = async(req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        console.log(data)
        return res.status(200).json(data); 
        
    } catch (e) {
        console.log('Get all code error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'

        })
        
    }
}
let postForgotPassword = async (req, res) => {
    try {
      let infor = await userService.postForgotPasswordService(req.body);
      return res.status(200).json(infor);
    } catch (e) {
      console.log(e);
      return res.status(200).json({
        errCode: -1,
        errMessage: "Error from server",
      });
    }
  };
  
  let postVerifyRetrievePassword = async (req, res) => {
    try {
      let infor = await userService.postVerifyRetrievePasswordService(req.body);
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
    handleLogin,
    getAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
    postForgotPassword,
    postVerifyRetrievePassword,
};
