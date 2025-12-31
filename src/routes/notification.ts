import { Router } from "express";
import { notificationStream } from "../controllers/notification";

const notificationRouter = Router();

notificationRouter.get("/stream", notificationStream);

export default notificationRouter;
