const mongoose = require("mongoose");
require("./../models/classData");

let Class = mongoose.model("classes");
/**
 get all Classs data
 */
module.exports.getAllClasses=(request,response,next)=>{
    Class.find({})
        .then(data=>{
            response.status(200).json(data);
        })
        .catch(error=>{
            next(error);
        })
}
/**
 get one Class by ID
 */
module.exports.getClassById=(request,response,next)=>{
    Class.findOne({_id:request.params.id})
    .then(data=>{
      if(data == null) next(new Error("Class not found"))
      response.status(200).json(data);
    })
    .catch(error=>{
      next(error);
    })
}
/**
 get one Class Children
 */
module.exports.getClassChildren=(request,response,next)=>{
    Class.findOne({_id:request.params.id}).populate({path:"children", select:{"_id":0,"fullname":1}})
    .then(data=>{
      if(data == null) next(new Error("Class not found"))
      response.status(200).send(data.children);
    })
    .catch(error=>{
      next(error);
    })
}
/**
 get one Class supervisor
 */
module.exports.getClassTeacher=(request,response,next)=>{
    Class.findOne({_id:request.params.id}).populate({path:"supervisor",select:{"_id":0,"fullname":1}})
    .then(data=>{
      if(data == null) next(new Error("Class not found"))
      response.status(200).send(data);
    })
    .catch(error=>{
      next(error);
    })
}
/**
 add new Class
 */
module.exports.addClass=(request,response,next)=>{
    let object = new Class({
        _id:request.body.id,
        name : request.body.name,
        supervisor : request.body.supervisor,
        children : request.body.children,
    });
    object.save()
        .then(data=>{
            response.status(201).json({data:"added"});
        })
        .catch(error=>next(error))      
}
/**
 update a Class data
 */
module.exports.updateClass=(request,response,next)=>{
    Class.findById(request.body.id)
        .then(data => {
            for(let key in data){
                if(key == 'children' && request.body[key]) data[key] = [...data[key], ...request.body[key]];
                else data[key] = request.body[key] || data[key];
            }
            return data.save()
        })
        .then(data=>{
            response.status(201).json({data:"updated"});
        })
        .catch(error=>next(error)) 
    // Class.updateOne({_id:request.body.id},
    //     {
    //         $set:{
    //             name : request.body.name,
    //             supervisor : request.body.supervisor,
    //             children : request.body.children,
    //         }
    //     })
    //     .then(data=>{
    //         response.status(200).json(data);
    //     })
    //     .catch(error=>next(error));    
}
/**
 delete a Class
 */
module.exports.deleteClass=(request,response)=>{
    Class.deleteOne({_id:request.params.id})
    .then(data=>{
        response.status(200).json({data:"delete " + request.params.id})
    })
    .catch(error=>next(error)); 
}