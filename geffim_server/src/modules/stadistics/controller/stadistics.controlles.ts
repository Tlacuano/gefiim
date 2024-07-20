import { Router, Request, Response } from "express";
import { RequestGetStadistics } from "./dto/request_get_stadistics.dto";
import { MESSAGES } from "../../../utils/messages/response_messages";
import { StadisticsStorageGateway } from "./stadistics.storage.gateway";
import { ResponseApi } from "../../../kernel/types";
import { stadistics } from "../model/stadistics";
import logger from "../../../config/logs/logger";
import { validateError } from "../../../config/errors/error_handler";


const StadisticsRouter = Router();

export class StadisticsController {
    async getStadistics(req: Request, res:Response){
        try {
            // recibir el cuerpo de la petición
            const payload = req.body as RequestGetStadistics;

            // validar que el cuerpo de la petición
            if(!payload.id_period)
                throw new Error(MESSAGES.BAD_REQUEST.DEFAULT);

            // instanciar el gateway
            const stadisticsStorageGateway = new StadisticsStorageGateway();

            // obtener las estadisticas
            const totalTokensAutorized = await stadisticsStorageGateway.getTotalTokensAutorized(payload.id_period);
            const totalTokensRegistered = await stadisticsStorageGateway.getTotalTokensRegistered(payload.id_period);

            // obtener las estadisticas por especialidad
            const stadisticsBySpeciality = await stadisticsStorageGateway.getStadisticsBySpeciality(payload.id_period);

            for (let i = 0; i < stadisticsBySpeciality.length; i++) {
                const total = stadisticsBySpeciality[i].payed_count + stadisticsBySpeciality[i].not_payed_count;
                stadisticsBySpeciality[i].percentage_payed = ((stadisticsBySpeciality[i].payed_count / total) * 100) || 0;
                stadisticsBySpeciality[i].registered_count = total;
            }

            // crear el cuerpo de la respuesta
            const body:ResponseApi<stadistics> = {
                data:{
                    total_tokens_autorized: totalTokensAutorized,
                    total_tokens_registered: totalTokensRegistered,
                    stadistics_by_speciality: stadisticsBySpeciality
                },
                status: 200,
                message: 'Stadistics retrieved successfully',
                error: false
            }

            // responder al cliente
            res.status(200).json(body);
        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);
        }
    }
}

StadisticsRouter.post('/get-stadistics', new StadisticsController().getStadistics);

export default StadisticsRouter;