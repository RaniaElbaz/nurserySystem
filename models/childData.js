const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const levels = ['preKG', 'KG1', 'KG2'];

const addressSchema = new mongoose.Schema({
    city:{
        type:String
    },
    street:{
        type:String
    },
    building:{
        type:String
    },
},{ _id : false });

//create schema object
const childSchema = new mongoose.Schema({
    _id:{
        type: Number
    },
    fullname:{
        type:String,
        required: true,
        unique: true
    },
    age:{
        type:String
    },
    level:{
        type:String,
        enum: levels,
        required: true
    },
    image:{
        type:String
    },
    address: addressSchema
}, { _id: false });

//mapping
childSchema.plugin(AutoIncrement, {id: 'childID'});
mongoose.model("children",childSchema);
