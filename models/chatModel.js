const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    // use an array of objects to store the conversation flow
    messages:[{
        role:{type:String,enum:['user','model'],required:true},
        parts:{type:String,required:true},
        timestamp:{type:Date,default:Date.now}
    }],
    // New: Store a short bio/summary of what the user like
})

const Chat = mongoose.model('Chat',ChatSchema)
module.exports = Chat