import mysql from 'mysql2/promise';

let connection;

export const connectDB = async () => {
    try{
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log("Database connected successfully");
        return connection;
    }catch(err){
        console.log("Database connection error", err);
        // rethrow so callers can handle the error and return 500s
        throw err;
    }
}