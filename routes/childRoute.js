const express = require("express");
const { body, param } = require("express-validator");

const authMW = require("../MiddleWares/authMW");
const controller = require("./../controllers/childController");
const validationMW = require("./../MiddleWares/validationMW");

const childRoute = express.Router();

childRoute.use(authMW,(request,response,next)=>{
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

childRoute.route("/child")
    .get(controller.getAllChildren)
    .post([
        // body("id").optional({ checkFalsy: true, nullable: true })
        // .isNumeric().withMessage("id must be a number"),
        //fullname
        body("fullname").isAlpha().withMessage("child's name should be characters")
        .isLength({min:3}).withMessage("child name lenghth > 3"),
        //age
        body("age").optional({ checkFalsy: true, nullable: true })
        .isInt({ min: 1 }).withMessage("age must be >1"),
        //level
        body("level").isIn(['preKG', 'KG1', 'KG2']).withMessage("Please enter valid level"),
        //address
        body("address").optional({ checkFalsy: true, nullable: true })
        .isObject().withMessage("address must contain 'city,street,building'"),
        body("address.city").optional({ checkFalsy: true, nullable: true }).isString().withMessage("address must contain 'city'"),
        body("address.street").optional({ checkFalsy: true, nullable: true }).isString().withMessage("address must contain 'street'"),
        body("address.building").optional({ checkFalsy: true, nullable: true }).isString().withMessage("address must contain 'building'")
    ],
    validationMW,
    controller.addChild)
    .put([
        body("id").isNumeric().withMessage("id must be a number"),
        //fullname
        body("fullname").optional({ checkFalsy: true, nullable: true }).isAlpha().withMessage("child's name should be characters")
        .optional({ checkFalsy: true, nullable: true }).isLength({min:3}).withMessage("child name lenghth > 3"),
        //age
        body("age").optional({ checkFalsy: true, nullable: true }).isInt({ min: 1 }).withMessage("age must be >1"),
        //level
        body("level").optional({ checkFalsy: true, nullable: true }).isIn(['preKG', 'KG1', 'KG2']).withMessage("Please enter valid level"),
        //address
        body("city").optional({ checkFalsy: true, nullable: true }).isString().withMessage("address must contain 'city'"),
        body("street").optional({ checkFalsy: true, nullable: true }).isString().withMessage("address must contain 'street'"),
        body("building").optional({ checkFalsy: true, nullable: true }).isString().withMessage("address must contain 'building'")
    ],
    validationMW,
    controller.updateChild);

    childRoute.route("/child/:id")
        .get([
            param("id").isNumeric().withMessage("Child id should be a number")
        ],
        validationMW,
        controller.getChildById)
        .delete([
            param("id").isNumeric().withMessage("Child id should be a number")
        ],
        validationMW,
        controller.deleteChild);

module.exports = childRoute;