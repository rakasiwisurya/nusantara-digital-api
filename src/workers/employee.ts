import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

import { Worker } from "bullmq";
import csv from "csv-parser";
import fs from "fs";
import { prisma } from "../db/prisma";
import { redis } from "../libs/redis";

const BATCH_SIZE = 500;

new Worker(
  "employee",
  async (job) => {
    console.info(`[WORKER] Job started: ${job.name} (${job.id})`);

    if (job.name === "created") {
      console.info(
        `[WORKER] Job employee created (${job.data.employeeId} rows)`
      );
    }

    if (job.name === "import-csv") {
      const filePath = job.data.path;

      if (!filePath || !fs.existsSync(filePath)) {
        throw new Error("CSV file not found");
      }

      return new Promise<void>((resolve, reject) => {
        let batch: any[] = [];
        let processed = 0;

        const stream = fs.createReadStream(filePath).pipe(csv());

        stream.on("data", (row) => {
          batch.push({
            name: row.name,
            age: Number(row.age),
            position: row.position,
            salary: Number(row.salary),
          });

          if (batch.length === BATCH_SIZE) {
            stream.pause();

            prisma.employee
              .createMany({ data: batch })
              .then(async () => {
                processed += batch.length;
                batch = [];

                await redis.set(`import:${job.id}`, processed);
                await redis.set(`import:${job.id}:status`, "processing");

                stream.resume();
              })
              .catch((err) => {
                stream.destroy();
                reject(err);
              });
          }
        });

        stream.on("end", async () => {
          try {
            if (batch.length > 0) {
              await prisma.employee.createMany({ data: batch });
              processed += batch.length;
            }

            await redis.set(`import:${job.id}`, processed);
            await redis.set(`import:${job.id}:status`, "completed");

            console.info(`[WORKER] CSV import completed (${processed} rows)`);

            resolve();
          } catch (err) {
            reject(err);
          }
        });

        stream.on("error", (err) => {
          reject(err);
        });
      });
    }
  },
  {
    connection: redis,
    concurrency: 1,
  }
);

console.info("[WORKER] Employee worker initialized");
