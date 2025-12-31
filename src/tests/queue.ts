import { employeeQueue } from "../queues/employee";

describe("Queue Test", () => {
  it("should add job to queue", async () => {
    const job = await employeeQueue.add(
      "test-job",
      {
        message: "testing queue...",
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    );

    expect(job.id).toBeDefined();
  });
});
