const express = require("express")
const router = express.Router()

const controller = require("../controller/adminController")
const upload = require("../middleware/multer")
const adminAuth = require("../middleware/adminAuth").adminAuth

router.get("/getAllApointments", controller.getAllApointment)
router.get("/getDashboardData", adminAuth, controller.getDashboardData)

router.post("/login", controller.login)
router.post("/register", controller.register)
router.post("/addDoctor", upload.single('image'), controller.addDoctor)
router.post("/cancel_appointment", adminAuth, controller.cancelAppointment)

router.put("/changeAvailablity", controller.changeAwailability)
router.put("/update-doctor", upload.single('image'), adminAuth, controller.updateDoctor)

router.delete("/remove-doctor/:id", adminAuth, controller.removeDoctor)

module.exports = router