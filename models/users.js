const mongoose = require('mongoose')
require('../db/conn')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    profilePic:{
        type: String
    }
})

module.exports = mongoose.model("User", userSchema);