import { Router } from "express";
import { auth } from "../middlewares/auth";
import authRouter from "./auth";
import employeeRouter from "./employee";
import impRouter from "./imp";
import notificationRouter from "./notification";

const router = Router();

router.use("/", authRouter);
router.use("/employees", auth, employeeRouter);
router.use("/imports", auth, impRouter);
router.use("/notifications", notificationRouter);

export default router;
