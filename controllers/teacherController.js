const mongoose = require("mongoose");
const multer  = require('multer')
const upload = multer({ dest: '../images/' })

require("./../models/teacherData");

let Teacher = mongoose.model("teachers");
/**
 get all teachers data
 */
module.exports.getAllTeachers=(request,response,next)=>{
    Teacher.find({})
        .then(data=>{
            response.status(200).json(data);
        })
        .catch(error=>{
            next(error);
        })
}
/**
 get one teacher by ID
 */
module.exports.getTeacherById=(request,response,next)=>{
    if(request.role == "admin" ||
       (request.role == "teacher" && request.id == request.params.id)){

        Teacher.findOne({_id:request.params.id})
        .then(data=>{
        if(data == null) next(new Error("teacher not found"))
        response.status(200).json(data);
        })
        .catch(error=>{
        next(error);
        })

    }
    else{
        let error = new Error("Not authorized");
        error.status = 403;
        next(error);
    }
}
/**
 * get teachers password
 */
module.exports.getTeacherPassword = (request,response,next) => {
    Teacher.findOne({email: request.body.email})
    .then(data=>{
      if(data == null) next(new Error("email not registered"))
      response.status(200).json(data);
    })
    .catch(error=>{
      next(error);
    })
}
/**
 add new teacher
 */
module.exports.addTeacher=(request,response,next)=>{
    let object = new Teacher({
        _id: mongoose.Types.ObjectId(),
        fullname : request.body.fullname,
        password : request.body.password,
        email : request.body.email,
        image : request.file
    });
    object.save()
        .then(data=>{
            response.status(201).json({data:"added"});
        })
        .catch(error=>next(error))      
}
/**
 update a teacher data
 */
module.exports.updateTeacher=(request,response,next)=>{
    if(request.role == "admin" ||
       (request.role == "teacher" && request.id == request.body.id)){

        Teacher.findById(request.body.id)
        .then(data => {
            for(let key in data){
                if(request.role == "admin" && key == "password"){
                    next(new Error("could not update teacher password"))
                }
                data[key] = request.body[key] || data[key];
            }
            return data.save()
        })
        .then(data=>{
            response.status(201).json({data:"updated"});
        })
        .catch(error=>next(error)) 
    }
    else{
        let error = new Error("Not authorized");
        error.status = 403;
        next(error); 
    }
    // Teacher.updateOne({_id:request.body.id},
    //     {
    //         $set:{
    //             fullname: request.body.fullname,
    //             password : request.body.password,
    //             email : request.body.email,
    //             image : request.body.image,
    //         }
    //     })
    //     .then(data=>{
    //         response.status(200).json(data);
    //     })
    //     .catch(error=>next(error));    
}
/**
 delete a teacher
 */
module.exports.deleteTeacher=(request,response)=>{
    Teacher.deleteOne({_id:request.params.id})
    .then(data=>{
        response.status(200).json({data:"delete " + request.params.id})
    })
    .catch(error=>next(error)); 
}