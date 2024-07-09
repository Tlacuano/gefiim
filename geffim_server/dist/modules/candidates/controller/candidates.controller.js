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
                if (/^(?!.*<script\b).*$/g.test(payload.candidate_neighborhood))
                    throw new Error('La colonia del candidato no es válida');
                if (/^(?!.*<script\b).*$/g.test(payload.candidate_street_and_number))
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
                    if (/^(?!.*<script\b).*$/g.test(payload.tutor_neighborhood))
                        throw new Error('La colonia del tutor no es válida');
                    if (/^(?!.*<script\b).*$/g.test(payload.tutor_street_and_number))
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
                if (/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s,-]+$/g.test(payload.school_name))
                    throw new Error('El nombre de la escuela no es válido');
                if (payload.average_grade < 0 || payload.average_grade > 10)
                    throw new Error('El promedio del candidato no es válido');
                if (!/^(Ninguna|Propia institución|Intercambio|Oportunidades|Continuación de estudios|Contra el abandono escolar|Desarrollo de competencias|Estudiantes con Alguna Discapacidad|Probems|Salario|Otra beca federal|Beca estatal|Beca particular|Beca internacional|Otra)$/.test(payload.scholarship_type))
                    throw new Error('El tipo de beca del candidato no es válido');
                // obtener el total de candidatos por especialidad en el periodo actual y los tokens permitidos
                const totalCandidates = yield candidatesStorageGateway.findTotalCandidatesByPeriodAndSpeciality({ id_period: payload.id_period, id_speciality: payload.specialities_by_period[0].id_speciality });
                const tokensAllowed = yield candidatesStorageGateway.getTokensAllowed({ id_period: payload.id_period, id_speciality: payload.specialities_by_period[0].id_speciality });
                if (totalCandidates >= tokensAllowed)
                    throw new Error('El cupo para la especialidad seleccionada ya está lleno');
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
