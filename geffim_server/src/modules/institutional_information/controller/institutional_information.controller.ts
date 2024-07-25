import { Router, Request, Response } from "express";
import logger from "../../../config/logs/logger";
import { validateError } from "../../../config/errors/error_handler";
import { InstitutionalInformationStorageGateway } from "./institutional_information.storage.gateway";
import { ResponseApi } from "../../../kernel/types";
import { InstitutionalInformation } from "../model/institutional_information";
import { Authenticator } from "../../../config/jwt";

const InstitutionalInformationRouter = Router();

export class InstitutionalInformationController {
    async getInstitutionalInformation(___: Request, res: Response) {
        try {
            // Instanciar el gateway
            const StorageGateway = new InstitutionalInformationStorageGateway();

            // Obtener la información institucional
            const institutionalInformation = await StorageGateway.getInstitutionalInformation();

            // Convertir el logo y la imagen principal a base64
            institutionalInformation.logo = Buffer.from(institutionalInformation.logo as Buffer).toString('base64');
            institutionalInformation.main_image = Buffer.from(institutionalInformation.main_image as Buffer).toString('base64');

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
            if(!base64Image.test(payload.logo as string))
                throw new Error('El logo no tiene un formato válido');
            if(!base64Image.test(payload.main_image as string))
                throw new Error('La imagen principal no tiene un formato válido');

            // convertir el logo y la imagen principal a Blob
            
            //sacar los datos de la imagen
            const origen_logo = payload.logo as string;
            const orgigen_main_image = payload.main_image as string;

            //sacar el tipo de imagen
            const typeLogo = origen_logo.split(';base64,').pop() as string;
            const typeMainImage = orgigen_main_image.split(';base64,').pop() as string;

            const logo_buffer = Buffer.from(typeLogo, 'base64');
            const main_image_buffer = Buffer.from(typeMainImage, 'base64');

            // Crear el payload con los datos correctos
            payload.logo = logo_buffer;
            payload.main_image = main_image_buffer;          


            // Instanciar el gateway
            const StorageGateway = new InstitutionalInformationStorageGateway();

            // Actualizar la información institucional
            await StorageGateway.updateInstitutionalInformation(payload);

            // Crear el cuerpo de la respuesta
            const body: ResponseApi<boolean> = {
                data: true,
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

// admin
InstitutionalInformationRouter.post('/update-institutional-information', Authenticator(['ADMIN']), new InstitutionalInformationController().updateInstitutionalInformation);

export default InstitutionalInformationRouter;