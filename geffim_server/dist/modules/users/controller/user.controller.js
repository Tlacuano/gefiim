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
exports.UserController = void 0;
const express_1 = require("express");
const logger_1 = __importDefault(require("../../../config/logs/logger"));
const error_handler_1 = require("../../../config/errors/error_handler");
const user_storage_gateway_1 = require("./user.storage.gateway");
const bcrypt_1 = require("../../../utils/security/bcrypt");
const response_messages_1 = require("../../../utils/messages/response_messages");
const jwt_1 = require("../../../config/jwt");
const UserRouter = (0, express_1.Router)();
class UserController {
    getPagedUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = req.query;
                const page = parseInt(params.page);
                const limit = parseInt(params.limit);
                // calcular el offset
                const offset = (page - 1) * limit;
                // instanciar el gateway
                const StorageGateway = new user_storage_gateway_1.UserStorageGateway();
                // obtener el total de usuarios y los usuarios paginados
                const totalUsers = yield StorageGateway.getTotalUsers();
                const users = yield StorageGateway.getUsersPaginated({ limit: limit, offset: offset });
                for (let i = 0; i < users.length; i++) {
                    users[i].password = '';
                    users[i].verification_code = '';
                }
                // crear el cuerpo de la respuesta
                const body = {
                    data: {
                        content: users,
                        page: page,
                        limit: limit,
                        total: totalUsers
                    },
                    message: 'Users fetched successfully',
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
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                if (!payload.username)
                    throw new Error('El nombre de usuario no puede estar vacío');
                if (!payload.password)
                    throw new Error('La contraseña no puede estar vacía');
                if (!payload.email)
                    throw new Error('El email no puede estar vacío');
                if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(payload.email))
                    throw new Error('El email no tiene un formato válido');
                if (payload.username.length > 50)
                    throw new Error('El nombre de usuario no puede tener más de 50 caracteres');
                if (payload.username.length < 5)
                    throw new Error('El nombre de usuario no puede tener menos de 5 caracteres');
                if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(payload.password))
                    throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
                if (/^\d+$/.test(payload.username))
                    throw new Error('El nombre de usuario no puede ser solo números');
                payload.password = yield (0, bcrypt_1.encode)(payload.password);
                // instanciar el gateway
                const StorageGateway = new user_storage_gateway_1.UserStorageGateway();
                // verificar si el usuario ya existe
                const user = yield StorageGateway.getUserByUsername(payload.username);
                if (user.length > 0)
                    throw new Error('El nombre de usuario ya existe');
                // registrar el usuario
                yield StorageGateway.registerUser(payload);
                // crear el cuerpo de la respuesta
                const body = {
                    data: payload,
                    message: 'User registered successfully',
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
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                if (!payload.username)
                    throw new Error('El nombre de usuario no puede estar vacío');
                if (!payload.email)
                    throw new Error('El email no puede estar vacío');
                if (!payload.password)
                    throw new Error('Se necesita la contraseña para actualizar el usuario');
                if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(payload.email))
                    throw new Error('El email no tiene un formato válido');
                if (payload.username.length > 50)
                    throw new Error('El nombre de usuario no puede tener más de 50 caracteres');
                if (payload.username.length < 5)
                    throw new Error('El nombre de usuario no puede tener menos de 5 caracteres');
                if (!payload.id_admin)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                if (/^\d+$/.test(payload.username))
                    throw new Error('El nombre de usuario no puede ser solo números');
                // buscar el usuario
                const StorageGateway = new user_storage_gateway_1.UserStorageGateway();
                const user = yield StorageGateway.getUserById(payload.id_admin);
                if (user.length === 0)
                    throw new Error('El usuario no existe');
                // verificar la contraseña
                if (!(yield (0, bcrypt_1.compare)(payload.password, user[0].password)))
                    throw new Error('La contraseña es incorrecta');
                // actualizar el usuario
                yield StorageGateway.updateUser(payload);
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'User updated successfully',
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
    changeStatusUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                if (!payload.id_admin)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                // instanciar el gateway
                const StorageGateway = new user_storage_gateway_1.UserStorageGateway();
                // buscar el usuario
                const user = yield StorageGateway.getUserByUsername(payload.username);
                if (user.length === 0)
                    throw new Error('El usuario no existe');
                // traer el total de usuarios activos
                const totalUsersActive = yield StorageGateway.getCountUsersActive();
                // no puede haber menos de dos usuarios activos
                if (totalUsersActive === 1 && user[0].status)
                    throw new Error('No se puede desactivar el último usuario activo');
                // actualizar el usuario
                yield StorageGateway.changeStatus(payload);
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'User status updated successfully',
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
    changePassowrd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // obtener el cuerpo de la peticion
                const payload = req.body;
                if (!payload.id_admin)
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                if (!payload.new_password)
                    throw new Error('La nueva contraseña no puede estar vacía');
                if (!payload.password)
                    throw new Error('La contraseña actual no puede estar vacía');
                if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(payload.new_password))
                    throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
                // instanciar el gateway
                const StorageGateway = new user_storage_gateway_1.UserStorageGateway();
                // buscar el usuario
                const user = yield StorageGateway.getUserById(payload.id_admin);
                if (user.length === 0)
                    throw new Error('El usuario no existe');
                // verificar la contraseña
                if (!(yield (0, bcrypt_1.compare)(payload.password, user[0].password)))
                    throw new Error('La contraseña actual es incorrecta');
                // encriptar la nueva contraseña
                const new_password = yield (0, bcrypt_1.encode)(payload.new_password);
                // actualizar la contraseña
                yield StorageGateway.changePassword({ id_admin: payload.id_admin, password: new_password });
                // crear el cuerpo de la respuesta
                const body = {
                    data: true,
                    message: 'Password updated successfully',
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
exports.UserController = UserController;
// admin
UserRouter.get('/get-page-user', (0, jwt_1.Authenticator)(['ADMIN']), new UserController().getPagedUsers);
UserRouter.post('/register-user', (0, jwt_1.Authenticator)(['ADMIN']), new UserController().registerUser);
UserRouter.post('/update-user', (0, jwt_1.Authenticator)(['ADMIN']), new UserController().updateUser);
UserRouter.post('/change-status-user', (0, jwt_1.Authenticator)(['ADMIN']), new UserController().changeStatusUser);
UserRouter.post('/change-password', (0, jwt_1.Authenticator)(['ADMIN']), new UserController().changePassowrd);
exports.default = UserRouter;
