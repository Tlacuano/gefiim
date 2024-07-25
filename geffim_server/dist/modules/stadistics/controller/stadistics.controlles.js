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
exports.StadisticsController = void 0;
const express_1 = require("express");
const response_messages_1 = require("../../../utils/messages/response_messages");
const stadistics_storage_gateway_1 = require("./stadistics.storage.gateway");
const logger_1 = __importDefault(require("../../../config/logs/logger"));
const error_handler_1 = require("../../../config/errors/error_handler");
const jwt_1 = require("../../../config/jwt");
const StadisticsRouter = (0, express_1.Router)();
class StadisticsController {
    getStadistics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // recibir el cuerpo de la petición
                const payload = req.body;
                // validar que el cuerpo de la petición
                if (!payload.id_period)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                // instanciar el gateway
                const stadisticsStorageGateway = new stadistics_storage_gateway_1.StadisticsStorageGateway();
                // obtener las estadisticas
                const totalTokensAutorized = yield stadisticsStorageGateway.getTotalTokensAutorized(payload.id_period);
                const totalTokensRegistered = yield stadisticsStorageGateway.getTotalTokensRegistered(payload.id_period);
                // obtener las estadisticas por especialidad
                const stadisticsBySpeciality = yield stadisticsStorageGateway.getStadisticsBySpeciality(payload.id_period);
                for (let i = 0; i < stadisticsBySpeciality.length; i++) {
                    const total = stadisticsBySpeciality[i].payed_count + stadisticsBySpeciality[i].not_payed_count;
                    stadisticsBySpeciality[i].percentage_payed = ((stadisticsBySpeciality[i].payed_count / total) * 100) || 0;
                    stadisticsBySpeciality[i].registered_count = total;
                }
                // crear el cuerpo de la respuesta
                const body = {
                    data: {
                        total_tokens_autorized: totalTokensAutorized,
                        total_tokens_registered: totalTokensRegistered,
                        stadistics_by_speciality: stadisticsBySpeciality
                    },
                    status: 200,
                    message: 'Stadistics retrieved successfully',
                    error: false
                };
                // responder al cliente
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
exports.StadisticsController = StadisticsController;
StadisticsRouter.post('/get-stadistics', (0, jwt_1.Authenticator)(['ADMIN']), new StadisticsController().getStadistics);
exports.default = StadisticsRouter;
