import { Router, Request, Response } from "express";
import logger from "../../../config/logs/logger";
import { validateError } from "../../../config/errors/error_handler";
import { RequestToAuth } from "../model/requestToAuth";
import { AuthStorageGateway } from "./auth.storage.gateway";
import { ResponseAuthenticated } from "../model/responseAuthenticated";
import { generateToken } from "../../../config/jwt";
import { compare } from "../../../utils/security/bcrypt";
import { ResponseApi } from "../../../kernel/types";

const AuthRouter = Router()

export class AuthController {
    async login (req: Request, res: Response){
        try {
            // recibir el cuerpo de la petición
            const payload = req.body as RequestToAuth;

            // validar que el cuerpo de la petición
            if(!payload.username)
                throw new Error('El email no puede estar vacío');
            if(!payload.password)
                throw new Error('La contraseña no puede estar vacía');

            // instanciar el gateway
            const authStorageGateway = new AuthStorageGateway();

            // buscar en la tabla de candidatos y admin
            const candidate = await authStorageGateway.findUserOnCandidateTable(payload);
            const admin = await authStorageGateway.findUserOnAdminTable(payload);


            // validar si el usuario existe
            if(!candidate && !admin)
                throw new Error('Usuario o contraseña incorrectos');


            let password = '';
            const authenticated: ResponseAuthenticated = {
                username : '',
                role: '',
                token : ''
            }
        
            if(admin){
                authenticated.role = 'ADMIN'
                authenticated.username = admin.username
                password = admin.password
            }else{
                authenticated.role = 'CANDIDATE'
                authenticated.username = candidate.username
                password = candidate.password
            }            

            // validar la contraseña
            if(!await compare(payload.password, password))
                throw new Error('Usuario o contraseña incorrectos');

            // generar el token
            authenticated.token = generateToken(authenticated);

            // responder al cliente
            const body: ResponseApi<ResponseAuthenticated> = {
                data: authenticated,
                status: 200,
                message: 'Authenticated successfully',
                error: false
            };

            res.status(200).json(body);
            
        } catch (error) {
            logger.error(error)
            
            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody); 
        }
    }
    
}