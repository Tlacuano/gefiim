import { Pagination, ResponseApi } from './../../../kernel/types';
import { Router, Request, Response } from "express";
import logger from "../../../config/logs/logger";
import { validateError } from "../../../config/errors/error_handler";
import { PaginationRequest } from "../../../kernel/types";
import { filterSpecialityRequestDto } from "./dto/filter_speciality.request.dto";
import { SpecialityStorageGateway } from "./speciality.storage.gateway";
import { Speciality } from '../model/speciality';

const SpecialityRouter = Router();

export class SpecialityController {
    getSpecialitiesPage = async (req: Request, res: Response) =>{
        try {
            // obtener los parametros y el cuerpo de la peticion
            const params = req.query as any;
            const payload = req.body as filterSpecialityRequestDto;

            //validar los parametros y el cuerpo de la peticion
            const page = parseInt(params.page);
            const limit = parseInt(params.limit);
            // calcular el offset
            const offset = (page - 1) * limit;
            
            // instanciar el gateway
            const StorageGateway = new SpecialityStorageGateway();

            // obtener el total de especialidades y las especialidades paginadas
            const totalSpecialities = await StorageGateway.getTotalSpecialities();
            const specialities = await StorageGateway.getSpecialitiesPaginated({limit: limit, offset: offset, filter: payload});
            
            // crear el cuerpo de la respuesta
            const body : ResponseApi<Pagination<Speciality[]>> = {
                data: {
                    content: specialities,
                    page: page,
                    limit: limit,
                    total: totalSpecialities
                },
                message: 'Specialities fetched successfully',
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
}

SpecialityRouter.post('/get-specialities-page', new SpecialityController().getSpecialitiesPage);

export default SpecialityRouter;