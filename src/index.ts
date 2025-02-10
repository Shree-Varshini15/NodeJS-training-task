import "reflect-metadata";
import express from "express";
import { createServer } from "http";

import { AppDataSource } from "./data-source";
import { Request, Response } from "express";

import { errorHandler } from "./middlewares/error.middleware"
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";
import { incidentRouter } from "./routes/incident.routes";
import { notificationWorker } from "./config/worker";

import socketServer from "./socket/socket";
import { setupCronJobs } from "./cron-jobs/cron";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/incident", incidentRouter);

app.use(errorHandler);

app.get("*", (_req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

const startServer = async () => {
  const { PORT = 3000 } = process.env;
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    httpServer.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });

    notificationWorker();
    setupCronJobs();
    
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
};

if (process.env.NODE_ENV !== "test") startServer();

const ioSocket = socketServer(httpServer);

export { httpServer, ioSocket };

// import sgMail from '@sendgrid/mail';

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const msg = {
//   to: 'rpshreevarshini@gmail.com', // Change to your recipient
//   from: 'rpshreevarshini@gmail.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

