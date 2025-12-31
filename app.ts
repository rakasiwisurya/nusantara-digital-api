import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

dotenv.config();
dotenv.config({ path: ".env.local" });

import {
  responseInternalServerError,
  responseNotFound,
} from "./src/libs/response";
import router from "./src/routes";

const app: Express = express();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.ORIGIN_URL as string],
    credentials: true,
  })
);

if (process.env.NODE_ENV === "test") {
  app.use(router);
} else {
  app.use("/ems", router);
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use((req: Request, res: Response) => {
  responseNotFound(res, "Service Not Found");
});

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  responseInternalServerError(res, "Internal Server Error");
});

export default app;
