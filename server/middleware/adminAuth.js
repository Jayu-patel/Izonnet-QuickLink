const Jwt = require("jsonwebtoken")

const adminAuth=async(req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]

        const decode = Jwt.verify(token, process.env.ADMIN_JWT_SECRET)
        if(decode){
            req.admin =  decode
            next()
        }
        else{
            res.status(400).json({message: "Invalid or expired token"})
        }
    }
    catch(err){
        res.status(500).json({message: "Invalid or expired token"})
    }
}

module.exports = {
    adminAuth
}