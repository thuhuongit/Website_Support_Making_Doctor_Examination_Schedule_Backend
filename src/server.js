import express from "express"; 
import bodyParser from "body-parser";  
import viewEngine from "./config/viewEngine"; 
import inintWebRoutes from './route/web'; 
import connectDB from './config/connectDB'; 
import cors from "cors";   
const path = require('path');


require('dotenv').config();  

let app = express();   

// Cấu hình CORS    
app.use(cors({     
    origin: '*',     
    methods: ['GET', 'POST', 'PUT', 'DELETE'],     
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Config app
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));  

viewEngine(app); 
inintWebRoutes(app); 
connectDB();  

let port = process.env.PORT || 8082; 
app.listen(port, () => {     
    console.log("Backend Nodejs is running on the port : " + port); 
});
