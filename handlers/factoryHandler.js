const AppError = require("../utils/AppError");

const getDocument = (Model, populateOptions) => async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = populateOptions ? Model.findById(id).populate(populateOptions) : Model.findById(id);
    const document = await query;

    if (!document) return next(new AppError("No document found with that ID", 404));

    res.status(200).send({
      status: "success",
      results: document.length,
      data: document,
    });
  } catch (error) {
    res.status(404).send({
      status: "fail",
      error: error,
    });
  }
};

const createDocument = (Model) => async (req, res) => {
  try {
    const document = await Model.create(req.body);

    res.status(200).send({
      status: "success",
      results: document.length,
      data: document,
    });
  } catch (error) {
    res.status(404).send({
      status: "fail",
      error: error,
    });
  }
};

const patchDocument = (Model) => async (request, response, next) => {
  try {
    const document = await Model.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });

    if (document.length === 0) return next(new AppError("No tour found with that ID", 404));

    response.status(200).send({
      status: "success",
      results: document.length,
      data: document,
    });
  } catch (error) {
    response.status(404).send({
      status: "fail",
      message: error,
    });
  }
};

const deleteDocument = (Model) => async (request, response, next) => {
  try {
    console.log(request.params);
    const document = await Model.findByIdAndDelete(request.params.id);

    if (!document) return next(new AppError("No document with that ID", 404));

    response.status(200).send({
      status: "success",
      results: document.length,
      data: document,
    });
  } catch (error) {
    response.status(404).send({
      status: "fail",
      message: error,
    });
  }
};

module.exports = { getDocument, createDocument, patchDocument, deleteDocument };
