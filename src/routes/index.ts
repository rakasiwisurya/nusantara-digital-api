import { Router } from "express";
import { auth } from "../middlewares/auth";
import authRouter from "./auth";
import employeeRouter from "./employee";

const router = Router();

router.use("/", authRouter);
router.use("/employees", auth, employeeRouter);

export default router;
