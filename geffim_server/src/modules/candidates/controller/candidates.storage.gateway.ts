import { queryDB } from "../../../utils/data_base/db_connection";
import { Candidate } from "../model/candidates";
import { SalePeriod } from "../../../modules/sale_periods/model/sale_period";
import { InstitutionalInformation } from "../../../modules/institutional_information/model/institutional_information";


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

}