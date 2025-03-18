import userService from "../services/userService";

const handleLogin = async function (req, res) {
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

module.exports = {
    handleLogin
};
