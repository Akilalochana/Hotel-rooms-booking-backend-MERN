import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';  
import studentRouter from './routes/studentRoute.js';


const app = express();

app.use(bodyParser.json());// add midleman

let mongoUrl = "mongodb+srv://admin:123@cluster0.hxocrso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUrl);

let connection = mongoose.connection;
connection.once("open",()=>{
      console.log("MongoDB connection establised successfully!")
})

app.use("/students", studentRouter)

app.listen(3000, ()=>{
      console.log("Server is running on port 3000");
})