const express = require("express")
const router = express.Router()

const userController = require("../controller/userControllers")
const upload = require("../middleware/multer")
const userAuth = require("../middleware/userAuth").userAuth

router.get("/get_user/:id", userAuth, userController.getUserById)
router.get("/generate-otp/:email", userController.getOtp)

router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/verify", userController.verifyOtp)

router.put("/update/:id", upload.single('image'), userAuth, userController.updateProfile)
router.put("/reset-password", userController.resetPassword)

module.exports = router