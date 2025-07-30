const express = require("express")
const router = express.Router()

const upload = require("../middleware/multer")
const controller = require("../controller/doctorController")
const doctorAuth = require("../middleware/doctorAuth").doctorAuth

router.get("/getAllDoctors", controller.getAllDoctorsData)
router.get("/getDoctorsAppointment", doctorAuth, controller.getDoctorsAppointment)
router.get("/dashboard", doctorAuth, controller.dashboard)
router.get("/profile", doctorAuth, controller.doctorProfile)
router.get("/generate-otp/:email", controller.generateOtp)

router.post("/login", controller.login)
router.post("/complete-appointment", doctorAuth, controller.appointmentComplete)
router.post("/cancel-appointment", doctorAuth, controller.appointmentCancel)
router.post("/verify", controller.verifyOtp)

router.put("/update-profile", upload.single('image'), doctorAuth, controller.updateProfile)
router.put("/reset-password", controller.resetPassword)

module.exports = router