const JWT = require("jsonwebtoken");

exports.Authentication = (req, res, next) => {
  try {
    let token =req.headers["x-api-key"]
    JWT.verify(token, 'quickalpha', (err, payload) => {
        if (err) return res.status(401)
        .send({ status: false, message: 'Authentication Failed!', Error: err.message });
      
        req.UserId = payload.UserId;
        next();
    });

  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
};
