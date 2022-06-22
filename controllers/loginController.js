const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
// require('dotenv').config()

require("./../models/teacherData");

let Teacher = mongoose.model("teachers");

module.exports.login=(request,response,next)=>{
    if(request.body.email == process.env.adminEmail
        && request.body.password == process.env.adminPassword){
            /***************** */
            let token = jwt.sign({
                role: "admin"
            },
            process.env.SECRET_KEY,{expiresIn:"1h"})
            response.status(200).json({token, message:"login"});
            /***************** */
    }  
    else{
        Teacher.findOne({
            email: request.body.email
            // password: request.body.password
        })
        .then(data=>{
            if(!data){
                let error = new Error("username or password incorrect")
                error.status = 401;
                throw error;
            }
            /***************** */
            bcrypt.compare(request.body.password, data.password)
            .then(function(result) {
                if(result == true){
                    let token = jwt.sign({
                        id: data._id,
                        role: "teacher"
                    },
                    process.env.SECRET_KEY,{expiresIn:"1h"});
                    response.status(200).json({token, message:"login"});
                }
                else{
                    throw Error("password unmatched")
                }
            });

            // let token = jwt.sign({
            //     id: data._id,
            //     role: "teacher"
            // },
            // process.env.SECRET_KEY,{expiresIn:"1h"});
            // response.status(200).json({token, message:"login"});
            /***************** */
        })
        .catch(error=>next(error));
    }
}