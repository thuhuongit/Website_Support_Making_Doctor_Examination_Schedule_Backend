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
        users
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
module.exports = {
    handleLogin,
    getAllUsers
};
