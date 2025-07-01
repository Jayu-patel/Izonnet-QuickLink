const generateToken = require("../utils/generate");

exports.googleCallback = (req, res) => {
  const token = generateToken(req.user);
  console.log(req.user)
  res.redirect(`http://localhost:5173?token=${token}`);
};
