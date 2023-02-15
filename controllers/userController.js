const ModelUser = require("../models/ModelUser");

async function getAllUsers(request, response, next) {
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
}

function getUserById(request, response) {
  response.status(500).json({
    status: "error",
    message: "route not built",
  });
}

function createUser(request, response) {
  response.status(500).json({
    status: "error",
    message: "route not built",
  });
}

function updateUser(request, response) {
  response.status(500).json({
    status: "error",
    message: "route not built",
  });
}

function deleteUser(request, response) {
  response.status(500).json({
    status: "error",
    message: "route not built",
  });
}

// -- //
// -- //

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
