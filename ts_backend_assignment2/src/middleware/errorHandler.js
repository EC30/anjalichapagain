const HttpStatus = require("http-status-codes");
const UnauthenticatedError = require("../error/unauthenticatedError");
const BadRequestError = require("../error/badRequestError");
const notfoundError = require("../error/notfoundError");
const internalServerError = require("../error/internalServerError");

function genericErrorHandler(err, _req, res, _next) {
  if (err instanceof BadRequestError) {
    return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: err.message });
  }

  if (err instanceof UnauthenticatedError) {
    return res.status(HttpStatus.StatusCodes.UNAUTHORIZED).json({ message: err.message });
  }
  if (err instanceof notfoundError) {
    return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: err.message });
  }

  if (err instanceof internalServerError) {
    return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }

  return res
    .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
}

// module.exports = genericErrorHandler;
module.exports = { genericErrorHandler };


