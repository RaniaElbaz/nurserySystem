const express = require("express");
const { body, param } = require("express-validator");

const authMW = require("../MiddleWares/authMW");
const hashMW = require("../MiddleWares/hashPassword");
const teacherDenyAccess = require("../MiddleWares/deniedTeacherAccess");
const controller = require("./../controllers/teacherController");
const validationMW = require("./../MiddleWares/validationMW");

const teacherRoute = express.Router();

teacherRoute.use(authMW,(request,response,next)=>{
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

teacherRoute.route("/teachers")
    .get(teacherDenyAccess, controller.getAllTeachers)
    .post(teacherDenyAccess,
    [
        // fullname
        body("fullname").isAlpha().withMessage("teacher's name should be characters")
        .isLength({min:3}).withMessage("teacher name lenghth > 3"),
        //password
        body("password").isLength({min:4}).withMessage("teacher password lenghth > 4"),
        //email
        body("email").isEmail().withMessage("Please enter valid email"),
        // image
        body("image").optional({ checkFalsy: true, nullable: true }).isString().withMessage("not a valid image source"),
    ],
    validationMW,
    hashMW.hashPassword,
    controller.addTeacher)
    .put(teacherDenyAccess,
    [
        // fullname
        body("fullname").optional({ checkFalsy: true, nullable: true }).isAlpha().withMessage("teacher's name should be characters")
        .optional({ checkFalsy: true, nullable: true }).isLength({min:3}).withMessage("teacher name lenghth > 3"),
        //password
        body("password").optional({ checkFalsy: true, nullable: true }).isLength({min:4}).withMessage("teacher password lenghth > 4"),
        //email
        body("email").optional({ checkFalsy: true, nullable: true }).isEmail().withMessage("Please enter valid email"),
        // image
        body("image").optional({ checkFalsy: true, nullable: true }).isString().withMessage("not a valid image source"),
    ],
    validationMW,
    hashMW.hashPassword,
    controller.updateTeacher);

teacherRoute.route("/teachers/:id")
    .get([
        param("id").isMongoId().withMessage("invalid Teacher id")
    ],
    validationMW,
    controller.getTeacherById)
    .delete(teacherDenyAccess,
    [
        param("id").isMongoId().withMessage("invalid Teacher id")
    ],
    validationMW,
    controller.deleteTeacher);

teacherRoute.route("/teachers/forgotpassword")
    .post(controller.getTeacherPassword);
module.exports = teacherRoute;