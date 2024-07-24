import { queryDB } from "../../../utils/data_base/db_connection";
import { Candidate } from "../model/candidates";
import { SalePeriod } from "../../../modules/sale_periods/model/sale_period";
import { InstitutionalInformation } from "../../../modules/institutional_information/model/institutional_information";
import { candidateToList } from "./dtos/request_to_generate_list.dto";
import { AddressDTO, CandidateDTO, SchoolDTO, specialitySelectedDTO, tutorDTO } from "./dtos/response_candidate_information.dto";


export class CandidatesStorageGateway {
    async findCandidateByPeriod(payload: { curp: string, id_period: number}) {
        try {
            const response = await queryDB<{candidate_count : number}[]>(`SELECT COUNT(*) AS candidate_count
                                                                            FROM candidates c
                                                                            JOIN selected_specialities ss ON c.id_candidate = ss.id_candidate
                                                                            JOIN speciality_by_period sbp ON ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                            JOIN sale_periods sp ON sbp.id_period = sp.id_period
                                                                            WHERE c.curp = ?
                                                                            AND sp.id_period = ?`, 
                [payload.curp, payload.id_period]);

            return response[0].candidate_count;
        } catch (error) {
            throw(error)
        }
    }

    async findTotalCandidatesByPeriodAndSpeciality(payload: { id_period: number, id_speciality: number}) {
        try {
            const response = await queryDB<{candidate_count : number}[]>(`SELECT COUNT(sbp.id_speciality_by_period) AS candidate_count
                                                                            FROM selected_specialities ss
                                                                            JOIN speciality_by_period sbp ON ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                            JOIN sale_periods sp ON sbp.id_period = sp.id_period
                                                                            WHERE sp.id_period = ?
                                                                            AND sbp.id_speciality = ?
                                                                            AND ss.herarchy = 1`, 
                [payload.id_period, payload.id_speciality]);
            return response[0].candidate_count;
        } catch (error) {
            throw(error)
        }
    }

    async getTokensAllowed (payload: { id_period: number, id_speciality: number }) {
        try {
            const response = await queryDB<{tokens_allowed: number}[]>(`SELECT tokens_allowed
                                                                        FROM speciality_by_period
                                                                        WHERE id_period = ?
                                                                        AND id_speciality = ?`, 
                [payload.id_period, payload.id_speciality]);
            return response[0].tokens_allowed;
        } catch (error) {
            throw(error)
        }
    }

    async getTotalTokens (payload: { id_period: number}) {
        try {
            const response = await queryDB<{total_tokens: number}[]>(`SELECT COUNT(ss.id_selected_speciality) AS total_tokens
                                                                        FROM selected_specialities ss
                                                                        JOIN speciality_by_period sbp ON ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                        WHERE sbp.id_period = ?
                                                                        AND ss.herarchy = 1;`, 
                [payload.id_period]);
            return response[0].total_tokens;
        } catch (error) {
            throw(error)
        }
    }

    async getSpecialitiesByPeriodAndSpeciality (payload: { id_period: number, id_speciality: number }) {
        try {
            const response = await queryDB<{id_speciality_by_period: number}[]>(`SELECT sbp.id_speciality_by_period
                                                                                FROM speciality_by_period sbp
                                                                                WHERE sbp.id_period = ?
                                                                                AND sbp.id_speciality = ?`, 
                [payload.id_period, payload.id_speciality]);
            return response[0].id_speciality_by_period;
        } catch (error) {
            throw(error)
        }
    }

    // registro de candidato
    async registerAddress(payload: {postal_code: string, id_municipality: number, neighborhood: string, street_and_number: string}) {
        try {
            const response = await queryDB<{insertId : number}>(`INSERT INTO addresses (postal_code, id_municipality, neighborhood, street_and_number) VALUES (?, ?, ?, ?)`, 
                [payload.postal_code, payload.id_municipality, payload.neighborhood, payload.street_and_number]);
            return response.insertId;
        } catch (error) {
            throw(error)
        }
    }

    async registerCandidate(payload: Candidate) {
        try {
            const response = await queryDB<{insertId : number}>(`INSERT INTO candidates (name, first_last_name, second_last_name, curp, birthdate, gender, email, id_birth_municipality, phone_number, secondary_phone_number, id_address, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [payload.name, payload.first_last_name, payload.second_last_name, payload.curp, payload.birthdate, payload.gender, payload.email, payload.id_birth_municipality, payload.phone_number, payload.secondary_phone_number, payload.candidate_id_address, payload.username, payload.password]);
            return response.insertId;
        } catch (error) {
            throw(error)
        }
    }

    async registerTutor(payload: Candidate) {
        try {
            const response = await queryDB<{insertId : number}>(`INSERT INTO tutors (name, first_last_name, second_last_name, phone_number, secondary_phone_number, live_separated, id_address, id_candidate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [payload.tutor_name, payload.tutor_first_last_name, payload.tutor_second_last_name, payload.tutor_phone_number, payload.tutor_secondary_phone_number, payload.tutor_live_separated, payload.tutor_id_address, payload.id_candidate]);
            return response.insertId;
        } catch (error) {
            throw(error)
        }
    }

    async registerHighschoolInformation(payload: Candidate) {
        try {
            const response = await queryDB<{insertId : number}>(`INSERT INTO highschool_information (school_key, school_type, school_name, id_municipality, average_grade, has_debts, scholarship_type, id_candidate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [payload.school_key, payload.school_type, payload.school_name, payload.school_id_municipality, payload.average_grade, payload.has_debts, payload.scholarship_type, payload.id_candidate]);
            return response.insertId;
        } catch (error) {
            throw(error)
        }
    }

    async registerSpecialitiesSelected(payload: {id_speciality_by_period: number, id_candidate: number, herarchy: number}) {
        try {
            const response = await queryDB<{insertId : number}>(`INSERT INTO selected_specialities (id_speciality_by_period, id_candidate, herarchy) VALUES (?, ?, ?)`,
                [payload.id_speciality_by_period, payload.id_candidate, payload.herarchy]);
            return response.insertId;
        } catch (error) {
            throw(error)
        }
    }

    // obtener los datos para la generación de ficha

    async getStateByMunicipality(payload: {id_municipality: number}) {
        try {
            const response = await queryDB<{name: string}[]>(`SELECT s.name FROM states s JOIN municipalities m ON s.id_state = m.id_state WHERE m.id_municipality = ?`,
                [payload.id_municipality]);
            return response[0].name;
        } catch (error) {
            throw(error)
        }
    }

    async getMunicipalityByMunicipality(payload: {id_municipality: number}) {
        try {
            const response = await queryDB<{name: string}[]>(`SELECT name FROM municipalities WHERE id_municipality = ?`,
                [payload.id_municipality]);
            return response[0].name;
        } catch (error) {
            throw(error)
        }
    }

    async getSalePeriod(payload: {id_period: number}) {
        try {
            const response = await queryDB<SalePeriod[]>(`SELECT * FROM sale_periods WHERE id_period = ?`,
                [payload.id_period]);
            return response[0];
        } catch (error) {
            throw(error)
        }
    }

    async getInstitutionalInformation() {
        try {
            const response = await queryDB<InstitutionalInformation[]>("SELECT * FROM institutional_information");
            return response[0];
        } catch (error) {
            throw(error)
        }
    }

    async findCandidateByPeriodAndUser(payload: {username: string, id_period: number}) {
        try {
            const response = await queryDB<{name:string, curp:string, speciality_name:string, ficha: string, payment: string }[]>(`SELECT
                                                                                CONCAT(c.first_last_name, ' ', c.second_last_name, ' ', c.name) AS name,
                                                                                c.curp,
                                                                                s.name AS speciality_name,
                                                                                c.username as ficha,
                                                                                IF(c.payed = 1, 'Pagado', 'Pendiente') AS payment
                                                                            FROM candidates c
                                                                                JOIN selected_specialities ss ON c.id_candidate = ss.id_candidate
                                                                                JOIN speciality_by_period sbp ON ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                                JOIN sale_periods sp ON sbp.id_period = sp.id_period
                                                                                JOIN specialities s ON sbp.id_speciality = s.id_speciality
                                                                            WHERE c.username = ?
                                                                                AND sp.id_period = ?
                                                                                AND ss.herarchy = 1`, 
                [payload.username, payload.id_period]);

            return response[0];
        } catch (error) {
            throw(error)
        }
    }

    async registerPayment(payload: {username: string, payed: boolean}) {
        try {
            const response = await queryDB(`UPDATE candidates SET payed = ? WHERE username = ?`, 
                [payload.payed, payload.username]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async findCandidateToList(payload: {id_period: number}) {
        try {
            const response = await queryDB<candidateToList[]>(`select
                                                                    CONCAT(c.first_last_name, ' ', c.second_last_name, ' ', c.name) as full_name,
                                                                    c.username as no_ficha,
                                                                    s.name as speciality
                                                                from candidates c
                                                                join selected_specialities ss on c.id_candidate = ss.id_candidate
                                                                join speciality_by_period sbp on ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                join specialities s on sbp.id_speciality = s.id_speciality
                                                                where
                                                                    c.payed = 1
                                                                    and ss.herarchy = 1
                                                                    and sbp.id_period = ?
                                                                ORDER BY speciality ASC`,                                                   
                [payload.id_period]);

            return response;
        } catch (error) {
            throw(error)
        }
    }


    // informacion del candidato por partes
    async getTotalCandidatesBySearch(payload: {value: string}) {
        try {
            const response = await queryDB<{total : number}[]>(`SELECT COUNT(id_candidate) AS total FROM candidates WHERE curp like ? OR username like ?`,
                ['%' + payload.value + '%', '%' + payload.value + '%']);
            return response[0].total;
        } catch (error) {
            throw(error)
        }
    }

    async getCandidatesPaginated(payload: {limit: number, offset: number, value: string}) {
        try {
            const response = await queryDB<Candidate[]>(`SELECT * FROM candidates WHERE curp like ? OR username like ? ORDER BY username DESC LIMIT ? OFFSET ?`,
                ['%' + payload.value + '%', '%' + payload.value + '%', payload.limit, payload.offset]);
            return response;
        } catch (error) {
            throw(error)
        }
    }



    async getCandidateById(payload: {id_candidate: number}) {
        try {
            const response = await queryDB<CandidateDTO[]>(`SELECT
                                                            c.id_candidate,
                                                            c.name,
                                                            c.first_last_name,
                                                            c.second_last_name,
                                                            c.curp,
                                                            DATE_FORMAT(c.birthdate, '%Y-%m-%d') AS birthdate,
                                                            c.gender,
                                                            c.email,
                                                            m.id_state AS id_birth_state,
                                                            C.id_birth_municipality,
                                                            c.phone_number,
                                                            c.secondary_phone_number,
                                                            c.username,
                                                            c.id_address
                                                        FROM
                                                            candidates c
                                                        JOIN municipalities m on c.id_birth_municipality = m.id_municipality
                                                        WHERE
                                                            c.id_candidate = ?;`,
                [payload.id_candidate]);

            return response[0];
        } catch (error) {
            throw(error)
        }
    }

    async getAddressesById(payload: {id_address: number}) {
        try {
            const response = await queryDB<AddressDTO[]>(`select
                                                                a.id_address,
                                                                a.postal_code,
                                                                m.id_state as id_state,
                                                                a.id_municipality,
                                                                a.neighborhood,
                                                                a.street_and_number
                                                            from
                                                                addresses a
                                                            join municipalities m on a.id_municipality = m.id_municipality
                                                            where
                                                                a.id_address = ?`,
                [payload.id_address]);
            return response[0];
        } catch (error) {
            throw(error)
        }
    }

    async getTutorById(payload: {id_candidate: number}) {
        try {
            const response = await queryDB<tutorDTO[]>(`select
                                                            t.id_tutor,
                                                            t.name,
                                                            t.first_last_name,
                                                            t.second_last_name,
                                                            t.phone_number,
                                                            t.secondary_phone_number,
                                                            t.live_separated,
                                                            t.id_address
                                                        from
                                                            tutors t
                                                        where
                                                            t.id_candidate = ?`,
                [payload.id_candidate]);
            return response[0];
        } catch (error) {
            throw(error)
        }
    }

    async getHighschoolInformationById(payload: {id_candidate: number}) {
        try {
            const response = await queryDB<SchoolDTO[]>(`select
                                                            hi.id_highschool,
                                                            hi.school_key,
                                                            hi.school_type,
                                                            hi.school_name,
                                                            m.id_state as id_state,
                                                            hi.id_municipality,
                                                            hi.average_grade,
                                                            hi.has_debts,
                                                            hi.scholarship_type
                                                        from highschool_information hi
                                                        join municipalities m on hi.id_municipality = m.id_municipality
                                                        where hi.id_candidate = ?;`,
                [payload.id_candidate]);
            return response[0];
        } catch (error) {
            throw(error)
        }
    }
    
    async getSpecialitiesSelectedById(payload: {id_candidate: number}) {
        try {
            const response = await queryDB<specialitySelectedDTO[]>(`select
                                                                        ss.id_selected_speciality,
                                                                        s.id_speciality,
                                                                        ss.herarchy,
                                                                        s.name
                                                                    from selected_specialities ss
                                                                    join speciality_by_period sbp on ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                    join specialities s on sbp.id_speciality = s.id_speciality
                                                                    where ss.id_candidate = ?
                                                                    order by ss.herarchy`,
                [payload.id_candidate]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async checkIfPeriodIsActiveByIdCandidate(payload: {id_candidate: number}) {
        try {
            const response = await queryDB<{status: string}[]>(`select DISTINCT
                                                                            sp.status
                                                                        from selected_specialities ss
                                                                        join speciality_by_period sbp on ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                        join specialities s on sbp.id_speciality = s.id_speciality
                                                                        join sale_periods sp on sbp.id_period = sp.id_period
                                                                        where ss.id_candidate = ?`,
                [payload.id_candidate]);

            return response[0].status;
        } catch (error) {
            throw(error)
        }
    }

    async getPeriodByIdCandidate(payload: {id_candidate: number}) {
        try {
            const response = await queryDB<{id_period: number}[]>(`select
                                                                    sbp.id_period
                                                                from selected_specialities ss
                                                                join speciality_by_period sbp on ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                where ss.id_candidate = ?`,
                [payload.id_candidate]);
            return response[0].id_period;
        } catch (error) {
            throw(error)
        }
    }

    // actualización de candidato
    async updateCandidate(payload: CandidateDTO) {
        try {
            const response = await queryDB(`UPDATE candidates SET name = ?, first_last_name = ?, second_last_name = ?, curp = ?, birthdate = ?, gender = ?, email = ?, id_birth_municipality = ?, phone_number = ?, secondary_phone_number = ?, username = ? WHERE id_candidate = ?`,
                [payload.name, payload.first_last_name, payload.second_last_name, payload.curp, payload.birthdate, payload.gender, payload.email, payload.id_birth_municipality, payload.phone_number, payload.secondary_phone_number, payload.username, payload.id_candidate]);

            return response;
        } catch (error) {
            throw(error)
        }
    }

    async updateAddress(payload: AddressDTO) {
        try {
            const response = await queryDB(`UPDATE addresses SET postal_code = ?, id_municipality = ?, neighborhood = ?, street_and_number = ? WHERE id_address = ?`,
                [payload.postal_code, payload.id_municipality, payload.neighborhood, payload.street_and_number, payload.id_address]);

            return response;
        } catch (error) {
            throw(error)
        }
    }

    async updateTutor(payload: tutorDTO) {
        try {
            const response = await queryDB(`UPDATE tutors SET name = ?, first_last_name = ?, second_last_name = ?, phone_number = ?, secondary_phone_number = ?, live_separated = ?, id_address = ? WHERE id_tutor = ?`,
                [payload.name, payload.first_last_name, payload.second_last_name, payload.phone_number, payload.secondary_phone_number, payload.live_separated, payload.id_address, payload.id_tutor]);

            return response;
        } catch (error) {
            throw(error)
        }
    }

    async updateHighschoolInformation(payload: SchoolDTO) {
        try {
            const response = await queryDB(`UPDATE highschool_information SET school_key = ?, school_type = ?, school_name = ?, id_municipality = ?, average_grade = ?, has_debts = ?, scholarship_type = ? WHERE id_highschool = ?`,
                [payload.school_key, payload.school_type, payload.school_name, payload.id_municipality, payload.average_grade, payload.has_debts, payload.scholarship_type, payload.id_highschool]);

            return response;
        } catch (error) {
            throw(error)
        }
    }
    
    async updateSpecialitiesSelected(payload: {id_selected_speciality: number, id_speciality_by_period: number}) {
        try {
            const response = await queryDB(`UPDATE selected_specialities SET id_speciality_by_period = ? WHERE id_selected_speciality = ?`,
                [payload.id_speciality_by_period, payload.id_selected_speciality]);

            return response;
        } catch (error) {
            throw(error)
        }
    }

    async getSpecialitySelectedByHerarchyAndIdCandidate(payload: {herarchy: number, id_candidate: number}) {
        try {
            const response = await queryDB<specialitySelectedDTO[]>(`select
                                                                        ss.id_selected_speciality,
                                                                        s.id_speciality,
                                                                        ss.herarchy
                                                                    from selected_specialities ss
                                                                    join speciality_by_period sbp on ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                    join specialities s on sbp.id_speciality = s.id_speciality
                                                                    where ss.id_candidate = ?
                                                                    and ss.herarchy = ?`,
                [payload.id_candidate, payload.herarchy]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async deleteAddressById(payload: {id_address: number}) {
        try {
            const response = await queryDB(`DELETE FROM addresses WHERE id_address = ?`,
                [payload.id_address]);

            return response;
        } catch (error) {
            throw(error)
        }
    }



}