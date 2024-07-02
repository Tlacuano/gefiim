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
exports.SalePeriodController = void 0;
const express_1 = require("express");
const logger_1 = __importDefault(require("../../../config/logs/logger"));
const error_handler_1 = require("../../../config/errors/error_handler");
const sale_period_storage_gateway_1 = require("./sale_period.storage.gateway");
const response_messages_1 = require("../../../utils/messages/response_messages");
const speciality_storage_gateway_1 = require("../../../modules/specialities/controller/speciality.storage.gateway");
const SalePeriodRouter = (0, express_1.Router)();
class SalePeriodController {
    getSalePeriodsPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener los parametros y el cuerpo de la peticion
                const params = req.query;
                //validar los parametros y el cuerpo de la peticion
                const page = parseInt(params.page);
                const limit = parseInt(params.limit);
                // calcular el offset
                const offset = (page - 1) * limit;
                // instanciar el gateway
                const StorageGateway = new sale_period_storage_gateway_1.SalePeriodStorageGateway();
                // obtener el total de periodos de venta y los periodos de venta paginados
                const totalSalePeriods = yield StorageGateway.getTotalSalePeriods();
                const salePeriods = yield StorageGateway.getSalePeriodsPaginated({ limit: limit, offset: offset });
                // crear el cuerpo de la respuesta
                const body = {
                    data: {
                        content: salePeriods,
                        page: page,
                        limit: limit,
                        total: totalSalePeriods
                    },
                    message: 'Sale periods fetched successfully',
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
    registerSalePeriod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                // validar el cuerpo de la peticion
                if (!payload.start_date || !payload.end_date)
                    throw new Error('La fecha de inicio y la fecha de fin son obligatorias');
                // validar que la fecha de inicio sea menor a la fecha de fin
                if (payload.start_date >= payload.end_date)
                    throw new Error('La fecha de inicio debe ser menor a la fecha de fin');
                const StorageGateway = new sale_period_storage_gateway_1.SalePeriodStorageGateway();
                // validar que el rango de fechas no se cruce con otro rango de fechas
                const totalSalePeriodsCrossing = yield StorageGateway.getTotalSalePeriodsCrossing({ start_date: payload.start_date, end_date: payload.end_date });
                if (totalSalePeriodsCrossing > 0)
                    throw new Error('El rango de fechas se cruza con otro rango de fechas');
                const today = new Date();
                let status = 'pending';
                // verificar si el rango de fechas esta activo
                if (today >= payload.start_date && today <= payload.end_date)
                    console.log('El rango de fechas esta activo', today);
                status = 'active';
                // verificar si el rango de fechas ya paso
                if (today > payload.end_date)
                    throw new Error('La fecha de inicio debe ser mayor a la fecha actual');
                payload.status = status;
                // registrar el periodo de venta
                const id_period = yield StorageGateway.registerSalePeriod(payload);
                // registrar las especialidades y sus fichas permitidas
                payload.speciality_by_period.forEach((speciality) => __awaiter(this, void 0, void 0, function* () {
                    if (!speciality.id_speciality)
                        throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                    if (speciality.tokens_allowed <= 0 || !Number.isInteger(speciality.tokens_allowed))
                        throw new Error('Las fichas permitidas deben ser un numero entero positivo');
                    // validar que la especialidad exista
                    const specialityGateway = new speciality_storage_gateway_1.SpecialityStorageGateway();
                    const existSpeciality = yield specialityGateway.getSpecialityById(speciality.id_speciality);
                    if (!existSpeciality)
                        throw new Error('La especialidad no existe');
                    // registrar la especialidad con sus fichas permitidas
                    yield StorageGateway.registerSpecialityBySalePeriod({ id_period: id_period, id_speciality: speciality.id_speciality, tokens_allowed: speciality.tokens_allowed });
                }));
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'Sale period registered successfully',
                    status: 200,
                    error: false
                };
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
}
exports.SalePeriodController = SalePeriodController;
SalePeriodRouter.get('/get-sale-period-page', new SalePeriodController().getSalePeriodsPage);
SalePeriodRouter.post('/register-sale-period', new SalePeriodController().registerSalePeriod);
exports.default = SalePeriodRouter;
