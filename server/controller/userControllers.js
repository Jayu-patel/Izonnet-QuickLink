const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const cloudinary = require('cloudinary').v2
const otpGenerator = require("otp-generator")
const Otp = require('../models/Otp')
const sendEmail = require('../utils/mailer')
const Message = require('../models/Message')

const register=async(req,res)=>{
    try{
        const {username, email, password, mobile} = req.body
        if ( !username || !email || !password || !mobile) return res.status(400).json({message: "Please provide all data"});

        const userExists = await User.findOne({ email });
        if(userExists) return res.status(400).json({message: "User already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword, mobile });
        await newUser.save()

        const userObj = {
            id: newUser._id,
            username,
            email,
            mobile,
        }
        return res.status(200).json({...userObj})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const login=async(req,res)=>{
    try{
        const { email, password } = req.body
        if ( !email || !password) return res.status(400).json({message: "Please provide all data"});

        const existingUser = await User.findOne({ email });

      if (existingUser) {
      const isPasswordValid = await bcrypt.compare( password, existingUser.password);

      if (isPasswordValid) { 
        const token = jwt.sign({username: existingUser.username, email: existingUser.email, id: existingUser._id}, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        const resObj = {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            mobile: existingUser.mobile,
            address: existingUser.address,
            dob: existingUser.dob,
            gender: existingUser.gender,
            profile: existingUser.profile,
            token
        }
        res.cookie(
            'user_token', 
            token,
            {
                sameSite: 'Lax', httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 * 7,
            }
        )
        return res.status(200).json({...resObj});
      }
      else return res.status(400).json({message: "Invalid password"});
    }
    else return res.status(404).json({message: "User does not exists"});
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

// middleware required
const updateProfile=async(req,res)=>{
    try{
        const {id} = req.params
        const {username, mobile, dob, gender, address} = req.body
        const imageFile = req.file
        const existingUser = await User.findById(id);
        
        let imageUrl
        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type: "image"})
            imageUrl = imageUpload.secure_url
        }
        if(existingUser){
        existingUser.username = username || existingUser.username;
        existingUser.mobile = mobile || existingUser.mobile;
        existingUser.dob = dob || existingUser.dob;
        existingUser.gender = gender || existingUser.gender;
        existingUser.profile = imageUrl || existingUser.profile;
        existingUser.address = JSON.parse(address) || existingUser.address;

        await existingUser.save()

        return res.status(200).json({message: "Profile updated successfully!!!"})
      }
      else{
        return res.status(404).json({message: "User not found"})
      }

    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

// middleware required
const getUserById=async(req,res)=>{
    try{
        const {id} = req.params
        const existingUser = await User.findById(id);
        if(existingUser){
            return res.status(200).json({
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                mobile: existingUser.mobile,
                address:existingUser. address,
                dob: existingUser.dob,
                gender: existingUser.gender,
                profile: existingUser.profile,
            })
        }
        else{
            return res.status(404).json({message: "User not found"})
        }
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const getOtp=async(req,res)=>{
    try{
        const {email} = req.params

        const userExists = await User.findOne({email})
        if(!userExists){
            return res.status(404).json({message: "User does not exists!"})
        }

        const otp =  otpGenerator.generate(6,{
            lowerCaseAlphabets: false, 
            upperCaseAlphabets: false, 
            specialChars: false
        })
        await Otp.create({
            email,
            otp,
            // expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        await sendEmail(email, "OTP", `Dear user, \nYour Otp for password recovery is ${otp}`);

        return res.status(200).json({message: "Otp is sent you email", otp})

    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const verifyOtp=async(req,res)=>{
    try{
        const { email, otp } = req.body;

        const otpDoc = await Otp.findOne({ email, otp });
        if (!otpDoc || otpDoc.isUsed) return res.status(400).json({ message: 'Invalid or used OTP' });
        if (otpDoc.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

        otpDoc.isUsed = true;
        await otpDoc.save();

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

        return res.status(200).json({ message: 'OTP verified', token });
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const resetPassword=async(req,res)=>{
    try{
        const {token, newPassword} = req.body

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            return res.status(400).json({message: "session token expired"})
        }
        const email = decoded.email;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const contact=async(req,res)=>{
    try{
        const {name, email, message} = req.body
        
        if(!name || !email || !message){
            return res.status(400).json({message: "Provide all fields!"})
        }

        const newMessage = new Message({name, email, message})
        await newMessage.save()

        return res.status(200).json({message: "Message sent"})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

module.exports = {
    register,
    login,
    updateProfile,
    getUserById,
    getOtp,
    verifyOtp,
    resetPassword,
    contact
}