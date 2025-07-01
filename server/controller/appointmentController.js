const User = require("../models/User")
const Doctor = require("../models/Doctor")
const Appointment = require("../models/Appointment")

const getUserAppointment=async(req,res)=>{
    try{
        const {id} = req.user // from auth middleware
        const appointments = await Appointment.find({ userId: id }).populate('userId', '-password').populate('docId', '-password');
        return res.status(200).json({appointments})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const bookApponitment=async(req,res)=>{
    try{
        const {userId, docId, slotDate, slotTime} = req.body

        const docData = await Doctor.findById(docId).select("-password")
        if(!docData?.available) {
            return res.status(400).json({message: "Doctor is not available"})
        }

        let slots_booked = docData?.slots_booked

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.status(400).json({message: "Slot not available" })
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await User.findById(userId).select("-password");

        delete docData?.slots_booked;

        const appointmentData = {
            userId,
            docId,
            slotDate,
            slotTime,
            userData,
            amount: docData?.fees,
            date: Date.now(),
        }

        const newAppointment = new Appointment(appointmentData);
        await newAppointment.save();

        await Doctor.findByIdAndUpdate(docId, {slots_booked})

        return res.status(200).json({message: "Appointment Booked"})
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

// middleware required
const cancelAppointment=async(req,res)=>{
    try{
        const {appointmentId} = req.body
        const {id} = req.user

        const appointmentdata = await Appointment.findById(appointmentId)

        if(appointmentdata.userId.toString() !== id){
            return res.status(401).json({message: "Unauthorized action"})
        }

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

module.exports = {
    getUserAppointment,
    bookApponitment,
    cancelAppointment
}