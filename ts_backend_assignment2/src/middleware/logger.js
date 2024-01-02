const { createLogger } = require("../utils/logger");

const logger = createLogger("Logger");

const loggerMiddleware = async (req, res, next) => {
  logger.info(`${req.method}: ${req.path}`);
  next();
};

module.exports = loggerMiddleware;