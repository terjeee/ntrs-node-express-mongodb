const ModelUser = require("../models/ModelUser");
const { deleteDocument, patchDocument, getDocument } = require("../handlers/factoryHandler");

exports.getAllUsers = async (request, response, next) => {
  try {
    const users = await ModelUser.find();

    response.status(200).send({
      status: "success",
      data: users,
    });
  } catch (error) {
    response.status(400).send({
      status: "error",
      message: "Something wrong",
    });
  }
};

exports.getMe = function (req, res, next) {
  req.params.id = req.user._id;
  next();
};

exports.getUser = getDocument(ModelUser);
exports.patchUser = patchDocument(ModelUser);
exports.deleteUser = deleteDocument(ModelUser);
