const mongoose = require("mongoose");

require("./../models/teacherData");

let Teacher = mongoose.model("teachers");

module.exports.reset = (request,response,next)=>{
    if(request.role == "teacher"){
        Teacher.findOne({
            email: request.body.email,
            password: request.body.password
        })
        .then(data=>{
            if(!data){
                let error = new Error("username or password incorrect")
                error.status = 401;
                throw error;
            }
            else{
                if(request.id == data._id){
                    if(request.body.password != request.body.newpassword){
                        data.password = request.body.newpassword;
                        response.status(201).json(data);
                        data.save()
                    }
                    else{
                        next(new Error("new password cant be the same old password"))
                    }
                }
                else{
                    next(new Error("access denied"))
                }
            }
        })
        .catch(error=>next(error));
    }
}