import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config";
import routes from "./routes";
import { logger } from "./middleware/logger";
import { genericErrorHandler, notFoundError } from "./middleware/errorHandler";
import multer from "multer";

const app = express();

app.use('/src/uploads', express.static('src/uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(logger);

app.use(routes);

app.use(genericErrorHandler);

app.use(notFoundError);

console.log(`Server listening on port: ${config.serverPort}`);

app.listen(config.serverPort);
