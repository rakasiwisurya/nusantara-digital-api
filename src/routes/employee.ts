import { Router } from "express";
import {
  addEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "../controllers/employee";

const employeeRouter = Router();

employeeRouter.post("/", addEmployee);
employeeRouter.get("/", getEmployees);
employeeRouter.get("/:id", getEmployee);
employeeRouter.put("/:id", updateEmployee);
employeeRouter.delete("/:id", deleteEmployee);

export default employeeRouter;
