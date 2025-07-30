const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Doctor = require('../models/Doctor')
const Appointment = require('../models/Appointment')
const otpGenerator = require("otp-generator")
const Otp = require('../models/Otp')
const cloudinary = require('cloudinary').v2
const sendEmail = require('../utils/mailer')

const login=async(req,res)=>{
    try{
        const {email, password} = req.body
        
        const doctor = await Doctor.findOne({email})
        if(!doctor){
            return res.status(404).json({message: "Invalid Credentials"})
        }
        const isMatch = await bcrypt.compare(password, doctor.password)
        if(isMatch){
            const token = jwt.sign({id: doctor._id}, process.env.DOCTOR_JWT_SECRET)

            res.cookie("doctorToken", token, {
                sameSite: "Lax", httpOnly: true, secure: false, maxAge: 60 * 60 * 24 * 7,
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

const getAllDoctorsData=async(req,res)=>{
    try{
        const doctors = await Doctor.find({}).select("-password")

        if(!doctors || doctors.length === 0){
            return res.status(404).json({message: "No doctors found"})
        }
        else{
            return res.status(200).json({doctors})
        }
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const getDoctorsAppointment=async(req,res)=>{
    try{
        const {id} = req.doctor
        const allAppointments = await Appointment.find({docId: id}).populate('userId', '-password').populate('docId', '-password');
        return res.status(200).json({appointments: allAppointments})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const appointmentComplete=async(req,res)=>{
    try{
        const {appointmentId} = req.body
        const {id} = req.doctor

        const appointmentData = await Appointment.findById(appointmentId)
        if(appointmentData && appointmentData.docId.toString() === id){
            await Appointment.findByIdAndUpdate(appointmentId, {isCompleted: true})
            return res.status(200).json({message: "Appoinment Completed"})
        }
        else{
            return res.status(400).json({message: "Mark Failed"})
        }
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const appointmentCancel=async(req,res)=>{
    try{
        const {appointmentId} = req.body
        const {id} = req.doctor

        const appointmentData = await Appointment.findById(appointmentId)
        if(appointmentData && appointmentData.docId.toString() === id){
            await Appointment.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.status(200).json({message: "Appoinment Cancelled"})
        }
        else{
            return res.status(400).json({message: "Cancellation Failed"})
        }
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const dashboard=async(req,res)=>{
    try{
        const {id} = req.doctor

        const appointment = await Appointment.find({docId: id}).populate('userId', '-password').populate('docId', '-password');
        let earning = 0
        appointment.map((item)=>{
            if (item.isCompleted || item.payment){
                earning += item.amount;
            }
        })

        let patients = []
        appointment.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData = {
            earning,
            appointments: appointment.length,
            patients: patients.length,
            latestAppointments: appointment.reverse().slice(0,5)
        }

        return res.status(200).json({dashData})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const doctorProfile=async(req,res)=>{
    try{
        const {id} = req.doctor
        const profileData = await Doctor.findById(id).select('-password')
        return res.status(200).json({profileData})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const updateProfile=async(req,res)=>{
    try{
        const {fees, address, available, about, name} = req.body
        const {id} = req.doctor
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

const generateOtp=async(req,res)=>{
    try{
        const {email} = req.params

        const doctorExists = await Doctor.findOne({email})
        if(!doctorExists){
            return res.status(404).json({message: "Doctor does not exists!"})
        }

        const otp =  otpGenerator.generate(6,{
            lowerCaseAlphabets: false, 
            upperCaseAlphabets: false, 
            specialChars: false
        })

        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        await sendEmail(email, "OTP", `Dear ${doctorExists.name}, \nYour Otp for password recovery is ${otp}`);
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

        const token = jwt.sign({ email }, process.env.DOCTOR_JWT_SECRET, { expiresIn: '10m' });

        return res.status(200).json({ message: 'OTP verified', token });
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const resetPassword=async(req,res)=>{
    try{
        const {token, newPassword} = req.body

        const decoded = jwt.verify(token, process.env.DOCTOR_JWT_SECRET)
        if(!decoded){
            return res.status(400).json({message: "session token expired"})
        }
        const email = decoded.email;

        const doctor = await Doctor.findOne({ email });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        doctor.password = await bcrypt.hash(newPassword, 10);
        await doctor.save();

        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

module.exports = {
    login,
    getAllDoctorsData,
    getDoctorsAppointment,
    appointmentComplete,
    appointmentCancel,
    dashboard,
    doctorProfile,
    updateProfile,
    generateOtp,
    verifyOtp,
    resetPassword,
}