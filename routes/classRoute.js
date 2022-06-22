const express = require("express");
const { body, param } = require("express-validator");

const authMW = require("../MiddleWares/authMW");
const controller = require("./../controllers/classController");
const validationMW = require("./../MiddleWares/validationMW");

const classRoute = express.Router();

classRoute.use(authMW,(request,response,next)=>{
    if(request.role == "admin"){
        next();
    }
    else
    {
        let error = new Error("Not authorized");
        error.status = 403;
        next(error);
    }
})

classRoute.route("/class")
    .get(controller.getAllClasses)
    .post([
        body("id").optional({ checkFalsy: true, nullable: true })
        .isNumeric().withMessage("id must be a number"),
        //name
        body("name").isAlpha().withMessage("class's name should be characters")
        .isLength({min:3}).withMessage("class name lenghth > 3"),
        //supervisor
        body("supervisor").optional({ checkFalsy: true, nullable: true })
        .isMongoId().withMessage("supervisor id ust be an existing id"),
        //children
        body("children").optional({ checkFalsy: true, nullable: true }).not().isEmpty().withMessage("children number must be > 2"),
    ],
    validationMW,
    controller.addClass)
    .put([
        body("id").isNumeric().withMessage("id must be a number"),
        //name
        body("name").optional({ checkFalsy: true, nullable: true }).isAlpha().withMessage("class's name should be characters")
        .optional({ checkFalsy: true, nullable: true }).isLength({min:3}).withMessage("class name lenghth > 3"),
        //supervisor
        body("supervisor").optional({ checkFalsy: true, nullable: true })
        .isMongoId().withMessage("supervisor id ust be an existing id"),
        //children
        body("children").optional({ checkFalsy: true, nullable: true }).not().isEmpty().withMessage("children number must be > 2"),
    ],
    validationMW,
    controller.updateClass)

classRoute.route("/class/:id")
    .get([
        param("id").isNumeric().withMessage("class id should be a number")
    ],
    validationMW,
    controller.getClassById)
    .delete([
        param("id").isNumeric().withMessage("Child id should be a number")
    ],
    validationMW,
    controller.deleteClass)

classRoute.route("/classchildern/:id")
    .get([
        param("id").isNumeric().withMessage("Child id should be a number")
    ],
    validationMW,
    controller.getClassChildren)

classRoute.route("/classTeacher/:id")
    .get([
        param("id").isNumeric().withMessage("Child id should be a number")
    ],
    validationMW,
    controller.getClassTeacher)

module.exports = classRoute;