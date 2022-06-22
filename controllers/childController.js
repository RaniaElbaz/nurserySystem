const mongoose = require("mongoose");
require("./../models/childData");

let Child = mongoose.model("children");
/**
 get all Children data
 */
module.exports.getAllChildren=(request,response,next)=>{
    Child.find({})
        .then(data=>{
            response.status(200).json(data);
        })
        .catch(error=>{
            next(error);
        })
}
/**
 get one Child by ID
 */
module.exports.getChildById=(request,response,next)=>{
    Child.findOne({_id:request.params.id})
    .then(data=>{
      if(data == null) next(new Error("Child not found"))
      response.status(200).json(data);
    })
    .catch(error=>{
      next(error);
    })
}
/**
 add new Child
 */
module.exports.addChild=(request,response,next)=>{
    let object = new Child({
        _id: request.body.id,
        fullname : request.body.fullname,
        age : request.body.age,
        level : request.body.level,
        address : request.body.address,
    });
    object.save()
        .then(data=>{
            response.status(201).json({data:"added"});
        })
        .catch(error=>next(error)) 
        
}
/**
 update a Child data
 */
module.exports.updateChild=(request,response,next)=>{
    Child.findById(request.body.id)
        .then(data => {
            for(let key in data){
                if(key == 'address'){
                    for(let addressKey in data[key]){
                        if(request.body[addressKey]){
                            data[key][addressKey] = request.body[addressKey]
                            break;
                        }
                    }
                } 
                else data[key] = request.body[key] || data[key];
            }
            return data.save()
        })
        .then(data=>{
            response.status(201).json({data:"updated"});
        })
        .catch(error=>next(error)) 
    // Child.updateOne({_id:request.body.id},
    //     {
    //         $set:{
    //             fullname : request.body.fullname,
    //             age : request.body.age,
    //             level : request.body.level,
    //             address : request.body.address,
    //         }
    //     })
    //     .then(data=>{
    //         response.status(200).json(data);
    //     })
    //     .catch(error=>next(error));    
}
/**
 delete a Child
 */
module.exports.deleteChild=(request,response)=>{
    Child.deleteOne({_id:request.params.id})
    .then(data=>{
        response.status(200).json({data:"delete " + request.params.id})
    })
    .catch(error=>next(error)); 
}