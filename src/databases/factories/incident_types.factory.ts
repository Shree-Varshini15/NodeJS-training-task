import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { IncidentType } from "../entity/IncidentType";

export const IncidentTypesFactory = setSeederFactory(IncidentType, (faker: Faker) => {
  const incidentType = new IncidentType();
  incidentType.name = faker.internet.domainName();

  return incidentType;
})