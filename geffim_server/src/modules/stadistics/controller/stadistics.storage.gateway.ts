import { stadistics, stadisticsBySpeciality } from './../model/stadistics';
import { queryDB } from "../../../utils/data_base/db_connection";


export class StadisticsStorageGateway {
    async getTotalTokensAutorized( id_speciality: number ) {
        try {
            const response = await queryDB<{ total: number }[]>("select SUM(tokens_allowed) as total from speciality_by_period where id_period =  ?", 
                [id_speciality]);

            return response[0].total;
        } catch (error) {
            throw(error)
        }
    }

    async getTotalTokensRegistered( id_speciality: number ) {
        try {
            const response = await queryDB<{ total: number }[]>("select COUNT(ss.id_selected_speciality) as total from selected_specialities ss join speciality_by_period sbp on ss.id_speciality_by_period = sbp.id_speciality_by_period where ss.herarchy = 1 and sbp.id_period = ?", 
                [id_speciality]);
            return response[0].total;
        } catch (error) {
            throw(error)
        }
    }

    async getStadisticsBySpeciality ( id_speciality: number ) {
        try {
            const response = await queryDB<stadisticsBySpeciality[]>(`SELECT
                                                                        s.name AS speciality_name,
                                                                        COALESCE(COUNT(CASE WHEN c.payed = 1 THEN 1 END), 0) AS payed_count,
                                                                        COALESCE(COUNT(CASE WHEN c.payed = 0 THEN 1 END), 0) AS not_payed_count,
                                                                        CAST(sbp.tokens_allowed AS UNSIGNED) AS total_tokens
                                                                    FROM
                                                                        sale_periods sp
                                                                        JOIN speciality_by_period sbp ON sp.id_period = sbp.id_period
                                                                        JOIN specialities s ON sbp.id_speciality = s.id_speciality
                                                                        LEFT JOIN selected_specialities ss ON sbp.id_speciality_by_period = ss.id_speciality_by_period
                                                                        LEFT JOIN candidates c ON ss.id_candidate = c.id_candidate AND ss.herarchy = 1
                                                                    WHERE
                                                                        sp.id_period = ?
                                                                    GROUP BY
                                                                        s.name, sbp.tokens_allowed;`, 
                [id_speciality]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

}