const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Doctor = require('../models/Doctor')
const Appointment = require('../models/Appointment')
const User = require('../models/User')
const Admin = require('../models/Admin')
const cloudinary = require('cloudinary').v2

const login=async(req,res)=>{
    try{
        const {email, password} = req.body
        if ( !email || !password) return res.status(400).json({message: "Please provide all Credentials"});

        const existingAdmin = await Admin.findOne({ email });
        if(!existingAdmin) return res.status(404).json({message: "Admin with this email does not exist on database"})

        const isPasswordValid = await bcrypt.compare(password, existingAdmin.password)

        if(isPasswordValid) {
            const token = jwt.sign({email}, process.env.ADMIN_JWT_SECRET, {
                expiresIn: "7d",
            });

            res.cookie("adminToken", token,{
                httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 60 * 60 * 24 * 7,
            });

            return res.status(200).json({token, success: true});
        }
        else{
            return res.status(400).json({message: "Invalid Password"})
        }
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const register=async(req,res)=>{
    try{
        const {username, email, password} = req.body
        if ( !username || !email || !password) return res.status(400).json({message: "Please provide all data"});

        const adminExists = await Admin.findOne({email})
        if(adminExists) return res.status(400).json({message: "Admin already exists with these credentials"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new Admin({username, email, password: hashedPassword})
        await newAdmin.save()

        return res.status(200).json({message: "New Admin Created!"})
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

        const doctorExists = await Doctor.findOne({email})
        if(doctorExists) return res.status(400).json({message: "Doctor already exists with this email"});

        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type: "image"})
        const imageUrl = imageUpload.secure_url

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDoc = new Doctor({name, email, password: hashedPassword, speciality, degree, experience, about, fees, address: JSON.parse(address), image: imageUrl, date: Date.now()})
        await newDoc.save()

        return res.status(200).json({message: "Doctor Added"})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const removeDoctor=async(req,res)=>{
    try{
        const {id} = req.params

        const doctorExists = await Doctor.findById(id)
        if(!doctorExists){
            return res.status(404).json({message: "doctor don't exists on database"})
        }
        
        await Doctor.findByIdAndDelete(id)
        return res.status(200).json({message: "Doctor deleted!"})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const updateDoctor=async(req,res)=>{
    try{
        const {id, fees, address, available, about, name} = req.body
        const imageFile = req.file

        const existingDoctor = await Doctor.findById(id)

        let imageUrl
        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type: "image"})
            imageUrl = imageUpload.secure_url
        }

        if(existingDoctor){
            existingDoctor.fees = fees || existingDoctor.fees
            existingDoctor.address = JSON.parse(address) || existingDoctor.address
            existingDoctor.available = available || existingDoctor.available
            existingDoctor.about = about || existingDoctor.about
            existingDoctor.name = name || existingDoctor.name
            existingDoctor.image = imageUrl || existingDoctor.image
        }

        await existingDoctor.save()

        return res.status(200).json({message: "Profile Updated"})
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
    register,
    addDoctor,
    changeAwailability,
    getAllApointment,
    cancelAppointment,
    getDashboardData,
    updateDoctor,
    removeDoctor
}