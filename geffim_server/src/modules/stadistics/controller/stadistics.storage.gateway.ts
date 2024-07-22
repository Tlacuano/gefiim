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
    CAST(COALESCE(SUM(CASE WHEN c.payed = 1 THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS payed_count,
    CAST(COALESCE(SUM(CASE WHEN c.payed = 0 THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS not_payed_count,
    CAST(COALESCE(sbp.tokens_allowed, 0) AS UNSIGNED) AS total_tokens
FROM
    specialities s
JOIN
    speciality_by_period sbp ON s.id_speciality = sbp.id_speciality
JOIN
    sale_periods sp ON sbp.id_period = sp.id_period AND sp.id_period = ? AND sp.status = 'active'
LEFT JOIN
    selected_specialities ss ON sbp.id_speciality_by_period = ss.id_speciality_by_period AND ss.herarchy = 1
LEFT JOIN
    candidates c ON ss.id_candidate = c.id_candidate
WHERE
    s.status = 1
GROUP BY
    s.name, sbp.tokens_allowed;
`, 
                [id_speciality]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

}