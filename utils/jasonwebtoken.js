const jsonwebtoken = require("jsonwebtoken");

function signJWT(id) {
  //  jwt.sign(objPAYLOAD, secretKey(from.env), objOPTIONS);
  return jsonwebtoken.sign({ id: id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRATION });
}

module.exports = { signJWT };
