const jwt=require("jsonwebtoken");
require('dotenv').config()

module.exports=(request,response,next)=>{
    let decodedToekn = null;
    try {
        let token = request.get("Authorization").split(" ")[1];
        decodedToekn = jwt.verify(token,process.env.SECRET_KEY);
        request.role = decodedToekn.role;
        request.id = decodedToekn.id;
        next();
    }
    catch(error) {
        error.message="Not Authorized";
        error.status= 403;
        next(error);      
    }
}