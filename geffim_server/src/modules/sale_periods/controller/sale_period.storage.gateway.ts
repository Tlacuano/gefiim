import { SalePeriod } from './../model/sale_period';
import { queryDB } from '../../../utils/data_base/db_connection';
import { registerSalePeriodRequestDto } from './dto/register_sale_period.request.dto';

export class SalePeriodStorageGateway {
    async getTotalSalePeriods(payload: void) {
        try {
            const response = await queryDB<{ total: number }[]>('SELECT COUNT(id_period) as total FROM sale_periods');

            const { total } = response[0];
            return total;
        } catch (error) {
            throw(error)
        }
    }

    async getSalePeriodsPaginated(payload: { limit: number, offset: number }) {
        try {
            const response = await queryDB<SalePeriod[]>("SELECT * FROM sale_periods ORDER BY start_date DESC LIMIT ? OFFSET ? ", 
                [payload.limit, payload.offset]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    // para registrar y actualizar periodos de venta
    async getTotalSalePeriodsCrossing(payload: { start_date: Date, end_date: Date, id_period?: number}) {
        const query = payload.id_period ? "SELECT COUNT(id_period) as total FROM sale_periods WHERE start_date <= ? AND end_date >= ? AND id_period != ? AND status IN ('pending', 'active')" : "SELECT COUNT(id_period) as total FROM sale_periods WHERE start_date <= ? AND end_date >= ? AND status IN ('pending', 'active')"
        
        try {
            const response = await queryDB<{ total: number }[]>(query, 
                [payload.start_date, payload.end_date, payload.id_period]);
            const { total } = response[0];
            return total;
        } catch (error) {
            throw(error)
        }
    }

    async getSalePeriodById(payload: { id_period: number }) {
        try {
            const response = await queryDB<SalePeriod[]>("SELECT * FROM sale_periods WHERE id_period = ?", 
                [payload.id_period]);

            return response;
        } catch (error) {
            throw(error)
        }
    }

    async registerSalePeriod(payload: registerSalePeriodRequestDto) {
        try {
            const response = await queryDB<{insertId: number}>('INSERT INTO sale_periods (start_date, end_date, bank_name, bank_account, bank_clabe, concept, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [payload.start_date, payload.end_date, payload.bank_name, payload.bank_account, payload.bank_clabe, payload.concept, payload.amount, payload.status]);
            
            return response.insertId;
        } catch (error) {
            throw(error)
        }
    }

    async registerSpecialityBySalePeriod(payload: { id_period: number, id_speciality: number, tokens_allowed: number }) {
        try {
            const response = await queryDB('INSERT INTO speciality_by_period (id_period, id_speciality, tokens_allowed) VALUES (?, ?, ?)', 
                [payload.id_period, payload.id_speciality, payload.tokens_allowed]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async updateSalePeriod(payload: registerSalePeriodRequestDto){
        try {
            const response = await queryDB('UPDATE sale_periods SET start_date = ?, end_date = ?, bank_name = ?, bank_account = ?, bank_clabe = ?, concept = ?, amount = ?, status = ? WHERE id_period = ?',
                [payload.start_date, payload.end_date, payload.bank_name, payload.bank_account, payload.bank_clabe, payload.concept, payload.amount, payload.status, payload.id_period]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async changeStatusSalePeriod(payload: { id_period: number, status: string }) {
        try {
            const response = await queryDB('UPDATE sale_periods SET status = ? WHERE id_period = ?', 
                [payload.status, payload.id_period]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async updateNewActiveSpeciality(payload:{ today: Date }) {
        try {
            const response = await queryDB("UPDATE sale_periods SET status = 'active' WHERE start_date <= ? AND end_date >= ? AND status = 'pending'", 
                [payload.today, payload.today]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async finalizeSalePeriod(payload: { today: Date }) {
        try {
            const response = await queryDB("UPDATE sale_periods SET status = 'finished' WHERE end_date < ? AND status = 'active'", 
                [payload.today]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async getCurrrentSalePeriod(payload: { today: Date }) {
        try {
            const response = await queryDB<SalePeriod[]>("SELECT * FROM sale_periods WHERE start_date <= ? AND end_date >= ? AND status = 'active'", 
                [payload.today, payload.today]);
            return response[0];
        } catch (error) {
            throw(error)
        }
    }

    async getTotalTokens(){
        try {
            const response = await queryDB<{id_speciality:number, name:string, tokens_allowed: number, saled: number }[]>(`SELECT
                                                                                                                                s.id_speciality,
                                                                                                                                s.name,
                                                                                                                                COALESCE(sbp.tokens_allowed, 0) AS tokens_allowed,
                                                                                                                                COUNT(CASE WHEN ss.herarchy = 1 THEN ss.id_selected_speciality END) AS saled
                                                                                                                            FROM
                                                                                                                                specialities s
                                                                                                                            LEFT JOIN
                                                                                                                                speciality_by_period sbp ON s.id_speciality = sbp.id_speciality
                                                                                                                            LEFT JOIN
                                                                                                                                sale_periods sp ON sbp.id_period = sp.id_period AND sp.status = 'active'
                                                                                                                            LEFT JOIN
                                                                                                                                selected_specialities ss ON sbp.id_speciality_by_period = ss.id_speciality_by_period
                                                                                                                            WHERE
                                                                                                                                s.status = 1
                                                                                                                            AND sp.status = 'active'
                                                                                                                            GROUP BY
                                                                                                                                s.id_speciality, s.name, sbp.tokens_allowed;`, 
                []);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    // actualizar tokens vendidos

    async getSpecialityBySalePeriod(payload: { id_period: number }) {
        try {
            const response = await queryDB<{id_speciality:number, name:string, tokens_allowed: number, saled: number }[]>(` SELECT
                                                                                                                                s.id_speciality,
                                                                                                                                s.name,
                                                                                                                                COALESCE(sbp.tokens_allowed, 0) AS tokens_allowed
                                                                                                                            FROM
                                                                                                                                specialities s
                                                                                                                            LEFT JOIN
                                                                                                                                speciality_by_period sbp ON s.id_speciality = sbp.id_speciality AND sbp.id_period = ?
                                                                                                                            WHERE
                                                                                                                                s.status = 1
                                                                                                                            ORDER BY
                                                                                                                                s.id_speciality;`, 
                [payload.id_period]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async existSpecialityBySalePeriod(payload: { id_period: number, id_speciality: number }) {
        try {
            const response = await queryDB<{id_speciality_by_period: number, tokens_allowed:number}[]>(`select id_speciality_by_period, tokens_allowed from speciality_by_period where id_period = ? and id_speciality = ?;`, 
                [payload.id_period, payload.id_speciality]);
            return response[0];
        } catch (error) {
            throw(error)
        }
    }

    async updateTokensAllowed(payload: { id_speciality_by_period: number, tokens_allowed: number }) {
        try {
            const response = await queryDB('UPDATE speciality_by_period SET tokens_allowed = ? WHERE id_speciality_by_period = ?', 
                [payload.tokens_allowed, payload.id_speciality_by_period]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

}