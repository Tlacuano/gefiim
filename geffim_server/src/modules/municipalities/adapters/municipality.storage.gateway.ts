import { Municipality } from "../model/municipality";
import { MunicipalityRepository } from "../use_cases/ports/municipality.repository";
import { queryDB } from "../../../utils/data_base/db_connection";

export class MunicipalityStorageGateway implements MunicipalityRepository{
    async getMunicipalitiesByStateId(payload: number): Promise<Municipality[]> {
        try {
            const response = await queryDB<Municipality[]>(`SELECT * FROM municipalities WHERE id_state = ?`, [payload]);
            return response;
        } catch (error) {
            throw(error)
        }
    }
}