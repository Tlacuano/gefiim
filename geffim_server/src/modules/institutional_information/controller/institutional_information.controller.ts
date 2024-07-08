import { Router, Request, Response } from "express";
import logger from "../../../config/logs/logger";
import { validateError } from "../../../config/errors/error_handler";
import { InstitutionalInformationStorageGateway } from "./institutional_information.storage.gateway";
import { ResponseApi } from "../../../kernel/types";
import { InstitutionalInformation } from "../model/institutional_information";

const InstitutionalInformationRouter = Router();

export class InstitutionalInformationController {
    async getInstitutionalInformation(___: Request, res: Response) {
        try {
            // Instanciar el gateway
            const StorageGateway = new InstitutionalInformationStorageGateway();

            // Obtener la información institucional
            const institutionalInformation = await StorageGateway.getInstitutionalInformation();

            // Crear el cuerpo de la respuesta
            const body: ResponseApi<InstitutionalInformation> = {
                data: institutionalInformation,
                status: 200,
                message: 'Institutional information retrieved successfully',
                error: false
            };

            // Enviar la respuesta
            res.status(200).json(body);

        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);            
        }
    }

    async updateInstitutionalInformation(req: Request, res: Response) {
        try {
            // obtener el cuerpo de la petición
            const payload = req.body as InstitutionalInformation;

            // Validar que el cuerpo de la petición
            if(!payload.primary_color)
                throw new Error('El color primario no puede estar vacío');
            if(!payload.secondary_color)
                throw new Error('El color secundario no puede estar vacío');
            if(!payload.logo)
                throw new Error('El logo no puede estar vacío');
            if(!payload.main_image)
                throw new Error('La imagen principal no puede estar vacía');

            // validar que los colores estan en formato hexadecimal
            const hexColor = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

            if(!hexColor.test(payload.primary_color))
                throw new Error('El color primario no tiene un formato válido');
            if(!hexColor.test(payload.secondary_color))
                throw new Error('El color secundario no tiene un formato válido');

            // validar que el base64 es una imagen (png, jpg, jpeg)

            const base64Image = /^data:image\/(png|jpg|jpeg);base64,/;
            if(!base64Image.test(payload.logo))
                throw new Error('El logo no tiene un formato válido');
            if(!base64Image.test(payload.main_image))
                throw new Error('La imagen principal no tiene un formato válido');


            // Instanciar el gateway
            const StorageGateway = new InstitutionalInformationStorageGateway();

            // Actualizar la información institucional
            await StorageGateway.updateInstitutionalInformation(payload);

            // Crear el cuerpo de la respuesta
            const body: ResponseApi<null> = {
                data: null,
                status: 200,
                message: 'Institutional information updated successfully',
                error: false
            };

            // Enviar la respuesta
            res.status(200).json(body);
            
        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);            
        }
    }
}

InstitutionalInformationRouter.get('/get-institutional-information', new InstitutionalInformationController().getInstitutionalInformation);
InstitutionalInformationRouter.post('/update-institutional-information', new InstitutionalInformationController().updateInstitutionalInformation);

export default InstitutionalInformationRouter;