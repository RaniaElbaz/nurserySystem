const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

//create schema object
const classSchema = new mongoose.Schema({
    _id:{
        type:Number
    },
    name:{
        type:String,
        required: true,
    },
    supervisor:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "teachers"
    },
    children:[{
        type: Number,
        ref: "children",
        unique: true
    }],
}, { _id: false });

//mapping
classSchema.plugin(AutoIncrement, {id: 'classID'});
mongoose.model("classes",classSchema);