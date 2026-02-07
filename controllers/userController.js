const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register user
exports.register = async(req,res)=>{
    const {name,email,password} = req.body
    //check if email exists
    const isUser = await User.findOne({email})
    if(isUser){
       return res.send('User already exists') 
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = new User({
        name:name,
        email:email,
        password:hashedPassword
    })
    try {
        const newUser = await user.save()
        if(!newUser){
            res.status(401).json({msg:"Sorry, we could not register user"})
        }
        res.status(201).json({newUser})
    } catch (error) {
        res.send(error.message)
    }
}
// Login user
exports.login = async(req,res)=>{
    const {email,password} = req.body
    // check for user
    const user = await User.findOne({email})
    if(!user){
      return  res.status(404).json({message:"User not found"})
    }
    try {
        // if(user && await bcrypt.compare(password,user.password)){
            // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
        req.session.userId = user._id.toString();
        res.status(201).json({msg:'Logged in successfully!'})        
    
    } catch (error) {
        res.send(error.message)
    }
}

exports.logout = async(req,res)=>{
    res.session.destroy(err=>{
        if(err){
            return res.status(500).json({msg:"Logout failed"})
        }
        res.clearCookie('connect.sid')
        res.status(200).json({msg:'Logded out'})
    })
}
