const express = require("express")
const router = express.Router()

const controller = require("../controller/appointmentController")
const userAuth = require("../middleware/userAuth").userAuth

router.get("/get_user_appointment", userAuth, controller.getUserAppointment)

router.post("/book_appointment", userAuth, controller.bookApponitment)
router.post("/cancel_appointment", userAuth, controller.cancelAppointment)

module.exports = router