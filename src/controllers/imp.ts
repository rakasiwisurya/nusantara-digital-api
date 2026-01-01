import { Request, Response } from "express";
import { responseSuccess } from "../libs/response";
import { employeeQueue } from "../queues/employee";
import { redis } from "../libs/redis";

export const importCSV = async (req: Request, res: Response) => {
  const job = await employeeQueue.add("import-csv", {
    path: req.file?.path,
  });

  responseSuccess(res, "Success import CSV", {
    jobId: job.id,
  });
};

export const streamImportProgress = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const interval = setInterval(async () => {
    const processed = await redis.get(`import:${jobId}`);
    const status = await redis.get(`import:${jobId}:status`);

    if (!processed) return;

    res.write(
      `data: ${JSON.stringify({
        processed: Number(processed),
        status: status ?? "processing",
      })}\n\n`
    );

    if (status === "completed") {
      clearInterval(interval);
      res.end();
    }
  }, 500);

  req.on("close", () => clearInterval(interval));
};
