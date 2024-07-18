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
                }
                // validar la contraseña
                if (!(yield (0, bcrypt_1.compare)(payload.password, password)))
                    throw new Error('Usuario o contraseña incorrectos');
                // generar el token
                authenticated.token = (0, jwt_1.generateToken)(authenticated);
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
}
exports.AuthController = AuthController;
