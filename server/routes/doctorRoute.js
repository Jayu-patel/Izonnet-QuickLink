const express = require("express")
const router = express.Router()

const controller = require("../controller/doctorController")
const doctorAuth = require("../middleware/doctorAuth").doctorAuth

router.get("/getAllDoctors", controller.getAllDoctorsData)
router.get("/getDoctorsAppointment", doctorAuth, controller.getDoctorsAppointment)
router.get("/dashboard", doctorAuth, controller.dashboard)
router.get("/profile", doctorAuth, controller.doctorProfile)

router.post("/login", controller.login)
router.post("/complete-appointment", doctorAuth, controller.appointmentComplete)
router.post("/cancel-appointment", doctorAuth, controller.appointmentCancel)

router.put("/update-profile", doctorAuth, controller.updateProfile)

module.exports = router