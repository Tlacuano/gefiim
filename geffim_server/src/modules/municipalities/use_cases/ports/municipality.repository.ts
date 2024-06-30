import { Municipality } from "../../model/municipality";

export interface MunicipalityRepository {
    getMunicipalitiesByStateId(payload: number): Promise<Municipality[]>;
}