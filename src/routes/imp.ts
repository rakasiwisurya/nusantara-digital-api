import { Router } from "express";
import { importCSV, streamImportProgress } from "../controllers/imp";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/file";

const impRouter = Router();

impRouter.post("/", auth, upload("file"), importCSV);
impRouter.get("/:jobId/stream", streamImportProgress);

export default impRouter;
