import express from 'express';
import cors from 'cors';
import { connectDB } from './db/dbConnection.js';
import dotenv from 'dotenv';
import studentRouter from './Routes/studentRoutes.js';
import authRouter from './Routes/authRoutes.js';
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
 
connectDB();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})); 
app.use(express.json());
app.use(cookieParser());




app.use(authRouter)
app.use(studentRouter)

// Public students endpoint (no auth) - useful for debugging / public listing















app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

 


 