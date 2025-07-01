const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Doctor = require('../models/Doctor')
const Appointment = require('../models/Appointment')
const User = require('../models/User')
const cloudinary = require('cloudinary').v2

const login=async(req,res)=>{
    try{
        const {email, password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({email}, process.env.ADMIN_JWT_SECRET, {
                expiresIn: "7d",
            });

            res.cookie("adminToken", token,{
                httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 60 * 60 * 24 * 7,
            });

            return res.status(200).json({token, success: true});
        }
        else{
            return res.status(400).json({message: "Invalid Credentials"})
        }
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

// middleware required
const addDoctor=async(req,res)=>{
    try{
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file
        if(!imageFile) return res.status(400).json({message: "image is required!"});

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.status(400).json({message: "missing details"})
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type: "image"})
        const imageUrl = imageUpload.secure_url

        const doctorExists = await Doctor.findOne({email})
        if(doctorExists) return res.status(400).json({message: "Doctor already exists with this email"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDoc = new Doctor({name, email, password: hashedPassword, speciality, degree, experience, about, fees, address, image: imageUrl, date: Date.now()})
        await newDoc.save()

        return res.status(200).json({message: "Doctor Added"})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

// middleware required
const changeAwailability=async(req,res)=>{
    try{
        const {docId} = req.body
        const docData = await Doctor.findById(docId)
        await Doctor.findByIdAndUpdate(docId, {available: !docData.available})

        return res.status(200).json({message: "Availablity Changed"})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

// middleware required
const getAllApointment=async(req,res)=>{
    try{
        const allAppointments = await Appointment.find({}).populate('userId', '-password').populate('docId', '-password');
        return res.status(200).json({appointments: allAppointments})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const cancelAppointment=async(req,res)=>{
    try{
        const {appointmentId} = req.body
        const appointmentdata = await Appointment.findById(appointmentId)

        await Appointment.findByIdAndUpdate(appointmentId, {cancelled: true})

        const {docId, slotDate, slotTime} = appointmentdata
        const doctorData = await Doctor.findById(docId)
        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await Doctor.findByIdAndUpdate(docId, {slots_booked})
        return res.status(200).json({message: "Appointment Cancelled"})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const getDashboardData=async(req,res)=>{
    try{
        const doctorData = await Doctor.find({})
        const userdata = await User.find({})
        const appointmentData = await Appointment.find({}).populate('userId', '-password').populate('docId', '-password');

        const dashData = {
            doctors: doctorData.length,
            patients: userdata.length,
            appointments: appointmentData.length,
            latestAppointments: appointmentData.reverse().slice(0,5)
        }

        return res.status(200).json({dashData})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

module.exports = {
    login,
    addDoctor,
    changeAwailability,
    getAllApointment,
    cancelAppointment,
    getDashboardData
}