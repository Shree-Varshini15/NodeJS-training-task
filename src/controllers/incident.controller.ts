import { Request, Response } from "express";
import { IncidentService } from "../services/incident.service";
import { notificationQueue } from "../config/queue";

export class IncidentController {
  static async create(req: Request, res: Response) {
    const incidentData = req.body.incident;
    const incidentService = new IncidentService();
    try {
      const newIncident = await incidentService.createIncident(incidentData, req.body.incident_type_id);
      const jobId = await notificationQueue.add('send-notification', {
        type: 'newIncident',
        sender_id: req['currentUser'].id,
        newIncident
      });
      return res.status(201).json(newIncident);
    } catch (err) {
      return res.status(422).json({ message: err.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const incidentService = new IncidentService();
      const incidents = await incidentService.getAllIncidents();
      return res.status(200).json(incidents);
    } catch (err) {
      return res.status(422).json({ message: err.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const incidentService = new IncidentService();
      const incident = await incidentService.getIncidentById(id);
      return res.status(200).json(incident);
    } catch (err) {
      return res.status(422).json({ message: err.message });
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updatedData = req.body.incident;
    const updateIncidentTypeId = req.body.incident_type_id;

    try {
      const incidentService = new IncidentService();
      const updatedIncident = await incidentService.updateIncident(id, updatedData, updateIncidentTypeId);
      return res.status(200).json(updatedIncident);
    } catch (err) {
      return res.status(422).json({ message: err.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const incidentService = new IncidentService();
      await incidentService.deleteIncident(id);
      return res.sendStatus(204)
    } catch (err) {
      return res.status(422).json({ message: err.message });
    }
  }
}