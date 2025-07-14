const generateToken = require("../utils/generate");

exports.googleCallback = (req, res) => {
  const token = generateToken(req.user);
  res.cookie(
      'temp_auth_token', 
      token,
      {
          sameSite: 'Lax', httpOnly: false, secure: false, maxAge: 1000 * 60 * 60 * 24 * 7,
      }
  )
  res.redirect(`http://localhost:5173?token=${token}`);
};
