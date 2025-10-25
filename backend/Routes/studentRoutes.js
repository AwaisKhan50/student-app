import express from 'express'
import { createStudent, deleteStudent, editStudent, readStudent, studentList } from '../controllers/studentControllers.js'

const studentRouter= express.Router()

studentRouter.get('/students',studentList)

studentRouter.put('/edit/:id',editStudent)      

studentRouter.delete('/delete/:id',deleteStudent)

studentRouter.post('/create',createStudent)

studentRouter.get('/read/:id',readStudent)



export default studentRouter;