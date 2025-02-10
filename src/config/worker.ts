import { Worker } from "bullmq";
import { redisConnection } from "./redis-connection";
import { NotificationRepository } from "../repositories/notification.repository";
import { getIO } from "../socket/socket";

export function notificationWorker() {
  const worker = new Worker(
    "notification",
    async job => {
      const notificationRepository = new NotificationRepository(getIO());
      await notificationRepository.createNotification(job.data.type, job.data.newIncident, job.data.sender_id);
    },
    { connection: redisConnection }
  );

  worker.on("completed", job => {
    console.log(`Job completed with result: ${job.returnvalue}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job failed with error: ${err.message}`);
  });

  console.log("Worker started!");
}
