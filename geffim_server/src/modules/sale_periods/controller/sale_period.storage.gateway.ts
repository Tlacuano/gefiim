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
            const response = await queryDB<SalePeriod[]>("SELECT * FROM sale_periods LIMIT ? OFFSET ? ", 
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
            const response = await queryDB<{id_speciality:number, name:string, tokens_allowed: number, saled: number }[]>(`select s.id_speciality, s.name, sbp.tokens_allowed, count(CASE WHEN ss.herarchy = 1 THEN ss.id_selected_speciality END) as saled from sale_periods sp
                                                                            join speciality_by_period sbp on sp.id_period = sbp.id_period
                                                                            join specialities s on sbp.id_speciality = s.id_speciality
                                                                            left join selected_specialities ss on sbp.id_speciality_by_period = ss.id_speciality_by_period
                                                                            where sp.status = 'active'
                                                                            group by s.name, sbp.tokens_allowed, s.id_speciality;`, 
                []);
            return response;
        } catch (error) {
            throw(error)
        }
    }

}