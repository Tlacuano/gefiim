import { Router, Request, Response } from "express";
import logger from "../../../config/logs/logger";
import { validateError } from "../../../config/errors/error_handler";
import { UserStorageGateway } from "./user.storage.gateway";
import { Pagination, ResponseApi } from "../../../kernel/types";
import { User } from "../model/user";
import { compare, encode } from "../../../utils/security/bcrypt";
import { MESSAGES } from "../../../utils/messages/response_messages";
import { requestChangePasswordDto } from "./dto/request_change_password.dto";
import { Authenticator } from "../../../config/jwt";

const UserRouter = Router();

export class UserController {
    async getPagedUsers(req:Request, res:Response){
        try {
            const params = req.query as any;

            const page = parseInt(params.page);
            const limit = parseInt(params.limit);
            // calcular el offset
            const offset = (page - 1) * limit;

            // instanciar el gateway
            const StorageGateway = new UserStorageGateway();

            // obtener el total de usuarios y los usuarios paginados
            const totalUsers = await StorageGateway.getTotalUsers();
            const users = await StorageGateway.getUsersPaginated({limit: limit, offset: offset});

            for (let i = 0; i < users.length; i++) {
                users[i].password = '';
                users[i].verification_code = '';
            }

            // crear el cuerpo de la respuesta
            const body : ResponseApi<Pagination<User[]>> = {
                data: {
                    content: users,
                    page: page,
                    limit: limit,
                    total: totalUsers
                },
                message: 'Users fetched successfully',
                status: 200,
                error: false
            }

            // enviar la respuesta
            res.status(200).json(body);

        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);
        }
    }

    async registerUser(req:Request, res:Response){
        try {
            // obtener el cuerpo de la peticion
            const payload = req.body as User;

            if(!payload.username)
                throw new Error('El nombre de usuario no puede estar vacío');
            if(!payload.password)
                throw new Error('La contraseña no puede estar vacía');
            if(!payload.email)
                throw new Error('El email no puede estar vacío');

            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(payload.email))
                throw new Error('El email no tiene un formato válido');
            if(payload.username.length > 50)
                throw new Error('El nombre de usuario no puede tener más de 50 caracteres');
            if(payload.username.length < 5)
                throw new Error('El nombre de usuario no puede tener menos de 5 caracteres');

            if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(payload.password))
                throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');


            if (/^\d+$/.test(payload.username))
                throw new Error('El nombre de usuario no puede ser solo números');

            payload.password = await encode(payload.password);

            // instanciar el gateway
            const StorageGateway = new UserStorageGateway();

            // verificar si el usuario ya existe
            const user = await StorageGateway.getUserByUsername(payload.username);

            if(user.length > 0)
                throw new Error('El nombre de usuario ya existe');

            // registrar el usuario
            await StorageGateway.registerUser(payload);

            // crear el cuerpo de la respuesta
            const body : ResponseApi<User> = {
                data: payload,
                message: 'User registered successfully',
                status: 200,
                error: false
            }

            // enviar la respuesta
            res.status(200).json(body);

        }catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);
        }
    }

    async updateUser(req:Request, res:Response){
        try {
            // obtener el cuerpo de la peticion
            const payload = req.body as User;

            if(!payload.username)
                throw new Error('El nombre de usuario no puede estar vacío');
            if(!payload.email)
                throw new Error('El email no puede estar vacío');
            if(!payload.password)
                throw new Error('Se necesita la contraseña para actualizar el usuario');

            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(payload.email))
                throw new Error('El email no tiene un formato válido');
            if(payload.username.length > 50)
                throw new Error('El nombre de usuario no puede tener más de 50 caracteres');
            if(payload.username.length < 5)
                throw new Error('El nombre de usuario no puede tener menos de 5 caracteres');

            if(!payload.id_admin)
                throw new Error(MESSAGES.BAD_REQUEST.DEFAULT);

            if (/^\d+$/.test(payload.username))
                throw new Error('El nombre de usuario no puede ser solo números');


            // buscar el usuario
            const StorageGateway = new UserStorageGateway();

            const user = await StorageGateway.getUserById(payload.id_admin);

            if(user.length === 0)
                throw new Error('El usuario no existe');

            // verificar la contraseña
            if(!await compare(payload.password, user[0].password))
                throw new Error('La contraseña es incorrecta');

            // actualizar el usuario
            await StorageGateway.updateUser(payload);

            // crear el cuerpo de la respuesta
            const body : ResponseApi<boolean> = {
                data: true,
                message: 'User updated successfully',
                status: 200,
                error: false
            }

            // enviar la respuesta
            res.status(200).json(body);
            
        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);            
        }
    }

    async changeStatusUser(req:Request, res:Response){
        try {
            // obtener el cuerpo de la peticion
            const payload = req.body as User;

            if(!payload.id_admin)
                throw new Error(MESSAGES.BAD_REQUEST.DEFAULT);

            // instanciar el gateway
            const StorageGateway = new UserStorageGateway();

            // buscar el usuario
            const user = await StorageGateway.getUserByUsername(payload.username);

            if(user.length === 0)
                throw new Error('El usuario no existe');
            
            // traer el total de usuarios activos
            const totalUsersActive = await StorageGateway.getCountUsersActive();

            // no puede haber menos de dos usuarios activos
            if(totalUsersActive === 1 && user[0].status)
                throw new Error('No se puede desactivar el último usuario activo');


            // actualizar el usuario
            await StorageGateway.changeStatus(payload);

            // crear el cuerpo de la respuesta
            const body : ResponseApi<boolean> = {
                data: true,
                message: 'User status updated successfully',
                status: 200,
                error: false
            }

            // enviar la respuesta
            res.status(200).json(body);

        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);
        }
    }

    async changePassowrd(req:Request, res:Response){
        try {
            // obtener el cuerpo de la peticion
            const payload = req.body as requestChangePasswordDto;

            if(!payload.id_admin)
                throw new Error(MESSAGES.BAD_REQUEST.DEFAULT);
            if(!payload.new_password)
                throw new Error('La nueva contraseña no puede estar vacía');
            if(!payload.password)
                throw new Error('La contraseña actual no puede estar vacía');

            if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(payload.new_password))
                throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');

            // instanciar el gateway
            const StorageGateway = new UserStorageGateway();

            // buscar el usuario
            const user = await StorageGateway.getUserById(payload.id_admin);

            if(user.length === 0)
                throw new Error('El usuario no existe');

            // verificar la contraseña
            if(!await compare(payload.password, user[0].password))
                throw new Error('La contraseña actual es incorrecta');

            // encriptar la nueva contraseña
            const new_password = await encode(payload.new_password);

            // actualizar la contraseña
            await StorageGateway.changePassword({id_admin: payload.id_admin, password: new_password});

            // crear el cuerpo de la respuesta
            const body : ResponseApi<boolean> = {
                data: true,
                message: 'Password updated successfully',
                status: 200,
                error: false
            }

            // enviar la respuesta
            res.status(200).json(body);
            
        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);            
        }
    }

}

// admin
UserRouter.get('/get-page-user', Authenticator(['ADMIN']), new UserController().getPagedUsers);
UserRouter.post('/register-user', Authenticator(['ADMIN']), new UserController().registerUser);
UserRouter.post('/update-user', Authenticator(['ADMIN']), new UserController().updateUser);
UserRouter.post('/change-status-user', Authenticator(['ADMIN']), new UserController().changeStatusUser);
UserRouter.post('/change-password', Authenticator(['ADMIN']), new UserController().changePassowrd);



export default UserRouter;

