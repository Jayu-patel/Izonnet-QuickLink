const Speciality = require('../models/Speciality');
const cloudinary = require('cloudinary').v2

const getAllSpecialities = async(req, res) => {
    try{
        const specialities = await Speciality.find({});
        if(specialities.length === 0){
            return res.status(404).json({message: "No specialities found"});
        }

        return res.status(200).json({specialities});
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const addSpeciality = async(req, res) => {
    try{
        const {speciality} = req.body
        const image = req.file

        if(!speciality || !image){
            return res.status(400).json({message: "Speciality and image are required"});
        }

        let imageUrl
        if(image){
            const imageUpload = await cloudinary.uploader.upload(image.path,{resource_type: "image"})
            imageUrl = imageUpload.secure_url
        }

        const newSpeciality = new Speciality({
            speciality,
            image: imageUrl
        });

        await newSpeciality.save();

        return res.status(200).json({message: "Speciality added successfully", speciality: newSpeciality});
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const removeSpeciality = async(req, res) => {
    try{
        const {id} = req.params
        const specialityRemoved = await Speciality.findByIdAndDelete(id);

        if(!specialityRemoved){
            return res.status(404).json({message: "Speciality not found"});
        }

        return res.status(200).json({message: "Speciality removed successfully"});
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const updateSpeciality = async(req, res) => {
    try{
        const {speciality,id} = req.body
        const image = req.file

        const existingSpeciality = await Speciality.findById(id);
        if(!existingSpeciality){    
            return res.status(404).json({message: "Speciality not found"});
        }

        let imageUrl
        if(image){
            const imageUpload = await cloudinary.uploader.upload(image.path,{resource_type: "image"})
            imageUrl = imageUpload.secure_url
        }

        existingSpeciality.speciality = speciality || existingSpeciality.speciality;
        existingSpeciality.image = imageUrl || existingSpeciality.image;

        await existingSpeciality.save();

        return res.status(200).json({message: "Speciality updated successfully", speciality: existingSpeciality});
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

module.exports = {
    getAllSpecialities,
    addSpeciality,
    removeSpeciality,
    updateSpeciality
}
