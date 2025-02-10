import express from "express";
import { IncidentController } from "../controllers/incident.controller";
import { authentication } from "../middlewares/auth.middleware";

export const incidentRouter = express.Router();
incidentRouter.use(authentication);

incidentRouter.post("", IncidentController.create);
incidentRouter.get("", IncidentController.getAll);
incidentRouter.get("/:id", IncidentController.getById);
incidentRouter.put("/:id", IncidentController.update);
incidentRouter.delete("/:id", IncidentController.delete);

