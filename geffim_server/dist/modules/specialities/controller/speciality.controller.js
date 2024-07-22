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
const regex_1 = require("../../../utils/regex/regex");
const response_messages_1 = require("../../../utils/messages/response_messages");
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
        this.registerSpeciality = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                // validar el cuerpo de la peticion
                if (!payload.name)
                    throw new Error('El nombre de la especialidad es obligatorio');
                if (!regex_1.text_with_spaces.test(payload.name))
                    throw new Error('El nombre de la especialidad no es valido');
                if (!payload.acronym)
                    throw new Error('El acronimo de la especialidad es obligatorio');
                if (payload.acronym.length > 7)
                    throw new Error('El acronimo no puede tener mas de 7 caracteres');
                // instanciar el gateway
                const StorageGateway = new speciality_storage_gateway_1.SpecialityStorageGateway();
                // verificar si la especialidad ya existe
                const speciality = yield StorageGateway.getSpecialityByName(payload.name);
                if (speciality.length > 0)
                    throw new Error('El nombre de la especialidad ya existe');
                // verificar si el acronimo ya existe
                const specialityAcronym = yield StorageGateway.getSpecialityByAcronym(payload.acronym);
                if (specialityAcronym.length > 0)
                    throw new Error('El acronimo ya existe');
                // registrar la especialidad
                yield StorageGateway.registerSpeciality(payload);
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'Speciality registered successfully',
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
        this.updateSpeciality = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                // validar el cuerpo de la peticion
                if (!payload.name)
                    throw new Error('El nombre de la especialidad es obligatorio');
                if (!payload.acronym)
                    throw new Error('El acronimo de la especialidad es obligatorio');
                if (payload.acronym.length > 7)
                    throw new Error('El acronimo no puede tener mas de 7 caracteres');
                if (!payload.id_speciality)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                // instanciar el gateway
                const StorageGateway = new speciality_storage_gateway_1.SpecialityStorageGateway();
                // verificar si la especialidad ya existe
                const speciality = yield StorageGateway.getSpecialityByNameWithId({ name: payload.name, id_speciality: payload.id_speciality });
                if (speciality.length > 0)
                    throw new Error('El nombre de la especialidad ya existe');
                // verificar si el acronimo ya existe
                const specialityAcronym = yield StorageGateway.getSpecialityByAcronymWithId({ acronym: payload.acronym, id_speciality: payload.id_speciality });
                if (specialityAcronym.length > 0)
                    throw new Error('El acronimo ya existe');
                // actualizar la especialidad
                yield StorageGateway.updateSpeciality(payload);
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'Speciality updated successfully',
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
        this.changeStatusSpeciality = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                // validar el cuerpo de la peticion
                if (!payload.id_speciality)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                // instanciar el gateway
                const StorageGateway = new speciality_storage_gateway_1.SpecialityStorageGateway();
                // traer la especialidad
                const speciality = yield StorageGateway.getSpecialityById(payload.id_speciality);
                speciality.status = !speciality.status;
                // actualizar la especialidad
                yield StorageGateway.updateSpecialityStatus(speciality);
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'Speciality status updated successfully',
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
        this.getAllSpecialities = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // instanciar el gateway
                const StorageGateway = new speciality_storage_gateway_1.SpecialityStorageGateway();
                // obtener las especialidades
                const specialities = yield StorageGateway.getAllSpecialities();
                const specialitiesActive = specialities.filter(speciality => speciality.status);
                const specialitiesInactive = specialities.filter(speciality => !speciality.status);
                // crear el cuerpo de la respuesta
                const body = {
                    data: {
                        specialitiesActive,
                        specialitiesInactive
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
SpecialityRouter.post('/register-speciality', new SpecialityController().registerSpeciality);
SpecialityRouter.post('/update-speciality', new SpecialityController().updateSpeciality);
SpecialityRouter.post('/change-status-speciality', new SpecialityController().changeStatusSpeciality);
SpecialityRouter.get('/get-all-specialities', new SpecialityController().getAllSpecialities);
exports.default = SpecialityRouter;
