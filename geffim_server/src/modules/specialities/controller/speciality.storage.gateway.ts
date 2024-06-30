import { queryDB } from "../../../utils/data_base/db_connection";
import { Speciality } from "../model/speciality";
import { filterSpecialityRequestDto } from "./dto/filter_speciality.request.dto";

export class SpecialityStorageGateway {
    async getTotalSpecialities(payload: void) {
        try {
            const response = await queryDB<{ total: number }[]>('SELECT COUNT(id_speciality) as total FROM specialities');
            const { total } = response[0];
            return total;
        } catch (error) {
            throw(error)
        }
    }

    async getSpecialitiesPaginated(payload: { limit: number, offset: number, filter : filterSpecialityRequestDto }) {
        try {
            payload.filter.value = '%' + payload.filter.value + '%';

            const response = await queryDB<Speciality[]>("SELECT * FROM specialities WHERE name like ? OR acronym like ? LIMIT ? OFFSET ? ", 
                [payload.filter.value, payload.filter.value, payload.limit, payload.offset]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

}