const jsonwebtoken = require("jsonwebtoken");

function res_createSendCookieJWT(res, user, statusCode = 200) {
  const tokenJWT = jsonwebtoken.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRATION });

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 5 * 60 * 1000), // 5 minuteer
    httpOnly: true,
  };

  if (process.env.NODE_ENV.trim() === "production") cookieOptions.secure = true;

  res.cookie("jwt", tokenJWT, cookieOptions);
  res.status(statusCode).send({
    status: "success",
    token: tokenJWT,
    data: { user },
  });
}

module.exports = { res_createSendCookieJWT };
