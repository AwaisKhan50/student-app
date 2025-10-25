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
app.get('/public-students', async (req, res) => {
    try {
        const db = await connectDB();
        const [rows] = await db.query('SELECT * FROM studentList');
        return res.status(200).json(rows);
    } catch (err) {
        console.error('public-students failed', err);
        return res.status(500).json({ error: err.message });
    }
});

// Health check / quick DB check endpoint
app.get('/status', async (req, res) => {
    try {
        const db = await connectDB();
        // try a simple query to check users table exists
        const [rows] = await db.query("SHOW TABLES LIKE 'users'");
        const hasUsersTable = Array.isArray(rows) && rows.length > 0;
        return res.status(200).json({ db: true, hasUsersTable });
    } catch (err) {
        console.error('Status check failed', err);
        return res.status(500).json({ db: false, error: err.message });
    }
});

// Dev-only: seed some sample students if table is empty
app.post('/seed-students', async (req, res) => {
    try {
        const db = await connectDB();
        const [rows] = await db.query('SELECT COUNT(*) as cnt FROM studentList');
        const count = rows[0]?.cnt || 0;
        if (count > 0) {
            const [existing] = await db.query('SELECT * FROM studentList');
            return res.status(200).json({ seeded: false, students: existing });
        }

        const students = [ 
            ['Awais Khan', 'awais@example.com'],
            ['Ali Ahmed', 'ali@example.com'],
            ['Sara Noor', 'sara@example.com'],
        ];

        for (const s of students) {
            await db.query('INSERT INTO studentList (name, email) VALUES (?, ?)', s);
        }

        const [newRows] = await db.query('SELECT * FROM studentList');
        return res.status(201).json({ seeded: true, students: newRows });
    } catch (err) {
        console.error('seed-students failed', err);
        return res.status(500).json({ error: err.message });
    }
});










app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

 


 