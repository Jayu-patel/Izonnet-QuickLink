const express = require("express")
const router = express.Router()

const controller = require("../controller/adminController")
const upload = require("../middleware/multer")
const adminAuth = require("../middleware/adminAuth").adminAuth

router.get("/getAllApointments", controller.getAllApointment)
router.get("/getDashboardData", adminAuth, controller.getDashboardData)

router.post("/login", controller.login)
router.post("/addDoctor", upload.single('image'), controller.addDoctor)
router.post("/cancel_appointment", adminAuth, controller.cancelAppointment)

router.put("/changeAvailablity", controller.changeAwailability)

module.exports = router