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
const jwt_1 = require("../../../config/jwt");
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
                for (let i = 0; i < salePeriods.length; i++) {
                    salePeriods[i].start_date_string = `${salePeriods[i].start_date.getDate()}/${salePeriods[i].start_date.getMonth() + 1}/${salePeriods[i].start_date.getFullYear()}`;
                    salePeriods[i].end_date_string = `${salePeriods[i].end_date.getDate()}/${salePeriods[i].end_date.getMonth() + 1}/${salePeriods[i].end_date.getFullYear()}`;
                }
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
                // validar datos de la cuenta bancaria
                if (!payload.bank_name)
                    throw new Error('El nombre del banco es obligatorio');
                if (!payload.bank_account)
                    throw new Error('El numero de cuenta es obligatorio');
                if (!payload.bank_clabe)
                    throw new Error('El numero de clabe es obligatorio');
                if (!payload.concept)
                    throw new Error('El concepto es obligatorio');
                if (!payload.amount || payload.amount <= 0)
                    throw new Error('El monto debe ser un numero positivo');
                // que la cuenta bancaria y la clabe sean numericas
                if (isNaN(Number(payload.bank_account)))
                    throw new Error('El numero de cuenta debe ser numerico');
                if (isNaN(Number(payload.bank_clabe)))
                    throw new Error('El numero de clabe debe ser numerico');
                for (const speciality of payload.speciality_by_period) {
                    if (!speciality.id_speciality)
                        throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                    if (speciality.tokens_allowed <= 0 || !Number.isInteger(speciality.tokens_allowed))
                        throw new Error('Las fichas permitidas deben ser un número entero positivo');
                    // validar que la especialidad exista
                    const specialityGateway = new speciality_storage_gateway_1.SpecialityStorageGateway();
                    const existSpeciality = yield specialityGateway.getSpecialityById(speciality.id_speciality);
                    if (!existSpeciality)
                        throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                }
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
                const StorageGateway = new sale_period_storage_gateway_1.SalePeriodStorageGateway();
                // validar que el rango de fechas no se cruce con otro rango de fechas
                const totalSalePeriodsCrossing = yield StorageGateway.getTotalSalePeriodsCrossing({ start_date: payload.start_date, end_date: payload.end_date });
                if (totalSalePeriodsCrossing > 0)
                    throw new Error('El rango de fechas se cruza con otro rango de fechas');
                // registrar el periodo de venta
                const id_period = yield StorageGateway.registerSalePeriod(payload);
                // registrar las especialidades y sus fichas permitidas
                for (const speciality of payload.speciality_by_period) {
                    // registrar la especialidad con sus fichas permitidas
                    yield StorageGateway.registerSpecialityBySalePeriod({ id_period: id_period, id_speciality: speciality.id_speciality, tokens_allowed: speciality.tokens_allowed });
                }
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'Sale period registered successfully',
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
    updateSalePeriod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                if (!payload.id_period)
                    throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                // validar el cuerpo de la peticion
                if (!payload.start_date || !payload.end_date)
                    throw new Error('La fecha de inicio y la fecha de fin son obligatorias');
                // validar datos de la cuenta bancaria
                if (!payload.bank_name)
                    throw new Error('El nombre del banco es obligatorio');
                if (!payload.bank_account)
                    throw new Error('El numero de cuenta es obligatorio');
                if (!payload.bank_clabe)
                    throw new Error('El numero de clabe es obligatorio');
                if (!payload.concept)
                    throw new Error('El concepto es obligatorio');
                if (!payload.amount || payload.amount <= 0)
                    throw new Error('El monto debe ser un numero positivo');
                // que la cuenta bancaria y la clabe sean numericas
                if (isNaN(Number(payload.bank_account)))
                    throw new Error('El numero de cuenta debe ser numerico');
                if (isNaN(Number(payload.bank_clabe)))
                    throw new Error('El numero de clabe debe ser numerico');
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
                const StorageGateway = new sale_period_storage_gateway_1.SalePeriodStorageGateway();
                // validar que el rango de fechas no se cruce con otro rango de fechas
                const totalSalePeriodsCrossing = yield StorageGateway.getTotalSalePeriodsCrossing({ start_date: payload.start_date, end_date: payload.end_date, id_period: payload.id_period });
                if (totalSalePeriodsCrossing > 0)
                    throw new Error('El rango de fechas se cruza con otro rango de fechas');
                // validar que el periodo no sea cancelado o finalizado
                const salePeriod = yield StorageGateway.getSalePeriodById({ id_period: payload.id_period });
                if (!salePeriod)
                    throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                if (salePeriod[0].status === 'canceled' || salePeriod[0].status === 'finalized')
                    throw new Error('El periodo de venta no se puede actualizar');
                // actualizar el periodo de venta
                yield StorageGateway.updateSalePeriod(payload);
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'Sale period updated successfully',
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
    changeStatusSalePeriod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                if (!payload.id_period)
                    throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                if (!payload.status)
                    throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                const StorageGateway = new sale_period_storage_gateway_1.SalePeriodStorageGateway();
                const salePeriod = yield StorageGateway.getSalePeriodById({ id_period: payload.id_period });
                // si el periodo de venta no existe
                if (!salePeriod)
                    throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                // si el periodo de venta ya esta activo el estado tiene que ser finalizado
                if (salePeriod[0].status === 'active' && payload.status !== 'finalized')
                    throw new Error('El estado del periodo de venta debe ser finalizado');
                // si el periodo esta pendiente el estado tiene que ser cancelado
                if (salePeriod[0].status === 'pending' && payload.status !== 'canceled')
                    throw new Error('El estado del periodo de venta debe ser cancelado');
                // si el periodo ya esta finalizado no se puede cambiar el estado
                if (salePeriod[0].status === 'finalized' || salePeriod[0].status === 'canceled')
                    throw new Error('El estado del periodo de venta no se puede cambiar');
                // cambiar el estado del periodo de venta
                yield StorageGateway.changeStatusSalePeriod(payload);
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'Sale period status changed successfully',
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
    updateTokensAllowed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                // validar el cuerpo de la peticion
                if (!payload.id_period)
                    throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                // instanciar el gateway
                const StorageGateway = new sale_period_storage_gateway_1.SalePeriodStorageGateway();
                for (const speciality of payload.speciality_by_period) {
                    if (!speciality.id_speciality || !Number.isInteger(speciality.tokens_allowed))
                        throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                    if (speciality.tokens_allowed <= 0)
                        throw new Error('Las fichas permitidas deben ser un número entero positivo');
                    // validar que la especialidad exista
                    const specialityGateway = new speciality_storage_gateway_1.SpecialityStorageGateway();
                    const existSpeciality = yield specialityGateway.getSpecialityById(speciality.id_speciality);
                    if (!existSpeciality)
                        throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                    // validar que el periodo de venta exista
                    const existSalePeriod = yield StorageGateway.getSalePeriodById({ id_period: payload.id_period });
                    if (!existSalePeriod)
                        throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                    // validar que la especialidad este registrada en el periodo de venta
                    const existSpecialityByPeriod = yield StorageGateway.existSpecialityBySalePeriod({ id_period: payload.id_period, id_speciality: speciality.id_speciality });
                    if (existSpecialityByPeriod) {
                        // actualizar las fichas permitidas
                        yield StorageGateway.updateTokensAllowed({ id_speciality_by_period: existSpecialityByPeriod.id_speciality_by_period, tokens_allowed: speciality.tokens_allowed });
                    }
                    else {
                        // registrar la especialidad con sus fichas permitidas
                        yield StorageGateway.registerSpecialityBySalePeriod({ id_period: payload.id_period, id_speciality: speciality.id_speciality, tokens_allowed: speciality.tokens_allowed });
                    }
                }
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'Tokens allowed updated successfully',
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
    autoChangeStatusSalePeriod(___, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // desactivar el periodo de venta que ya paso y activar el periodo de venta que ya inicia
                const StorageGateway = new sale_period_storage_gateway_1.SalePeriodStorageGateway();
                const today = new Date();
                yield StorageGateway.finalizeSalePeriod({ today: today });
                yield StorageGateway.updateNewActiveSpeciality({ today: today });
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'Sale period status changed successfully',
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
    getCurrentPeriod(___, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // instanciar el gateway
                const StorageGateway = new sale_period_storage_gateway_1.SalePeriodStorageGateway();
                // obtener la fecha actual
                const today = new Date();
                // obtener el periodo de venta actual
                const currentSalePeriod = yield StorageGateway.getCurrrentSalePeriod({ today: today });
                if (!currentSalePeriod)
                    throw new Error('No hay periodo de venta activo');
                // verificar si aun hay fichas disponibles
                const specialities_oferted = yield StorageGateway.getTotalTokens();
                //filtrar las especialidades que aun tienen fichas disponibles
                const specialities = specialities_oferted.filter(speciality => speciality.saled < speciality.tokens_allowed);
                // filtrar las especialidades que ya no tienen fichas disponibles
                const specialities_saled = specialities_oferted.filter(speciality => speciality.saled === speciality.tokens_allowed);
                if (specialities.length === 0)
                    throw new Error('No hay fichas disponibles');
                // crear el cuerpo de la respuesta
                const body = {
                    data: {
                        currentSalePeriod: currentSalePeriod.id_period,
                        start_date: `${currentSalePeriod.start_date.getDate()}/${currentSalePeriod.start_date.getMonth() + 1}/${currentSalePeriod.start_date.getFullYear()}`,
                        end_date: `${currentSalePeriod.end_date.getDate()}/${currentSalePeriod.end_date.getMonth() + 1}/${currentSalePeriod.end_date.getFullYear()}`,
                        specialities: specialities.map(speciality => { return { id_speciality: speciality.id_speciality, name: speciality.name }; }),
                        specialities_saled: specialities_saled.map(speciality => { return { id_speciality: speciality.id_speciality, name: speciality.name }; }),
                    },
                    message: 'Current sale period fetched successfully',
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
    getSpecialitiesBySalePeriod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener los parametros de la peticion
                const payload = req.body;
                // validar los parametros de la peticion
                if (!payload.id_period)
                    throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
                // instanciar el gateway
                const StorageGateway = new sale_period_storage_gateway_1.SalePeriodStorageGateway();
                // obtener las especialidades del periodo de venta
                const specialities = yield StorageGateway.getSpecialityBySalePeriod({ id_period: payload.id_period });
                // crear el cuerpo de la respuesta
                const body = {
                    data: specialities,
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
exports.SalePeriodController = SalePeriodController;
SalePeriodRouter.get('/get-sale-period-page', (0, jwt_1.Authenticator)(['ADMIN']), new SalePeriodController().getSalePeriodsPage);
SalePeriodRouter.post('/register-sale-period', (0, jwt_1.Authenticator)(['ADMIN']), new SalePeriodController().registerSalePeriod);
SalePeriodRouter.post('/update-sale-period', (0, jwt_1.Authenticator)(['ADMIN']), new SalePeriodController().updateSalePeriod);
SalePeriodRouter.post('/change-status-sale-period', (0, jwt_1.Authenticator)(['ADMIN']), new SalePeriodController().changeStatusSalePeriod);
SalePeriodRouter.post('/get-specialities-by-sale-period', (0, jwt_1.Authenticator)(['ADMIN']), new SalePeriodController().getSpecialitiesBySalePeriod);
SalePeriodRouter.post('/update-tokens-allowed', (0, jwt_1.Authenticator)(['ADMIN']), new SalePeriodController().updateTokensAllowed);
//guest
SalePeriodRouter.post('/auto-change-status-sale-period', new SalePeriodController().autoChangeStatusSalePeriod);
SalePeriodRouter.get('/get-current-period', new SalePeriodController().getCurrentPeriod);
exports.default = SalePeriodRouter;
