import { Router } from "express";
import { auth } from "../middlewares/auth";
import authRouter from "./auth";
import employeeRouter from "./employee";
import impRouter from "./imp";

const router = Router();

router.use("/", authRouter);
router.use("/employees", auth, employeeRouter);
router.use("/imports", impRouter);

export default router;
