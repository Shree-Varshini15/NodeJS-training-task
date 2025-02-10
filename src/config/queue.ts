import { Queue } from "bullmq";
import { redisConnection } from "./redis-connection";

export const notificationQueue = new Queue('notification', { connection: redisConnection });