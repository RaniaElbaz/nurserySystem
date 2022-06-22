require('dotenv').config()
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

/************ routes */
const loginRoute = require('./routes/loginRoute');
const resetPasswordRoute = require('./routes/resetPasswordRoute');
const teacherRoute = require('./routes/teacherRoute');
const childRoute = require('./routes/childRoute');
const classRoute = require('./routes/classRoute');
/************ */

//create server obejct
const app = express();
mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("DB Connected.");
        //listen to port number
        app.listen(process.env.PORT||8080,()=>{
            console.log("Listening on localhost:8080");
        });            
    })
    .catch(error=>console.log("Db Connection Error " + error));

/****************** MiddleWare *****************/
//1- MW url and method
app.use(morgan('dev')); //method-url-status-ms- :res[content-length]

//2- all users CORS MW
app.use(cors())

/****************** Routes *****************/
app.use(express.json());//body parsing

app.use(loginRoute);
app.use(resetPasswordRoute);
app.use(teacherRoute);
app.use(childRoute);
app.use(classRoute);

//3- Not Found MW
app.use((request,response)=>{
    console.log('Not Found MW');
    response.status(404).json({message:"Not Found"});
});

//4- Error MW
app.use((error,request,response,next)=>{
    console.log('Error MW');
    let status = error.status||500;
    response.status(status).json({message:"Internal Error:\n" + error});
})