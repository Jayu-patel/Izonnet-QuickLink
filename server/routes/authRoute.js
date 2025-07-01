const express = require("express");
const passport = require("passport");
const { googleCallback } = require("../controller/authController");

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);

module.exports = router;
