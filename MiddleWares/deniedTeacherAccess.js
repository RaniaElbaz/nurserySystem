module.exports = (request,response,next)=>{
    console.log(request.role);
    if(request.role == "teacher"){
        let error = new Error("Not authorized");
        error.status = 403;
        next(error);
    }
    else{
        next();
    }
}