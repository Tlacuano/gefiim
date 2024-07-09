import { queryDB } from "../../../utils/data_base/db_connection";


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
}