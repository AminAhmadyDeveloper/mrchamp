import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import { errorHandler } from "../handlers/error-handler";
import { addRecoursesController } from "../controllers/add-recourses-controller";

export const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(morgan("dev"));

expressApp.use("/", addRecoursesController);
expressApp.use(errorHandler);
