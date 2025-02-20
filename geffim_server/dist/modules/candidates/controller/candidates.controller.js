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
exports.CandidatesController = void 0;
const express_1 = require("express");
const logger_1 = __importDefault(require("../../../config/logs/logger"));
const error_handler_1 = require("../../../config/errors/error_handler");
const candidates_storage_gateway_1 = require("./candidates.storage.gateway");
const random_1 = require("../../../utils/security/random");
const bcrypt_1 = require("../../../utils/security/bcrypt");
const format_date_string_1 = require("../../../utils/security/format_date_string");
const create_token_1 = require("../functions/create_token");
const create_list_1 = require("../functions/create_list");
const response_messages_1 = require("../../../utils/messages/response_messages");
const jwt_1 = require("../../../config/jwt");
const CandidatesRouter = (0, express_1.Router)();
class CandidatesController {
    registerCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la petición
                const payload = req.body;
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // Validar informacion del candidato
                if (!payload.name)
                    throw new Error('El nombre del candidato no puede estar vacío');
                if (!payload.first_last_name)
                    throw new Error('El primer apellido del candidato no puede estar vacío');
                if (!payload.curp)
                    throw new Error('La CURP del candidato no puede estar vacía');
                if (!payload.birthdate)
                    throw new Error('La fecha de nacimiento del candidato no puede estar vacía');
                if (!payload.gender)
                    throw new Error('El género del candidato no puede estar vacío');
                if (!payload.email)
                    throw new Error('El correo electrónico del candidato no puede estar vacío');
                if (!payload.phone_number)
                    throw new Error('El número de teléfono del candidato no puede estar vacío');
                if (!payload.secondary_phone_number)
                    throw new Error('El número de teléfono secundario del candidato no puede estar vacío');
                if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.name))
                    throw new Error('El nombre del candidato no es válido');
                if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.first_last_name))
                    throw new Error('El primer apellido del candidato no es válido');
                if (payload.second_last_name) {
                    if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.second_last_name))
                        throw new Error('El segundo apellido del candidato no es válido');
                }
                if (!/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(payload.curp))
                    throw new Error('La CURP del candidato no es válida');
                // validar que la edad del candidato sea mayor a 13 años
                const today = new Date();
                const birthdate = new Date(payload.birthdate);
                if (today.getFullYear() - birthdate.getFullYear() < 13)
                    throw new Error('El candidato debe ser mayor de 13 años');
                if (payload.gender !== 'M' && payload.gender !== 'F')
                    throw new Error('El género del candidato no es válido');
                if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(payload.email))
                    throw new Error('El correo electrónico del candidato no es válido');
                if (!/^(\d{10})$/.test(payload.phone_number))
                    throw new Error('El número de teléfono del candidato no es válido');
                if (payload.secondary_phone_number) {
                    if (!/^(\d{10})$/.test(payload.secondary_phone_number))
                        throw new Error('El número de teléfono secundario del candidato no es válido');
                }
                // buscar si el candidato ya realizo su registro en el periodo actual
                const candidateCount = yield candidatesStorageGateway.findCandidateByPeriod({ curp: payload.curp, id_period: payload.id_period });
                if (candidateCount > 0)
                    throw new Error('El candidato ya ha realizado su registro en el periodo actual');
                // validar la dirección del candidato
                if (!payload.candidate_postal_code)
                    throw new Error('El código postal del candidato no puede estar vacío');
                if (!payload.candidate_id_municipality)
                    throw new Error('El municipio del candidato no puede estar vacío');
                if (!payload.candidate_neighborhood)
                    throw new Error('La colonia del candidato no puede estar vacía');
                if (!payload.candidate_street_and_number)
                    throw new Error('La calle y número del candidato no puede estar vacía');
                if (!/^(\d{5})$/.test(payload.candidate_postal_code))
                    throw new Error('El código postal del candidato no es válido');
                if (/(<script)\b/g.test(payload.candidate_neighborhood))
                    throw new Error('La colonia del candidato no es válida');
                if (/(<script)\b/g.test(payload.candidate_street_and_number))
                    throw new Error('La calle y número del candidato no es válido');
                // validar la información del tutor
                if (!payload.tutor_name)
                    throw new Error('El nombre del tutor no puede estar vacío');
                if (!payload.tutor_first_last_name)
                    throw new Error('El primer apellido del tutor no puede estar vacío');
                if (!payload.tutor_phone_number)
                    throw new Error('El número de teléfono del tutor no puede estar vacío');
                if (!payload.tutor_secondary_phone_number)
                    throw new Error('El número de teléfono secundario del tutor no puede estar vacío');
                if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.tutor_name))
                    throw new Error('El nombre del tutor no es válido');
                if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.tutor_first_last_name))
                    throw new Error('El primer apellido del tutor no es válido');
                if (payload.tutor_second_last_name) {
                    if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.tutor_second_last_name))
                        throw new Error('El segundo apellido del tutor no es válido');
                }
                if (!/^(\d{10})$/.test(payload.tutor_phone_number))
                    throw new Error('El número de teléfono del tutor no es válido');
                if (payload.tutor_secondary_phone_number) {
                    if (!/^(\d{10})$/.test(payload.tutor_secondary_phone_number))
                        throw new Error('El número de teléfono secundario del tutor no es válido');
                }
                // validar la dirección del tutor si viven separados
                if (payload.tutor_live_separated) {
                    if (!payload.tutor_postal_code)
                        throw new Error('El código postal del tutor no puede estar vacío');
                    if (!payload.tutor_id_municipality)
                        throw new Error('El municipio del tutor no puede estar vacío');
                    if (!payload.tutor_neighborhood)
                        throw new Error('La colonia del tutor no puede estar vacía');
                    if (!payload.tutor_street_and_number)
                        throw new Error('La calle y número del tutor no puede estar vacía');
                    if (!/^(\d{5})$/.test(payload.tutor_postal_code))
                        throw new Error('El código postal del tutor no es válido');
                    if (/(<script)\b/g.test(payload.tutor_neighborhood))
                        throw new Error('La colonia del tutor no es válida');
                    if (/(<script)\b/g.test(payload.tutor_street_and_number))
                        throw new Error('La calle y número del tutor no es válido');
                }
                // validar la información de la escuela
                if (!payload.school_key)
                    throw new Error('La clave de la escuela no puede estar vacía');
                if (!payload.school_type)
                    throw new Error('El tipo de escuela no puede estar vacío');
                if (!payload.school_name)
                    throw new Error('El nombre de la escuela no puede estar vacío');
                if (!payload.school_id_municipality)
                    throw new Error('El municipio de la escuela no puede estar vacío');
                if (!payload.average_grade)
                    throw new Error('El promedio del candidato no puede estar vacío');
                if (!payload.scholarship_type)
                    throw new Error('El tipo de beca del candidato no puede estar vacío');
                if (!/^[A-Za-z0-9]{1,10}$/.test(payload.school_key))
                    throw new Error('La clave de la escuela no es válida');
                if (!/^(SECUNDARIA GENERAL|SECUNDARIA TECNICA|SECUNDARIA PRIVADA|TELESECUNDARIA)$/.test(payload.school_type))
                    throw new Error('El tipo de escuela no es válido');
                if (payload.average_grade < 0 || payload.average_grade > 10)
                    throw new Error('El promedio del candidato no es válido');
                if (!/^(Ninguna|Propia institución|Intercambio|Oportunidades|Continuación de estudios|Contra el abandono escolar|Desarrollo de competencias|Estudiantes con Alguna Discapacidad|Probems|Salario|Otra beca federal|Beca estatal|Beca particular|Beca internacional|Otra)$/.test(payload.scholarship_type))
                    throw new Error('El tipo de beca del candidato no es válido');
                // validar datos del periodo y especialidades
                if (!payload.id_period)
                    throw new Error('El periodo no puede estar vacío');
                if (!payload.specialities_by_period)
                    throw new Error('Las especialidades no pueden estar vacías');
                // validar que el candidato haya seleccionado 3 especialidades, que no se repitan y que esten las 3 gerarquizadas
                if (payload.specialities_by_period.length !== 3)
                    throw new Error('El candidato debe seleccionar 3 especialidades');
                const hierarchySet = new Set([1, 2, 3]);
                const specialitySet = new Set();
                for (const speciality of payload.specialities_by_period) {
                    if (!speciality.id_speciality)
                        throw new Error('La especialidad no puede estar vacía');
                    if (!speciality.hierarchy)
                        throw new Error('La jerarquía de la especialidad no puede estar vacía');
                    if (!speciality.name)
                        throw new Error('El nombre de la especialidad no puede estar vacío');
                    if (!hierarchySet.has(speciality.hierarchy))
                        throw new Error('La jerarquía de la especialidad no es válida');
                    if (specialitySet.has(speciality.id_speciality))
                        throw new Error('Las especialidades no pueden repetirse');
                    specialitySet.add(speciality.id_speciality);
                }
                // obtener el total de candidatos por especialidad en el periodo actual y los tokens permitidos
                const totalCandidates = yield candidatesStorageGateway.findTotalCandidatesByPeriodAndSpeciality({ id_period: payload.id_period, id_speciality: payload.specialities_by_period[0].id_speciality });
                const tokensAllowed = yield candidatesStorageGateway.getTokensAllowed({ id_period: payload.id_period, id_speciality: payload.specialities_by_period[0].id_speciality });
                if (totalCandidates >= tokensAllowed)
                    throw new Error('El cupo para la especialidad seleccionada ya está lleno');
                // traer el numero de su ficha
                const totalTokens = yield candidatesStorageGateway.getTotalTokens({ id_period: payload.id_period });
                const token = totalTokens + 1;
                payload.username = payload.id_period + token.toString().padStart(5, '0');
                //generar una contraseña aleatoria
                const passwordBlank = (0, random_1.randomCode)();
                payload.password = yield (0, bcrypt_1.encode)(passwordBlank);
                // registrar al candidato en el siguiente orden: dirección, candidato, direccion del tutor si aplica, tutor, escuela, especialidades
                // registrar dirección del candidato
                payload.candidate_id_address = yield candidatesStorageGateway.registerAddress({ postal_code: payload.candidate_postal_code, id_municipality: payload.candidate_id_municipality, neighborhood: payload.candidate_neighborhood, street_and_number: payload.candidate_street_and_number });
                // registrar candidato
                payload.id_candidate = yield candidatesStorageGateway.registerCandidate(payload);
                // registrar dirección del tutor si aplica
                if (payload.tutor_live_separated) {
                    payload.tutor_id_address = yield candidatesStorageGateway.registerAddress({ postal_code: payload.tutor_postal_code, id_municipality: payload.tutor_id_municipality, neighborhood: payload.tutor_neighborhood, street_and_number: payload.tutor_street_and_number });
                }
                // registrar tutor
                payload.tutor_id_tutor = yield candidatesStorageGateway.registerTutor(payload);
                // registrar escuela
                payload.id_highschool = yield candidatesStorageGateway.registerHighschoolInformation(payload);
                // registrar especialidades 
                for (const speciality of payload.specialities_by_period) {
                    const specialityByPeriod = yield candidatesStorageGateway.getSpecialitiesByPeriodAndSpeciality({ id_period: payload.id_period, id_speciality: speciality.id_speciality });
                    yield candidatesStorageGateway.registerSpecialitiesSelected({ id_candidate: payload.id_candidate, id_speciality_by_period: specialityByPeriod, herarchy: speciality.hierarchy });
                }
                // generar ficha
                //obtener los datos faltantes
                const candidate_state = yield candidatesStorageGateway.getStateByMunicipality({ id_municipality: payload.candidate_id_municipality });
                const candidate_municipality = yield candidatesStorageGateway.getMunicipalityByMunicipality({ id_municipality: payload.candidate_id_municipality });
                const tutor_state = payload.tutor_live_separated ? yield candidatesStorageGateway.getStateByMunicipality({ id_municipality: payload.tutor_id_municipality }) : '';
                const tutor_municipality = payload.tutor_live_separated ? yield candidatesStorageGateway.getMunicipalityByMunicipality({ id_municipality: payload.tutor_id_municipality }) : '';
                const school_state = yield candidatesStorageGateway.getStateByMunicipality({ id_municipality: payload.school_id_municipality });
                const school_municipality = yield candidatesStorageGateway.getMunicipalityByMunicipality({ id_municipality: payload.school_id_municipality });
                const sale_period = yield candidatesStorageGateway.getSalePeriod({ id_period: payload.id_period });
                const institutionalInformation = yield candidatesStorageGateway.getInstitutionalInformation();
                institutionalInformation.logo = `data:image/png;base64,${Buffer.from(institutionalInformation.logo).toString('base64')}`;
                const dataToDocument = {
                    logo: institutionalInformation.logo,
                    token: payload.username,
                    speciality_1: payload.specialities_by_period[0].name,
                    speciality_2: payload.specialities_by_period[1].name,
                    speciality_3: payload.specialities_by_period[2].name,
                    name: payload.name,
                    first_last_name: payload.first_last_name,
                    second_last_name: payload.second_last_name ? payload.second_last_name : '',
                    curp: payload.curp,
                    birthdate: (0, format_date_string_1.formatDate)(payload.birthdate.toString()),
                    gender: payload.gender === 'M' ? 'Masculino' : 'Femenino',
                    email: payload.email,
                    phone_number: payload.phone_number,
                    secondary_phone_number: payload.secondary_phone_number,
                    candidate_postal_code: payload.candidate_postal_code,
                    candidate_state: candidate_state,
                    candidate_municipality: candidate_municipality,
                    candidate_neighborhood: payload.candidate_neighborhood,
                    candidate_street_and_number: payload.candidate_street_and_number,
                    // tutors
                    tutor_name: payload.tutor_name,
                    tutor_first_last_name: payload.tutor_first_last_name,
                    tutor_second_last_name: payload.tutor_second_last_name ? payload.tutor_second_last_name : '',
                    tutor_live_separated: payload.tutor_live_separated,
                    tutor_phone_number: payload.tutor_phone_number,
                    tutor_secondary_phone_number: payload.tutor_secondary_phone_number,
                    // tutor address
                    tutor_postal_code: payload.tutor_live_separated ? payload.tutor_postal_code : '',
                    tutor_municipality: payload.tutor_live_separated ? tutor_municipality : '',
                    tutor_state: payload.tutor_live_separated ? tutor_state : '',
                    tutor_neighborhood: payload.tutor_live_separated ? payload.tutor_neighborhood : '',
                    tutor_street_and_number: payload.tutor_live_separated ? payload.tutor_street_and_number : '',
                    // highschool information
                    school_key: payload.school_key,
                    school_type: payload.school_type,
                    school_name: payload.school_name,
                    school_state: school_state,
                    school_municipality: school_municipality,
                    average_grade: payload.average_grade.toString(),
                    has_debts: payload.has_debts,
                    scholarship_type: payload.scholarship_type,
                    // bank information
                    bank_name: sale_period.bank_name,
                    bank_account: sale_period.bank_account,
                    bank_clabe: sale_period.bank_clabe,
                    concept: sale_period.concept,
                    amount: sale_period.amount.toString(),
                };
                // generar documento
                const document = yield (0, create_token_1.createToken)(dataToDocument);
                // generar cuerpo de respuesta
                const body = {
                    data: {
                        token_number: payload.username,
                        password: passwordBlank,
                        token: document,
                    },
                    status: 200,
                    message: 'Candidato registrado correctamente',
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    validateCurpOnPeriod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la petición
                const payload = req.body;
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // buscar si el candidato ya realizo su registro en el periodo actual
                const candidateCount = yield candidatesStorageGateway.findCandidateByPeriod({ curp: payload.curp, id_period: payload.id_period });
                if (candidateCount > 0)
                    throw new Error('El candidato ya ha realizado su registro en el periodo actual');
                const body = {
                    data: true,
                    status: 200,
                    message: 'CURP válida',
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    getCandidateByPeriodAndUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la petición
                const payload = req.body;
                // validar que el cuerpo de la petición
                if (!payload.username)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                if (!payload.id_period)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // buscar si el candidato ya realizo su registro en el periodo actual
                const candidate = yield candidatesStorageGateway.findCandidateByPeriodAndUser({ username: payload.username, id_period: payload.id_period });
                if (!candidate)
                    throw new Error('No se encontró al candidato');
                const body = {
                    data: candidate,
                    status: 200,
                    message: 'el candidato fue encontrado',
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    registerPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la petición
                const payload = req.body;
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // validar que el cuerpo de la petición
                if (!payload.username)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                // buscar si el candidato ya realizo su registro en el periodo actual
                yield candidatesStorageGateway.registerPayment({ username: payload.username, payed: payload.payed });
                const body = {
                    data: true,
                    status: 200,
                    message: 'Pago registrado correctamente',
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    generateList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la petición
                const payload = req.body;
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // validar que el cuerpo de la petición
                if (!payload.id_period)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                // buscar los candidatos para la lista
                const candidates = yield candidatesStorageGateway.findCandidateToList({ id_period: payload.id_period });
                const institutionalInformation = yield candidatesStorageGateway.getInstitutionalInformation();
                const logo = `data:image/png;base64,${Buffer.from(institutionalInformation.logo).toString('base64')}`;
                const today = new Date();
                const payload_to_document = {
                    logo: logo,
                    candidates: candidates,
                    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
                };
                const document = yield (0, create_list_1.generateList)(payload_to_document);
                // generar cuerpo de respuesta
                const body = {
                    data: document,
                    status: 200,
                    message: 'Lista generada correctamente',
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    // PARA EL MODULO DE CANDIDATOS
    getCandidatesPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la petición
                const params = req.query;
                const payload = req.body;
                const page = parseInt(params.page);
                const limit = parseInt(params.limit);
                // calcular el offset
                const offset = (page - 1) * limit;
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                //obtener el total de candidatos
                const total = yield candidatesStorageGateway.getTotalCandidatesBySearch(payload);
                // obtener los candidatos
                const candidates = yield candidatesStorageGateway.getCandidatesPaginated({ limit, offset, value: payload.value });
                for (const candidate of candidates) {
                    candidate.password = '';
                }
                // generar cuerpo de respuesta
                const body = {
                    data: {
                        content: candidates,
                        page: page,
                        limit: limit,
                        total: total
                    },
                    status: 200,
                    message: 'Candidatos obtenidos correctamente',
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    getCandidateToEdit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la petición
                const payload = req.body;
                if (!payload.id_candidate)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // traer la información del candidato
                const candidateInfo = yield candidatesStorageGateway.getCandidateById(payload);
                // traer la información de la dirección del candidato
                const candidateAddress = yield candidatesStorageGateway.getAddressesById({ id_address: candidateInfo.id_address });
                // traer la información del tutor
                const tutorInfo = yield candidatesStorageGateway.getTutorById({ id_candidate: candidateInfo.id_candidate });
                // traer la información de la dirección del tutor si aplica
                if (tutorInfo.live_separated) {
                    tutorInfo.tutor_address = yield candidatesStorageGateway.getAddressesById({ id_address: tutorInfo.id_address });
                }
                else {
                    tutorInfo.tutor_address = {
                        id_address: 0,
                        postal_code: '',
                        id_state: 0,
                        id_municipality: 0,
                        neighborhood: '',
                        street_and_number: ''
                    };
                }
                // traer la información de la escuela
                const schoolInfo = yield candidatesStorageGateway.getHighschoolInformationById({ id_candidate: candidateInfo.id_candidate });
                // traer la información de las especialidades
                const specialities = yield candidatesStorageGateway.getSpecialitiesSelectedById({ id_candidate: candidateInfo.id_candidate });
                // traer el estado del periodo
                const sale_period = yield candidatesStorageGateway.checkIfPeriodIsActiveByIdCandidate({ id_candidate: candidateInfo.id_candidate });
                const CompleteInfo = {
                    status: sale_period,
                    candidate_info: candidateInfo,
                    address_info: candidateAddress,
                    tutor_info: tutorInfo,
                    school_info: schoolInfo,
                    speciality_selected: specialities
                };
                // generar cuerpo de respuesta
                const body = {
                    data: CompleteInfo,
                    status: 200,
                    message: 'Candidato obtenido correctamente',
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    editCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                if (!payload.id_candidate)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                if (!payload.name)
                    throw new Error('El nombre del candidato no puede estar vacío');
                if (!payload.first_last_name)
                    throw new Error('El primer apellido del candidato no puede estar vacío');
                if (!payload.curp)
                    throw new Error('La CURP del candidato no puede estar vacía');
                if (!payload.birthdate)
                    throw new Error('La fecha de nacimiento del candidato no puede estar vacía');
                if (!payload.gender)
                    throw new Error('El género del candidato no puede estar vacío');
                if (!payload.email)
                    throw new Error('El correo electrónico del candidato no puede estar vacío');
                if (!payload.phone_number)
                    throw new Error('El número de teléfono del candidato no puede estar vacío');
                if (!payload.secondary_phone_number)
                    throw new Error('El número de teléfono secundario del candidato no puede estar vacío');
                if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.name))
                    throw new Error('El nombre del candidato no es válido');
                if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.first_last_name))
                    throw new Error('El primer apellido del candidato no es válido');
                if (payload.second_last_name) {
                    if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.second_last_name))
                        throw new Error('El segundo apellido del candidato no es válido');
                }
                if (!/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(payload.curp))
                    throw new Error('La CURP del candidato no es válida');
                // validar que la edad del candidato sea mayor a 13 años
                const today = new Date();
                const birthdate = new Date(payload.birthdate);
                if (today.getFullYear() - birthdate.getFullYear() < 13)
                    throw new Error('El candidato debe ser mayor de 13 años');
                if (payload.gender !== 'M' && payload.gender !== 'F')
                    throw new Error('El género del candidato no es válido');
                if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(payload.email))
                    throw new Error('El correo electrónico del candidato no es válido');
                if (!/^(\d{10})$/.test(payload.phone_number))
                    throw new Error('El número de teléfono del candidato no es válido');
                if (payload.secondary_phone_number) {
                    if (!/^(\d{10})$/.test(payload.secondary_phone_number))
                        throw new Error('El número de teléfono secundario del candidato no es válido');
                }
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // actualizar la información del candidato
                yield candidatesStorageGateway.updateCandidate(payload);
                // crear cuerpo de respuesta
                const body = {
                    data: true,
                    status: 200,
                    message: 'Candidato actualizado correctamente',
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    editCandidateAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                if (!payload.id_address)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                if (!payload.postal_code)
                    throw new Error('El código postal del candidato no puede estar vacío');
                if (!payload.id_municipality)
                    throw new Error('El municipio del candidato no puede estar vacío');
                if (!payload.neighborhood)
                    throw new Error('La colonia del candidato no puede estar vacía');
                if (!payload.street_and_number)
                    throw new Error('La calle y número del candidato no puede estar vacía');
                if (!/^(\d{5})$/.test(payload.postal_code))
                    throw new Error('El código postal del candidato no es válido');
                if (/(<script)\b/g.test(payload.neighborhood))
                    throw new Error('La colonia del candidato no es válida');
                if (/(<script)\b/g.test(payload.street_and_number))
                    throw new Error('La calle y número del candidato no es válido');
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // actualizar la dirección del candidato
                yield candidatesStorageGateway.updateAddress(payload);
                // crear cuerpo de respuesta
                const body = {
                    data: true,
                    status: 200,
                    message: 'Dirección del candidato actualizada correctamente',
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    editTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                if (!payload.id_tutor)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                if (!payload.name)
                    throw new Error('El nombre del tutor no puede estar vacío');
                if (!payload.first_last_name)
                    throw new Error('El primer apellido del tutor no puede estar vacío');
                if (!payload.phone_number)
                    throw new Error('El número de teléfono del tutor no puede estar vacío');
                if (!payload.secondary_phone_number)
                    throw new Error('El número de teléfono secundario del tutor no puede estar vacío');
                if (!/^(\d{10})$/.test(payload.phone_number))
                    throw new Error('El número de teléfono del tutor no es válido');
                if (payload.secondary_phone_number) {
                    if (!/^(\d{10})$/.test(payload.secondary_phone_number))
                        throw new Error('El número de teléfono secundario del tutor no es válido');
                }
                // validar la dirección del tutor si viven separados
                if (payload.live_separated) {
                    if (!payload.tutor_address.postal_code)
                        throw new Error('El código postal del tutor no puede estar vacío');
                    if (!payload.tutor_address.id_municipality)
                        throw new Error('El municipio del tutor no puede estar vacío');
                    if (!payload.tutor_address.neighborhood)
                        throw new Error('La colonia del tutor no puede estar vacía');
                    if (!payload.tutor_address.street_and_number)
                        throw new Error('La calle y número del tutor no puede estar vacía');
                    if (!/^(\d{5})$/.test(payload.tutor_address.postal_code))
                        throw new Error('El código postal del tutor no es válido');
                    if (/(<script)\b/g.test(payload.tutor_address.neighborhood))
                        throw new Error('La colonia del tutor no es válida');
                    if (/(<script)\b/g.test(payload.tutor_address.street_and_number))
                        throw new Error('La calle y número del tutor no es válido');
                }
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // buscar si el tutor tiene una dirección registrada
                const tutorAddress = yield candidatesStorageGateway.getAddressesById({ id_address: payload.tutor_address.id_address });
                // si el tutor tiene una dirección registrada y ya no vive separado, se elimina la dirección
                if (tutorAddress && !payload.live_separated) {
                    payload.id_address = 0;
                    yield candidatesStorageGateway.updateTutor(payload);
                    yield candidatesStorageGateway.deleteAddressById({ id_address: tutorAddress.id_address });
                }
                // si el tutor no tiene una dirección registrada y vive separado, se registra la dirección
                if (!tutorAddress && payload.live_separated) {
                    payload.id_address = yield candidatesStorageGateway.registerAddress(payload.tutor_address);
                    yield candidatesStorageGateway.updateTutor(payload);
                }
                // si el tutor tiene una dirección registrada y vive separado, se actualiza la dirección
                if (tutorAddress && payload.live_separated) {
                    yield candidatesStorageGateway.updateAddress(payload.tutor_address);
                    yield candidatesStorageGateway.updateTutor(payload);
                }
                // si el tutor no tiene una dirección registrada y no vive separado, se actualiza el tutor
                if (!tutorAddress && !payload.live_separated) {
                    yield candidatesStorageGateway.updateTutor(payload);
                }
                // crear cuerpo de respuesta
                const body = {
                    data: true,
                    status: 200,
                    message: 'Tutor actualizado correctamente',
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    editHighschoolInformation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                if (!payload.id_highschool)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                if (!payload.school_key)
                    throw new Error('La clave de la escuela no puede estar vacía');
                if (!payload.school_type)
                    throw new Error('El tipo de escuela no puede estar vacío');
                if (!payload.school_name)
                    throw new Error('El nombre de la escuela no puede estar vacío');
                if (!payload.average_grade)
                    throw new Error('El promedio del candidato no puede estar vacío');
                if (!payload.scholarship_type)
                    throw new Error('El tipo de beca del candidato no puede estar vacío');
                if (!/^[A-Za-z0-9]{1,10}$/.test(payload.school_key))
                    throw new Error('La clave de la escuela no es válida');
                if (!/^(SECUNDARIA GENERAL|SECUNDARIA TECNICA|SECUNDARIA PRIVADA|TELESECUNDARIA)$/.test(payload.school_type))
                    throw new Error('El tipo de escuela no es válido');
                if (payload.average_grade < 0 || payload.average_grade > 10)
                    throw new Error('El promedio del candidato no es válido');
                if (!/^(Ninguna|Propia institución|Intercambio|Oportunidades|Continuación de estudios|Contra el abandono escolar|Desarrollo de competencias|Estudiantes con Alguna Discapacidad|Probems|Salario|Otra beca federal|Beca estatal|Beca particular|Beca internacional|Otra)$/.test(payload.scholarship_type))
                    throw new Error('El tipo de beca del candidato no es válido');
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // actualizar la información de la escuela
                yield candidatesStorageGateway.updateHighschoolInformation(payload);
                // crear cuerpo de respuesta
                const body = {
                    data: true,
                    status: 200,
                    message: 'Información de la escuela actualizada correctamente',
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
    editSpecialitiesSelected(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                // empezar bucle para validar las especialidades
                const hierarchySet = new Set([1, 2, 3]);
                const specialitySet = new Set();
                for (const speciality of payload.specialities_by_period) {
                    if (!speciality.id_speciality)
                        throw new Error('La especialidad no puede estar vacía');
                    if (!speciality.herarchy)
                        throw new Error('La jerarquía de la especialidad no puede estar vacía');
                    if (!hierarchySet.has(speciality.herarchy))
                        throw new Error('La jerarquía de la especialidad no es válida');
                    if (specialitySet.has(speciality.id_speciality))
                        throw new Error('Las especialidades no pueden repetirse');
                    specialitySet.add(speciality.id_speciality);
                }
                // instanciar el gateway
                const candidatesStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // actualizar las especialidades
                for (const speciality of payload.specialities_by_period) {
                    const specialityByPeriod = yield candidatesStorageGateway.getSpecialitiesByPeriodAndSpeciality({ id_period: payload.id_period, id_speciality: speciality.id_speciality });
                    // si la herarquia es 1, verificar que no hay mas candidatos de los tokens permitidos
                    if (speciality.herarchy === 1) {
                        const totalCandidates = yield candidatesStorageGateway.findTotalCandidatesByPeriodAndSpeciality({ id_period: payload.id_period, id_speciality: speciality.id_speciality });
                        const tokensAllowed = yield candidatesStorageGateway.getTokensAllowed({ id_period: payload.id_period, id_speciality: speciality.id_speciality });
                        if (totalCandidates >= tokensAllowed)
                            throw new Error('El cupo para la especialidad seleccionada ya está lleno');
                    }
                    yield candidatesStorageGateway.updateSpecialitiesSelected({ id_selected_speciality: speciality.id_selected_speciality, id_speciality_by_period: specialityByPeriod });
                }
                // crear cuerpo de respuesta
                const body = {
                    data: true,
                    status: 200,
                    message: 'Especialidades actualizadas correctamente',
                    error: false
                };
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
exports.CandidatesController = CandidatesController;
//guest
CandidatesRouter.post('/register-candidate', new CandidatesController().registerCandidate);
CandidatesRouter.post('/validate-curp-on-period', new CandidatesController().validateCurpOnPeriod);
//admin
CandidatesRouter.post('/get-candidate-by-period-and-user', (0, jwt_1.Authenticator)(['ADMIN']), new CandidatesController().getCandidateByPeriodAndUser);
CandidatesRouter.post('/register-payment', (0, jwt_1.Authenticator)(['ADMIN']), new CandidatesController().registerPayment);
CandidatesRouter.post('/generate-list', (0, jwt_1.Authenticator)(['ADMIN']), new CandidatesController().generateList);
CandidatesRouter.post('/get-candidates-page', (0, jwt_1.Authenticator)(['ADMIN']), new CandidatesController().getCandidatesPage);
CandidatesRouter.post('/get-candidate-to-edit', (0, jwt_1.Authenticator)(['ADMIN']), new CandidatesController().getCandidateToEdit);
CandidatesRouter.post('/edit-candidate', (0, jwt_1.Authenticator)(['ADMIN']), new CandidatesController().editCandidate);
CandidatesRouter.post('/edit-candidate-address', (0, jwt_1.Authenticator)(['ADMIN']), new CandidatesController().editCandidateAddress);
CandidatesRouter.post('/edit-tutor', (0, jwt_1.Authenticator)(['ADMIN']), new CandidatesController().editTutor);
CandidatesRouter.post('/edit-highschool-information', (0, jwt_1.Authenticator)(['ADMIN']), new CandidatesController().editHighschoolInformation);
CandidatesRouter.post('/edit-specialities-selected', (0, jwt_1.Authenticator)(['ADMIN']), new CandidatesController().editSpecialitiesSelected);
exports.default = CandidatesRouter;
