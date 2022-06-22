const mongoose = require("mongoose");

//craete schema object
const teacherSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Types.ObjectId,
    },
    fullname:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    image:{
        type:String,
    },
});

//mapping
mongoose.model("teachers",teacherSchema);