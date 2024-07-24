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
exports.AuthController = void 0;
const express_1 = require("express");
const logger_1 = __importDefault(require("../../../config/logs/logger"));
const error_handler_1 = require("../../../config/errors/error_handler");
const auth_storage_gateway_1 = require("./auth.storage.gateway");
const jwt_1 = require("../../../config/jwt");
const bcrypt_1 = require("../../../utils/security/bcrypt");
const candidates_storage_gateway_1 = require("../../candidates/controller/candidates.storage.gateway");
const create_token_1 = require("../../candidates/functions/create_token");
const AuthRouter = (0, express_1.Router)();
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // recibir el cuerpo de la petición
                const payload = req.body;
                // validar que el cuerpo de la petición
                if (!payload.username)
                    throw new Error('El email no puede estar vacío');
                if (!payload.password)
                    throw new Error('La contraseña no puede estar vacía');
                // instanciar el gateway
                const authStorageGateway = new auth_storage_gateway_1.AuthStorageGateway();
                // buscar en la tabla de candidatos y admin
                const candidate = yield authStorageGateway.findUserOnCandidateTable(payload);
                const admin = yield authStorageGateway.findUserOnAdminTable(payload);
                // validar si el usuario existe
                if (!candidate && !admin)
                    throw new Error('Usuario o contraseña incorrectos');
                let password = '';
                const authenticated = {
                    username: '',
                    role: '',
                    token: ''
                };
                if (admin) {
                    authenticated.role = 'ADMIN';
                    authenticated.username = admin.username;
                    password = admin.password;
                }
                else {
                    authenticated.role = 'CANDIDATE';
                    authenticated.username = candidate.username;
                    password = candidate.password;
                    // validar que el candidato sea del periodo actual
                }
                // validar la contraseña
                if (!(yield (0, bcrypt_1.compare)(payload.password, password)))
                    throw new Error('Usuario o contraseña incorrectos');
                // generar el token
                authenticated.token = (0, jwt_1.generateToken)(authenticated);
                // si es candidato, traer la informacion del candidato
                if (authenticated.role === 'CANDIDATE') {
                    const document = yield AuthController.generateToken(candidate.id_candidate);
                    authenticated.document = document;
                }
                // responder al cliente
                const body = {
                    data: authenticated,
                    status: 200,
                    message: 'Authenticated successfully',
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
    // recover password
    getUserbyUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    checkVerificationCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    // generar token
    static generateToken(id_candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidateStorageGateway = new candidates_storage_gateway_1.CandidatesStorageGateway();
                // traer la informacion del candidato
                const candidate = yield candidateStorageGateway.getCandidateById({ id_candidate });
                // traer la direccion del candidato
                const address = yield candidateStorageGateway.getAddressesById({ id_address: candidate.id_address });
                // traer la informacion del tutor
                const tutor = yield candidateStorageGateway.getTutorById({ id_candidate: candidate.id_candidate });
                // traer la informacion de la escuela
                const school = yield candidateStorageGateway.getHighschoolInformationById({ id_candidate: candidate.id_candidate });
                // traer las especialidades seleccionadas
                const specialities = yield candidateStorageGateway.getSpecialitiesSelectedById({ id_candidate: candidate.id_candidate });
                // traer la informacion institucional
                const institutional = yield candidateStorageGateway.getInstitutionalInformation();
                institutional.logo = `data:image/png;base64,${Buffer.from(institutional.logo).toString('base64')}`;
                const candidate_state = yield candidateStorageGateway.getStateByMunicipality({ id_municipality: address.id_municipality });
                const candidate_municipality = yield candidateStorageGateway.getMunicipalityByMunicipality({ id_municipality: address.id_municipality });
                const tutor_state = tutor.id_address ? yield candidateStorageGateway.getStateByMunicipality({ id_municipality: tutor.tutor_address.id_municipality }) : '';
                const tutor_municipality = tutor.id_address ? yield candidateStorageGateway.getMunicipalityByMunicipality({ id_municipality: tutor.tutor_address.id_municipality }) : '';
                const school_state = yield candidateStorageGateway.getStateByMunicipality({ id_municipality: school.id_municipality });
                const school_municipality = yield candidateStorageGateway.getMunicipalityByMunicipality({ id_municipality: school.id_municipality });
                const get_id_period = yield candidateStorageGateway.getPeriodByIdCandidate({ id_candidate: candidate.id_candidate });
                const sale_period = yield candidateStorageGateway.getSalePeriod({ id_period: get_id_period });
                const dataToDocument = {
                    logo: institutional.logo,
                    token: candidate.username,
                    speciality_1: specialities[0].name,
                    speciality_2: specialities[1].name,
                    speciality_3: specialities[2].name,
                    name: candidate.name,
                    first_last_name: candidate.first_last_name,
                    second_last_name: candidate.second_last_name ? candidate.second_last_name : '',
                    curp: candidate.curp,
                    birthdate: candidate.birthdate,
                    gender: candidate.gender === 'M' ? 'Masculino' : 'Femenino',
                    email: candidate.email,
                    phone_number: candidate.phone_number,
                    secondary_phone_number: candidate.secondary_phone_number,
                    candidate_postal_code: address.postal_code,
                    candidate_state: candidate_state,
                    candidate_municipality: candidate_municipality,
                    candidate_neighborhood: address.neighborhood,
                    candidate_street_and_number: address.street_and_number,
                    // tutors
                    tutor_name: tutor.name,
                    tutor_first_last_name: tutor.first_last_name,
                    tutor_second_last_name: tutor.second_last_name ? tutor.second_last_name : '',
                    tutor_live_separated: tutor.live_separated,
                    tutor_phone_number: tutor.phone_number,
                    tutor_secondary_phone_number: tutor.secondary_phone_number,
                    // tutor address
                    tutor_postal_code: tutor.live_separated ? tutor.tutor_address.postal_code : '',
                    tutor_municipality: tutor.live_separated ? tutor_municipality : '',
                    tutor_state: tutor.live_separated ? tutor_state : '',
                    tutor_neighborhood: tutor.live_separated ? tutor.tutor_address.neighborhood : '',
                    tutor_street_and_number: tutor.live_separated ? tutor.tutor_address.street_and_number : '',
                    // highschool information
                    school_key: school.school_key,
                    school_type: school.school_type,
                    school_name: school.school_name,
                    school_state: school_state,
                    school_municipality: school_municipality,
                    average_grade: school.average_grade.toString(),
                    has_debts: school.has_debts,
                    scholarship_type: school.scholarship_type,
                    // bank information
                    bank_name: sale_period.bank_name,
                    bank_account: sale_period.bank_account,
                    bank_clabe: sale_period.bank_clabe,
                    concept: sale_period.concept,
                    amount: sale_period.amount.toString(),
                };
                const document = yield (0, create_token_1.createToken)(dataToDocument);
                return document;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AuthController = AuthController;
AuthRouter.post('/login', new AuthController().login);
exports.default = AuthRouter;
