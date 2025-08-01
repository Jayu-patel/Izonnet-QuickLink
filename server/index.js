const express = require("express")
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const passport = require("passport");
const dotenv = require('dotenv')
dotenv.config()
const connectCloudinary = require("./utils/cloudinary")
require("./config/passport");

const userRoutes = require("./routes/userRoutes")
const appointmentRoutes = require("./routes/appointmentRoute")
const adminRoutes = require("./routes/adminRoute")
const doctorRoutes = require("./routes/doctorRoute")
const authRoutes = require("./routes/authRoute")
const paymentRoutes = require("./routes/paymentRoute")
const specialityRoutes = require("./routes/specialityRoute")

connectCloudinary()
const app = express()

const allowedOrigin = [
  process.env.FRONTEND_USER_URL,
  process.env.FRONTEND_ADMIN_URL
]

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.OAUTH_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

connectDB()

app.get("/", (req, res)=>{
    res.send("Api is working fine!!")
})

app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/appointment", appointmentRoutes)
app.use("/api/doctor", doctorRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/speciality", specialityRoutes)
app.use("/auth", authRoutes)

const port = process.env.PORT || 8000
app.listen(port, ()=>{
    console.log("server is running on port 8000")
})