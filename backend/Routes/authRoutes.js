import express from 'express';
import { login, register } from '../controllers/authContorllers.js';
import  validateToken  from '../middlewares/validateToken.js';
const authRouter= express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);


authRouter.get("/check-auth", validateToken, async(req, res) => {
  return res.status(200).json({ user: req.user });
});





authRouter.get('/home',validateToken,async (req,res)=>{
  try {

    const [user]=await db.query("SELECT username, email FROM users WHERE id = ?", [req.user.id])
    return res.status(200).json({message:"welcome to home page", user  });

    
  } catch (error) {
    
  }
})

authRouter.get('/logout', async(req,res) => {
      res.clearCookie('token')
     return res.status(200).json({message: "user logout successfully"})
})
export default authRouter; 