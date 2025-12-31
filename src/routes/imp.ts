import { Router } from "express";
import { importCSV } from "../controllers/imp";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/file";

const impRouter = Router();

impRouter.post("/", auth, upload("file"), importCSV);

export default impRouter;
