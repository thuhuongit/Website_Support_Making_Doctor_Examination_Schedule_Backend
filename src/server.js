import express from "express";
import bodyParser from "body-parser"; 
import viewEngine from "./config/viewEngine";
import inintWebRoutes from './route/web';
import connectDB from './config/connectDB';



require('dotenv').config();
let app = express();

// config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}))


viewEngine(app);
inintWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
// Nếu chưa được khai ở .env (#PORT=8080) thfi ta có thể khai báo ở đây là
// Port === undefined => port = 6969
// let port = process.env.PORT || 6969; như vậy acc không chết 
app.listen(port, () =>{
    //callback 
    console.log("Backend Nodejs is runing on the port : " + port)
})