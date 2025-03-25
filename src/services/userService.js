import { where } from "sequelize";
import db from "../models/index";
import bcrypt from 'bcryptjs';
import { raw } from "body-parser";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],
                    where: { email: email },
                    raw: true
                });

                if (user) {
                    // So sánh mật khẩu nhập vào với mật khẩu trong database
                    let check = bcrypt.compareSync(password, user.password);

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        console.log(user)

                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Incorrect password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'User not found';
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = 'Your email does not exist in our system';
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }
            });

            resolve(user ? true : false);
        } catch (e) {
            reject(e);
        }
    });
};



let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'all') {
                users = await db.User.findAll({
                    attributes: ['id', 'email', 'firstName', 'lastName', 'address', 'phonenumber', 'gender', 'roleId']
                });
            } else if (userId) {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: ['id', 'email', 'firstName', 'lastName', 'address', 'phonenumber', 'gender', 'roleId']
                });
            }

            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};


let createNewUser = (data) => {
    console.log("dât", data);

    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'Your email is already in used '
                })


            }
            let hashPasswordFromBcrypt = await hashUserPassword(data?.password || "default_password");
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId

            })

            resolve({
                errCode: 0,
                message: 'OK'
            })

        } catch (e) {
            reject(e);

        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let foundUser = await db.User.findOne({
                where: { id: userId }
            });

            if (!foundUser) {
                return resolve({
                    errCode: 2,
                    errMessage: 'The user does not exist'
                });
            }

            //await foundUser.destroy(); // Sửa `delete()` thành `destroy()`

            console.log('thuhuong check ', foundUser)
            await db.User.destroy({
                where: { id: userId }
            })

            return resolve({
                errCode: 0,
                message: 'The user has been deleted successfully'
            });
        } catch (e) {
            reject(e);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }

            let user = await db.User.findOne({
                where:
                    { id: data.id },
                raw: false

            })
            if (user) {
                user.email = data.email;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = data.phonenumber;
                user.gender = data.gender === '1' ? true : false;



                await user.save();

                resolve({
                    errCode: 0,
                    message: 'Update the user succeeds!'
                })

            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Users not found!'
                });


            }

        } catch (e) {
            reject(e);
        }
    })

}

module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUserData
};
