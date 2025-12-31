import { Request, Response } from "express";

const clients: any[] = [];

export const notificationStream = (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  clients.push(res);

  req.on("close", () => {
    clients.splice(clients.indexOf(res), 1);
  });
};

export function notify(data: any) {
  clients.forEach((res) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}
