const express = require("express")
const router = express.Router()
const {addSpeciality, getAllSpecialities, removeSpeciality, updateSpeciality} = require('../controller/specialityController')

const upload = require("../middleware/multer")

router.get("/get-all-specialities", getAllSpecialities)

router.post("/add-speciality", upload.single('image'), addSpeciality)

router.delete("/remove-speciality/:id", removeSpeciality)

router.put("/update-speciality", upload.single('image'), updateSpeciality)

module.exports = router