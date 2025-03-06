
//let getHomePage = (req, res) => {
  //  return res.render('homepage.ejs');


//}
import db from'../models/index';
import CRUDService from '../services/CRUDService';


let getHomePage = async(req, res) => {

    try{
        let data = await db.User.findAll();
        console.log('----------------------')
        console.log(data)
        console.log('----------------------')

        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });

    }catch(e){
        console.log(e)
    }
    

 
}


let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');

}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');

}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message)
    return res.send('post crud from server');
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();

    console.log(data)

    return res.render('displayCRUD.ejs', {
        dataTable: data

    })
}
let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    //console.log(userId)
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        
        
        return res.render('editCRUD.ejs');
    } else {
        return res.send('Users not found!');
        
    }
    

    console.log(req.query.id);

    return res.send('hello from edit');
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD, 
    getEditCRUD: getEditCRUD,

}