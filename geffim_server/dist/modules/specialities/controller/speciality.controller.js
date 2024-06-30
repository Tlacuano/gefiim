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
exports.SpecialityController = void 0;
const express_1 = require("express");
const logger_1 = __importDefault(require("../../../config/logs/logger"));
const error_handler_1 = require("../../../config/errors/error_handler");
const speciality_storage_gateway_1 = require("./speciality.storage.gateway");
const SpecialityRouter = (0, express_1.Router)();
class SpecialityController {
    constructor() {
        this.getSpecialitiesPage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener los parametros y el cuerpo de la peticion
                const params = req.query;
                const payload = req.body;
                //validar los parametros y el cuerpo de la peticion
                const page = parseInt(params.page);
                const limit = parseInt(params.limit);
                // calcular el offset
                const offset = (page - 1) * limit;
                // instanciar el gateway
                const StorageGateway = new speciality_storage_gateway_1.SpecialityStorageGateway();
                // obtener el total de especialidades y las especialidades paginadas
                const totalSpecialities = yield StorageGateway.getTotalSpecialities();
                const specialities = yield StorageGateway.getSpecialitiesPaginated({ limit: limit, offset: offset, filter: payload });
                // crear el cuerpo de la respuesta
                const body = {
                    data: {
                        content: specialities,
                        page: page,
                        limit: limit,
                        total: totalSpecialities
                    },
                    message: 'Specialities fetched successfully',
                    status: 200,
                    error: false
                };
                // enviar la respuesta
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
exports.SpecialityController = SpecialityController;
SpecialityRouter.post('/get-specialities-page', new SpecialityController().getSpecialitiesPage);
exports.default = SpecialityRouter;
