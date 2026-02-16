const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register user
exports.register = async(req,res)=>{
    // getting user details from the html or api tester
    const {name,email,password} = req.body
    //check if email exists
    const isUser = await User.findOne({email})
    if(isUser){
       return res.send('User already exists') 
    }
    // hashing the password
    const hashedPassword = await bcrypt.hash(password,10)
    // bundling user info to be saved on the database
    const user = new User({
        name:name,
        email:email,
        password:hashedPassword
    })
    try {
        // save user
        const newUser = await user.save()
        if(!newUser){
            res.status(401).json({msg:"Sorry, we could not register user"})
        }
        // return the new user to the frontend
        res.status(201).json({newUser})
    } catch (error) {
        res.send(error.message)
    }
}

// login logic
exports.login = async (req, res) => {
    // getting user inputs from the html forms or api testers(e.g postman)
    const { email, password } = req.body;
    try {
        // checking if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        // comparing the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Set the session
        req.session.userId = user._id.toString();
        
        // Explicitly save the session before sending the response
        req.session.save((err) => {
            if (err) return res.status(500).json({ message: "Session save failed" });
            return res.status(200).json({ msg: 'Logged in successfully!',  userId:req.session.userId });
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




exports.logout = async(req,res)=>{
    res.session.destroy(err=>{
        if(err){
            return res.status(500).json({msg:"Logout failed"})
        }
        res.clearCookie('connect.sid')
        res.status(200).json({msg:'Logded out'})
    })
}
