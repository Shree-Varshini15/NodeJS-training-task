import { Repository } from "typeorm";
import { Incident } from "../databases/entity/Incident";
import { IncidentType } from "../databases/entity/IncidentType";
import { AppDataSource } from "../data-source";

export class IncidentService {
  private incidentRepository: Repository<Incident>;
  private incidentTypeRepository: Repository<IncidentType>;

  constructor() {
    this.incidentRepository = AppDataSource.getRepository(Incident);
    this.incidentTypeRepository = AppDataSource.getRepository(IncidentType);
  }

  async createIncident(incidentData: Partial<Incident>, incident_type_id: string): Promise<Incident | null> {
    const incidentType = await this.incidentTypeRepository.findOne({where: {  id: incident_type_id } });

    if (!incident_type_id || !incidentType) throw new Error("Incident type not found");

    const newIncident = this.incidentRepository.create({
      ...incidentData,
      incidentType
    });

    return await this.incidentRepository.save(newIncident);
  }

  async getAllIncidents(): Promise<Incident[]> {
    return await this.incidentRepository.find({relations: ["incidentType"]});
  }

  async getIncidentById(incidentId: string): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({ where: { id: incidentId }, relations: ["incidentType"] });
    if (!incident) throw new Error("Incident not found");
    return incident;
  }

  async updateIncident(incidentId: string, updatedData: Partial<Incident>, updateIncidentTypeId?: string): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({ where: { id: incidentId } });
    if (!incident) throw new Error("Incident not found");

    if (updateIncidentTypeId) {
      const incidentType = await this.incidentTypeRepository.findOne({where: {  id: updateIncidentTypeId } });
      if (!updateIncidentTypeId) throw new Error("Incident type not found");
      incident.incidentType = incidentType;
    }

    Object.assign(incident, updatedData);
    return await this.incidentRepository.save(incident);
  }

  async deleteIncident(incidentId: string): Promise<void> {
    const incident = await this.incidentRepository.findOne({ where: { id: incidentId } });
    if (!incident) throw new Error("Incident not found");

    await this.incidentRepository.remove(incident);
  }
}