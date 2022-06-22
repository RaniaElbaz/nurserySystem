const express = require("express");

const authMW = require("../MiddleWares/authMW");
const controller = require("../controllers/resetPassword");

const route = express.Router();

route.use(authMW,(request,response,next)=>{
    if(request.role == "admin" || request.role == "teacher"){
        next();
    }
    else
    {
        let error = new Error("Not authorized");
        error.status = 403;
        next(error);
    }
})

route.post("/resetpassword",
    controller.reset);

module.exports = route;