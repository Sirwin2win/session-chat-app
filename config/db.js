const mongoose = require('mongoose')


const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Connected: ${conn.connection.host} ${conn.connection.name}`)
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connectDB