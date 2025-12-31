import { Queue } from "bullmq";
import { redis } from "../libs/redis";

export const employeeQueue = new Queue("employee", {
  connection: redis,
});
