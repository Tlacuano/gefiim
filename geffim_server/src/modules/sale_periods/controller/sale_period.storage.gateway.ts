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
    async getTotalSalePeriodsCrossing(payload: { start_date: Date, end_date: Date }) {
        try {
            const response = await queryDB<{ total: number }[]>('SELECT COUNT(id_period) as total FROM sale_periods WHERE start_date <= ? AND end_date >= ?', 
                [payload.end_date, payload.start_date]);
            
            const { total } = response[0];
            return total;
        } catch (error) {
            throw(error)
        }
    }

    async registerSalePeriod(payload: registerSalePeriodRequestDto) {
        try {
            const response = await queryDB<{insertId: number}>('INSERT INTO sale_periods (start_date, end_date, status) VALUES (?, ?, ?)', 
                [payload.start_date, payload.end_date, payload.status]);
            
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

}