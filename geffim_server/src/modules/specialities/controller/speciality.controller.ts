import { Pagination, ResponseApi } from './../../../kernel/types';
import { Router, Request, Response } from "express";
import logger from "../../../config/logs/logger";
import { validateError } from "../../../config/errors/error_handler";
import { PaginationRequest } from "../../../kernel/types";
import { filterSpecialityRequestDto } from "./dto/filter_speciality.request.dto";
import { SpecialityStorageGateway } from "./speciality.storage.gateway";
import { Speciality } from '../model/speciality';
import { text_with_spaces } from '../../../utils/regex/regex';
import { MESSAGES } from '../../../utils/messages/response_messages';
import { ResponseAllSpecialitiesDto } from './dto/response_all_specialities.dto';

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

    registerSpeciality = async (req: Request, res: Response) =>{
        try {
            // obtener el cuerpo de la peticion
            const payload = req.body as Speciality;

            // validar el cuerpo de la peticion
            if(!payload.name)
                throw new Error('El nombre de la especialidad es obligatorio');
            
            if(!text_with_spaces.test(payload.name))
                throw new Error('El nombre de la especialidad no es valido');
            
            if(!payload.acronym)
                throw new Error('El acronimo de la especialidad es obligatorio');

            if(payload.acronym.length > 7)
                throw new Error('El acronimo no puede tener mas de 7 caracteres');

            
            // instanciar el gateway
            const StorageGateway = new SpecialityStorageGateway();

            // verificar si la especialidad ya existe
            const speciality = await StorageGateway.getSpecialityByName(payload.name);
            if(speciality.length > 0)
                throw new Error('El nombre de la especialidad ya existe');
            
            // verificar si el acronimo ya existe
            const specialityAcronym = await StorageGateway.getSpecialityByAcronym(payload.acronym);
            if(specialityAcronym.length > 0)
                throw new Error('El acronimo ya existe');

            // registrar la especialidad
            await StorageGateway.registerSpeciality(payload);

            // crear el cuerpo de la respuesta
            const body : ResponseApi<boolean> = {
                data: true,
                message: 'Speciality registered successfully',
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

    updateSpeciality = async (req: Request, res: Response) =>{
        try {
            // obtener el cuerpo de la peticion
            const payload = req.body as Speciality;

            // validar el cuerpo de la peticion
            if(!payload.name)
                throw new Error('El nombre de la especialidad es obligatorio');
            
            if(!payload.acronym)
                throw new Error('El acronimo de la especialidad es obligatorio');

            if(payload.acronym.length > 7)
                throw new Error('El acronimo no puede tener mas de 7 caracteres');

            if(!payload.id_speciality)
                throw new Error(MESSAGES.BAD_REQUEST.DEFAULT);

            // instanciar el gateway
            const StorageGateway = new SpecialityStorageGateway();

            // verificar si la especialidad ya existe
            const speciality = await StorageGateway.getSpecialityByNameWithId({name: payload.name, id_speciality: payload.id_speciality});
            if(speciality.length > 0)
                throw new Error('El nombre de la especialidad ya existe');
            
            // verificar si el acronimo ya existe
            const specialityAcronym = await StorageGateway.getSpecialityByAcronymWithId({acronym: payload.acronym, id_speciality: payload.id_speciality});
            if(specialityAcronym.length > 0)
                throw new Error('El acronimo ya existe');

            // actualizar la especialidad
            await StorageGateway.updateSpeciality(payload);

            // crear el cuerpo de la respuesta
            const body : ResponseApi<boolean> = {
                data: true,
                message: 'Speciality updated successfully',
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

    changeStatusSpeciality = async (req: Request, res: Response) =>{
        try {
            // obtener el cuerpo de la peticion
            const payload = req.body as Speciality;

            // validar el cuerpo de la peticion
            if(!payload.id_speciality)
                throw new Error(MESSAGES.BAD_REQUEST.DEFAULT);

            // instanciar el gateway
            const StorageGateway = new SpecialityStorageGateway();

            // traer la especialidad
            const speciality = await StorageGateway.getSpecialityById(payload.id_speciality);

            speciality.status = !speciality.status;

            // actualizar la especialidad
            await StorageGateway.updateSpecialityStatus(speciality);

            // crear el cuerpo de la respuesta
            const body : ResponseApi<boolean> = {
                data: true,
                message: 'Speciality status updated successfully',
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

    getAllSpecialities = async (req: Request, res: Response) =>{
        try {
            // instanciar el gateway
            const StorageGateway = new SpecialityStorageGateway();

            // obtener las especialidades
            const specialities = await StorageGateway.getAllSpecialities();

            const specialitiesActive = specialities.filter(speciality => speciality.status);
            const specialitiesInactive = specialities.filter(speciality => !speciality.status);

            
            
            // crear el cuerpo de la respuesta
            const body : ResponseApi<ResponseAllSpecialitiesDto> = {
                data: {
                    specialitiesActive,
                    specialitiesInactive
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
SpecialityRouter.post('/register-speciality', new SpecialityController().registerSpeciality);
SpecialityRouter.post('/update-speciality', new SpecialityController().updateSpeciality);
SpecialityRouter.post('/change-status-speciality', new SpecialityController().changeStatusSpeciality);
SpecialityRouter.get('/get-all-specialities', new SpecialityController().getAllSpecialities);



export default SpecialityRouter;