const jsonwebtoken = require("jsonwebtoken");

function verifyJWT(tokenJWT) {
  return jsonwebtoken.verify(tokenJWT, process.env.JWT_KEY);
}

function res_createSendCookieJWT(res, user, statusCode = 200) {
  const tokenJWT = jsonwebtoken.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRATION });

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 60 * 60 * 1000), // 60 minutter (JWT_C_EX = 1spo)
    httpOnly: true,
  };

  if (process.env.NODE_ENV.trim() === "production") cookieOptions.secure = true;

  res.cookie("jwt", tokenJWT, cookieOptions);
  res.status(statusCode).send({
    status: "success",
    data: { user },
  });
}

module.exports = { verifyJWT, res_createSendCookieJWT };
