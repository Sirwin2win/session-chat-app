const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"user name is required"],
        trim: true
    },
    email:{
        type:String,
        required:[true,"user email is required"],
        unique: true, // Prevents duplicate accounts
        lowercase: true, // Converts email to lowercase
        trim: true
    },
    password:{
        type:String,
        required:[true,"user password is required"]
    },
},{timestamps:true})

const User = mongoose.model('User',userSchema)
module.exports = User