import express from 'express';
import { login, register } from '../controllers/authContorllers.js';
import validateToken from '../middlewares/validateToken.js';
import { connectDB } from '../db/dbConnection.js';
const authRouter= express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);


authRouter.get("/check-auth", validateToken, async(req, res) => {
  return res.status(200).json({ user: req.user });
});





authRouter.get('/home', validateToken, async (req, res, next) => {
  try {
    const db = await connectDB();

    const [rows] = await db.query('SELECT username, email FROM users WHERE id = ?', [req.user.id]);
    const userData = rows[0];

    if (!userData) {
      return res.status(404).json({ message: 'user not found' });
    }

    return res.status(200).json({ message: 'welcome to home page', username: userData.username, email: userData.email, userData });
  } catch (error) {
    console.error('GET /home error', error);
    return res.status(500).json({ message: 'internal server error' });
  }
});

authRouter.get('/logout', async(req,res) => {
      res.clearCookie('token')
     return res.status(200).json({message: "user logout successfully"})
})
export default authRouter; 