
import { connectDB } from '../db/dbConnection.js';

export const  studentList = async(req,res) => {
      try {
            const {name} = req.query;
            const db = await connectDB();
            const params = [];
            let query = 'SELECT * FROM studentList';
            if(name){
                query += ' WHERE name LIKE ?';
                params.push(`%${name}%`);
            }
              const [rows] = await db.execute(query,params);
              // log a small preview to help debugging (first 3 rows)
              return res.status(200).json(rows); 
          } catch (err) {
              console.error('Error fetching students', err);
              return res.status(500).json({ error: 'Failed to fetch students' });
          }
}

export const createStudent = async (req,res) => {
 
  try {
        const {name,email} = req.body
        const db=await connectDB();
        const [result] =await db.query(`INSERT INTO studentList (name,email) VALUES (?, ?)`,[name,email]);
        return res.status(201).send("student created successfully ",result.insertId)

        
    } catch (error) {
        console.log(error);
        return res.status(404).send("can not create user now ")
    }
}

export const readStudent = async (req,res) => {

       try {
      const db = await connectDB();
      const [rows] = await db.query(`SELECT * FROM studentList WHERE id = ?`, [req.params.id]);
    
      return res.status(200).send(rows[0] || null);
    }catch(err){
              console.log(`not found`,err);
              return res.status(403).json({error:"not found"})
        }
        
}

export const editStudent = async (req,res) => {
     try {
        const db = await connectDB();
        const {name,email} = req.body;
        const [result] = await db.query(`UPDATE studentList SET name = ?, email = ? WHERE id = ?`, [name,email,req.params.id]);
        if(result.affectedRows === 0){
            return res.status(404).json({error:"Student not found"})
        }
        return res.status(200).json({ message: 'Student updated' });
        } catch (error) {
            console.log(`update error`, error);
              return res.status(500).json({error:"Failed to update student"})
        }
}

export const deleteStudent = async (req,res) => {
     try {
            const id=req.params.id
            const db=await connectDB();
            const [result] = await db.query(`DELETE FROM studentList WHERE id = ?`, [id]);
            if(result.affectedRows===0){
                return res.status(404).send("Student not found");
            }
            return res.status(200).json({message:"student deleted successfully"})
        } catch (error) {
            console.log(error);  
            return res.status(404).json({message:"failed to delete the student"})
    
        }
}