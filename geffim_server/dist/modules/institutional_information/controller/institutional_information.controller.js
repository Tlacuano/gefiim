"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionalInformationController = void 0;
const express_1 = require("express");
const logger_1 = __importDefault(require("../../../config/logs/logger"));
const error_handler_1 = require("../../../config/errors/error_handler");
const institutional_information_storage_gateway_1 = require("./institutional_information.storage.gateway");
const InstitutionalInformationRouter = (0, express_1.Router)();
class InstitutionalInformationController {
    getInstitutionalInformation(___, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Instanciar el gateway
                const StorageGateway = new institutional_information_storage_gateway_1.InstitutionalInformationStorageGateway();
                // Obtener la información institucional
                const institutionalInformation = yield StorageGateway.getInstitutionalInformation();
                // Crear el cuerpo de la respuesta
                const body = {
                    data: institutionalInformation,
                    status: 200,
                    message: 'Institutional information retrieved successfully',
                    error: false
                };
                // Enviar la respuesta
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    updateInstitutionalInformation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la petición
                const payload = req.body;
                // Validar que el cuerpo de la petición
                if (!payload.primary_color)
                    throw new Error('El color primario no puede estar vacío');
                if (!payload.secondary_color)
                    throw new Error('El color secundario no puede estar vacío');
                if (!payload.logo)
                    throw new Error('El logo no puede estar vacío');
                if (!payload.main_image)
                    throw new Error('La imagen principal no puede estar vacía');
                // validar que los colores estan en formato hexadecimal
                const hexColor = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
                if (!hexColor.test(payload.primary_color))
                    throw new Error('El color primario no tiene un formato válido');
                if (!hexColor.test(payload.secondary_color))
                    throw new Error('El color secundario no tiene un formato válido');
                // validar que el base64 es una imagen (png, jpg, jpeg)
                const base64Image = /^data:image\/(png|jpg|jpeg);base64,/;
                if (!base64Image.test(payload.logo))
                    throw new Error('El logo no tiene un formato válido');
                if (!base64Image.test(payload.main_image))
                    throw new Error('La imagen principal no tiene un formato válido');
                // Instanciar el gateway
                const StorageGateway = new institutional_information_storage_gateway_1.InstitutionalInformationStorageGateway();
                // Actualizar la información institucional
                yield StorageGateway.updateInstitutionalInformation(payload);
                // Crear el cuerpo de la respuesta
                const body = {
                    data: null,
                    status: 200,
                    message: 'Institutional information updated successfully',
                    error: false
                };
                // Enviar la respuesta
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
}
exports.InstitutionalInformationController = InstitutionalInformationController;
InstitutionalInformationRouter.get('/get-institutional-information', new InstitutionalInformationController().getInstitutionalInformation);
InstitutionalInformationRouter.post('/update-institutional-information', new InstitutionalInformationController().updateInstitutionalInformation);
exports.default = InstitutionalInformationRouter;
