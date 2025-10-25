import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { connectDB } from "../db/dbConnection.js";
import jwt from "jsonwebtoken";
import { UserRound } from "lucide-react";


export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body || {};

  // basic server-side validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email and password are required' });
  }

  try {
    const db = await connectDB();
    const [isExists] = await db.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (Array.isArray(isExists) && isExists.length > 0) {
      return res.status(400).json({ message: 'Email or Username already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username,email,password) VALUES (?,?,?)',
      [username, email, hashedPassword]
    );

    return res.status(201).json({ message: 'user registered successfully', userId: result.insertId,username:username });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
});
export const login =asyncHandler( async (req, res) => {
    try{

        
        const { email, password } = req.body;
    const db = await connectDB();
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const user=rows[0];
    if (!user ) {
        return res.status(400).json({ message: "user not found" });
    } 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "invalid credentials" });
    }
    const token=  jwt.sign({id:user.id,username:user.username,email:user.email},process.env.JWT_SECRET,{expiresIn:'1d'});
    res.cookie("token",token)
   return res.status(200).json({message:"login successful", userId: user.id,token:token});
}catch (error) {
    console.log(error);
}

   

    
     
    

});
