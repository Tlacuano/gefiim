import { Router, Request, Response } from "express";
import logger from "../../../config/logs/logger";
import { validateError } from "../../../config/errors/error_handler";
import { SalePeriodStorageGateway } from "./sale_period.storage.gateway";
import { ResponseApi } from "../../../kernel/types";
import { Pagination } from "../../../kernel/types";
import { SalePeriod } from "../model/sale_period";
import { registerSalePeriodRequestDto } from "./dto/register_sale_period.request.dto";
import { MESSAGES } from "../../../utils/messages/response_messages";
import { SpecialityStorageGateway } from "../../../modules/specialities/controller/speciality.storage.gateway";

const SalePeriodRouter = Router();

export class SalePeriodController {
    async getSalePeriodsPage(req: Request, res: Response) {
        try {
            // obtener los parametros y el cuerpo de la peticion
            const params = req.query as any;

            //validar los parametros y el cuerpo de la peticion
            const page = parseInt(params.page);
            const limit = parseInt(params.limit);
            // calcular el offset
            const offset = (page - 1) * limit;

            // instanciar el gateway
            const StorageGateway = new SalePeriodStorageGateway();

            // obtener el total de periodos de venta y los periodos de venta paginados
            const totalSalePeriods = await StorageGateway.getTotalSalePeriods();
            const salePeriods = await StorageGateway.getSalePeriodsPaginated({ limit: limit, offset: offset });

            // crear el cuerpo de la respuesta
            const body: ResponseApi<Pagination<SalePeriod[]>> = {
                data: {
                    content: salePeriods,
                    page: page,
                    limit: limit,
                    total: totalSalePeriods
                },
                message: 'Sale periods fetched successfully',
                status: 200,
                error: false
            }

            // enviar la respuesta
            res.status(200).json(body);
        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);
        }
    }

    async registerSalePeriod(req: Request, res: Response) {
        try {
            // obtener el cuerpo de la peticion
            const payload = req.body as registerSalePeriodRequestDto;


            // validar el cuerpo de la peticion
            if (!payload.start_date || !payload.end_date) 
                throw new Error('La fecha de inicio y la fecha de fin son obligatorias');


            // validar las fechas
            const startDate = new Date(payload.start_date);
            const endDate = new Date(payload.end_date);
            const today = new Date();
            
            // validar que la fecha de inicio sea menor a la fecha de fin
            if (startDate >= endDate)
                throw new Error('La fecha de inicio debe ser menor a la fecha de fin');

            let status = 'pending';
            if (today >= startDate && today <= endDate) {
                status = 'active';
            }

            payload.status = status;

            // verificar si el rango de fechas ya paso
            if (today > endDate)
                throw new Error('No se puede registrar un periodo de venta con una fecha de fin menor a la fecha actual');

            const StorageGateway = new SalePeriodStorageGateway();

            // validar que el rango de fechas no se cruce con otro rango de fechas
            const totalSalePeriodsCrossing = await StorageGateway.getTotalSalePeriodsCrossing({ start_date: payload.start_date, end_date: payload.end_date });
            if (totalSalePeriodsCrossing > 0)
                throw new Error('El rango de fechas se cruza con otro rango de fechas');

            // registrar el periodo de venta
            const id_period = await StorageGateway.registerSalePeriod(payload);


            // registrar las especialidades y sus fichas permitidas
            payload.speciality_by_period.forEach(async speciality => {
                if (!speciality.id_speciality)
                    throw new Error(MESSAGES.SERVER_ERROR);
                if (speciality.tokens_allowed <= 0 || !Number.isInteger(speciality.tokens_allowed))
                    throw new Error('Las fichas permitidas deben ser un numero entero positivo');

                // validar que la especialidad exista
                const specialityGateway = new SpecialityStorageGateway();
                const existSpeciality = await specialityGateway.getSpecialityById(speciality.id_speciality);

                if (!existSpeciality)
                    throw new Error('La especialidad no existe');
                
                // registrar la especialidad con sus fichas permitidas
                await StorageGateway.registerSpecialityBySalePeriod({ id_period: id_period, id_speciality: speciality.id_speciality, tokens_allowed: speciality.tokens_allowed });
            });

            // crear el cuerpo de la respuesta
            const body: ResponseApi<boolean> = {
                data: true,
                message: 'Sale period registered successfully',
                status: 200,
                error: false
            }

            // enviar la respuesta
            res.status(200).json(body);
        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);
        }
    }

    async updateSalePeriod(req: Request, res: Response) {
        try {
            // obtener el cuerpo de la peticion
            const payload = req.body as registerSalePeriodRequestDto;

            if (!payload.id_period)
                throw new Error(MESSAGES.SERVER_ERROR);

            // validar el cuerpo de la peticion
            if (!payload.start_date || !payload.end_date) 
                throw new Error('La fecha de inicio y la fecha de fin son obligatorias');

            // validar que la fechas
            const startDate = new Date(payload.start_date);
            const endDate = new Date(payload.end_date);
            const today = new Date();
            
            if (startDate >= endDate)
                throw new Error('La fecha de inicio debe ser menor a la fecha de fin');

            let status = 'pending';
            if (today >= startDate && today <= endDate) {
                status = 'active';
            }

            payload.status = status;

            const StorageGateway = new SalePeriodStorageGateway();

            // validar que el rango de fechas no se cruce con otro rango de fechas
            const totalSalePeriodsCrossing = await StorageGateway.getTotalSalePeriodsCrossing({ start_date: payload.start_date, end_date: payload.end_date, id_period: payload.id_period});

            if (totalSalePeriodsCrossing > 0)
                throw new Error('El rango de fechas se cruza con otro rango de fechas');

            // validar que el periodo no sea cancelado o finalizado
            const salePeriod = await StorageGateway.getSalePeriodById({ id_period: payload.id_period });

            if (!salePeriod)
                throw new Error(MESSAGES.SERVER_ERROR);

            if (salePeriod[0].status === 'canceled' || salePeriod[0].status === 'finalized')
                throw new Error('El periodo de venta no se puede actualizar');

            // actualizar el periodo de venta
            await StorageGateway.updateSalePeriod(payload);

            // crear el cuerpo de la respuesta
            const body: ResponseApi<boolean> = {
                data: true,
                message: 'Sale period updated successfully',
                status: 200,
                error: false
            }

            // enviar la respuesta
            res.status(200).json(body);
        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);
        }
    }

    async changeStatusSalePeriod(req: Request, res: Response) {
        try {
            const payload = req.body as SalePeriod;

            if (!payload.id_period)
                throw new Error(MESSAGES.SERVER_ERROR); 

            if (!payload.status)
                throw new Error(MESSAGES.SERVER_ERROR);

            const StorageGateway = new SalePeriodStorageGateway();

            const salePeriod = await StorageGateway.getSalePeriodById({ id_period: payload.id_period });

            // si el periodo de venta no existe
            if (!salePeriod)
                throw new Error(MESSAGES.SERVER_ERROR);

            // si el periodo de venta ya esta activo el estado tiene que ser finalizado
            if (salePeriod[0].status === 'active' && payload.status !== 'finalized')
                throw new Error('El estado del periodo de venta debe ser finalizado');
            // si el periodo esta pendiente el estado tiene que ser cancelado
            if (salePeriod[0].status === 'pending' && payload.status !== 'cancelled')
                throw new Error('El estado del periodo de venta debe ser cancelado');
            // si el periodo ya esta finalizado no se puede cambiar el estado
            if (salePeriod[0].status === 'finalized' || salePeriod[0].status === 'canceled')
                throw new Error('El estado del periodo de venta no se puede cambiar');

            // cambiar el estado del periodo de venta
            await StorageGateway.changeStatusSalePeriod(payload);

            // crear el cuerpo de la respuesta
            const body: ResponseApi<boolean> = {
                data: true,
                message: 'Sale period status changed successfully',
                status: 200,
                error: false
            }

            // enviar la respuesta
            res.status(200).json(body);
        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);
        }
    }

    async autoChangeStatusSalePeriod(___: Request, res: Response) {
        try {
            // desactivar el periodo de venta que ya paso y activar el periodo de venta que ya inicia
            const StorageGateway = new SalePeriodStorageGateway();

            const today = new Date();

            await StorageGateway.finalizeSalePeriod({ today: today });
            await StorageGateway.updateNewActiveSpeciality({ today: today });
            
            // crear el cuerpo de la respuesta
            const body: ResponseApi<boolean> = {
                data: true,
                message: 'Sale period status changed successfully',
                status: 200,
                error: false
            }

            // enviar la respuesta
            res.status(200).json(body);
            
        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);            
        }
    }
    
    async getCurrentPeriod(req: Request, res: Response) {
        try {
            
        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);            
        }
    }
}

SalePeriodRouter.get('/get-sale-period-page', new SalePeriodController().getSalePeriodsPage);
SalePeriodRouter.post('/register-sale-period', new SalePeriodController().registerSalePeriod);
SalePeriodRouter.post('/update-sale-period', new SalePeriodController().updateSalePeriod);
SalePeriodRouter.post('/change-status-sale-period', new SalePeriodController().changeStatusSalePeriod);
SalePeriodRouter.post('/auto-change-status-sale-period', new SalePeriodController().autoChangeStatusSalePeriod);

export default SalePeriodRouter;