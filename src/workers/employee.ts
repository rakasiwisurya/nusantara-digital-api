import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

import { Worker } from "bullmq";
import csv from "csv-parser";
import fs from "fs";
import { notify } from "../controllers/notification";
import { prisma } from "../db/prisma";
import { redis } from "../libs/redis";

new Worker(
  "employee",
  async (job) => {
    console.info("Employee worker running...");

    if (job.name === "created") {
      notify({ message: "Employee created", id: job.data.employeeId });
      return;
    }

    if (job.name === "import-csv") {
      return new Promise((resolve, reject) => {
        const batchSize = 500;
        let batch: any[] = [];
        let count = 0;

        const stream = fs.createReadStream(job.data.path).pipe(csv());

        stream.on("data", (row) => {
          batch.push({
            name: row.name,
            age: Number(row.age),
            position: row.position,
            salary: Number(row.salary),
          });

          if (batch.length === batchSize) {
            stream.pause();

            prisma.employee
              .createMany({ data: batch })
              .then(() => {
                count += batch.length;
                batch = [];
                return redis.set(`import:${job.id}`, count);
              })
              .then(() => {
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
              count += batch.length;
            }

            await redis.set(`import:${job.id}`, count);
            notify({ message: "CSV import completed" });

            resolve(true);
          } catch (err) {
            reject(err);
          }
        });

        stream.on("error", reject);
      });
    }
  },
  { connection: redis }
);
