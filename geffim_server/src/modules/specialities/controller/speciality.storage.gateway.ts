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

    // para registrar y actualizar especialidades
    async getSpecialityById(payload: number) {
        try {
            const response = await queryDB<Speciality[]>("SELECT * FROM specialities WHERE id_speciality = ?", [payload]);
            return response[0];
        } catch (error) {
            throw(error)
        }
    }

    async getSpecialityByName(payload: string) {
        try {
            const response = await queryDB<Speciality[]>("SELECT * FROM specialities WHERE name = ?", [payload]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async getSpecialityByAcronym(payload: string) {
        try {
            const response = await queryDB<Speciality[]>("SELECT * FROM specialities WHERE acronym = ?", [payload]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async registerSpeciality(payload: Speciality) {
        try {
            const response = await queryDB('INSERT INTO specialities (name, acronym) VALUES (?, ?)', [payload.name, payload.acronym]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async updateSpeciality(payload: Speciality) {
        try {
            const response = await queryDB('UPDATE specialities SET name = ?, acronym = ? WHERE id_speciality = ?', [payload.name, payload.acronym, payload.id_speciality]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async updateSpecialityStatus(payload: { id_speciality: number, status: boolean }) {
        try {
            const response = await queryDB('UPDATE specialities SET status = ? WHERE id_speciality = ?', [payload.status, payload.id_speciality]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async getSpecialitiesActive(payload: void) {
        try {
            const response = await queryDB<Speciality[]>("SELECT * FROM specialities WHERE status = 1");
            return response;
        } catch (error) {
            throw(error)
        }
    }

}