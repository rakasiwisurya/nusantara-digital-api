import { Request, Response } from "express";
import { responseSuccess } from "../libs/response";
import { employeeQueue } from "../queues/employee";

export const importCSV = async (req: Request, res: Response) => {
  const job = await employeeQueue.add("import-csv", {
    path: req.file?.path,
  });

  responseSuccess(res, "Success import CSV", {
    jobId: job.id,
  });
};
