const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
},
    {timestamps: true}
)

module.exports =  mongoose.models.Message || mongoose.model("Message", schema)