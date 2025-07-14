const mongoose = require("mongoose")

const schema = mongoose.Schema({
    speciality: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
},
{timestamps: true}
)

module.exports = mongoose.models.Speciality || mongoose.model("Speciality", schema)