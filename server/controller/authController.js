const generateToken = require("../utils/generate");

exports.googleCallback = (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`${process.env.FRONTEND_USER_URL}?token=${token}`);
};
