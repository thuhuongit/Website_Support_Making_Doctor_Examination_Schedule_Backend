import express from "express";
import bodyParser from "body-parser"; 
import viewEngine from "./config/viewEngine";
import inintWebRoutes from './route/web';
import connectDB from './config/connectDB';
import cors from "cors"; // Sử dụng import thay vì require nếu đang dùng ES module

require('dotenv').config();

let app = express(); // ✅ Khởi tạo app trước khi dùng

// Cấu hình CORS

 
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
inintWebRoutes(app);
connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () => {
    console.log("Backend Nodejs is running on the port : " + port);
});
