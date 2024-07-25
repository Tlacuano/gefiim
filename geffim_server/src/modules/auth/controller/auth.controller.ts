import { Router, Request, Response } from "express";
import logger from "../../../config/logs/logger";
import { validateError } from "../../../config/errors/error_handler";
import { RequestToAuth } from "../model/requestToAuth";
import { AuthStorageGateway } from "./auth.storage.gateway";
import { ResponseAuthenticated } from "../model/responseAuthenticated";
import { generateToken } from "../../../config/jwt";
import { compare, encode } from "../../../utils/security/bcrypt";
import { ResponseApi } from "../../../kernel/types";
import { CandidatesStorageGateway } from "../../candidates/controller/candidates.storage.gateway";
import { requestToGenarateTokenDTO } from "../../candidates/controller/dtos/request_to_generatte_token.dto";
import { createToken } from "../../candidates/functions/create_token";
import { randomCode } from "../../../utils/security/random";
import { sendEmail } from "../../../utils/nodemailer/nodemailer";

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

                // validar que el candidato sea del periodo actual
            }            

            // validar la contraseña
            if(!await compare(payload.password, password))
                throw new Error('Usuario o contraseña incorrectos');

            // generar el token
            authenticated.token = generateToken(authenticated);

            // si es candidato, traer la informacion del candidato
            if(authenticated.role === 'CANDIDATE'){
                
                const document = await AuthController.generateToken(candidate.id_candidate);
                authenticated.document = document;
            }

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

    // recover password
    async getUserbyUsername(req:Request, res:Response){
        try {
            const payload = req.body as RequestToAuth;

            if(!payload.username)
                throw new Error('El email no puede estar vacío');


            const authStorageGateway = new AuthStorageGateway();


            const candidate = await authStorageGateway.findUserOnCandidateTable(payload);
            const admin = await authStorageGateway.findUserOnAdminTable(payload);

            if(!candidate && !admin)
                throw new Error('Usuario no encontrado');

            const code = randomCode();

            if(candidate){
                // actualizar el codigo de verificacion
                await authStorageGateway.setVerificationCodeCandidate({username: candidate.username, code});
                await sendEmail(candidate.email, 'Recuperación de contraseña','Recuperación de contraseña', 'Su código de recuperación es:', code);
            }

            if(admin){
                // actualizar el codigo de verificacion
                await authStorageGateway.setVerificationCodeAdmin({username: admin.username, code});
                await sendEmail(admin.email, 'Recuperación de contraseña','Recuperación de contraseña', 'Su código de recuperación es:', code);
            }

            
            const body: ResponseApi<boolean> = {
                data: true,
                status: 200,
                message: 'Verification code sent successfully',
                error: false
            };

            res.status(200).json(body);

        } catch (error) {
            logger.error(error)

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);            
        }
    }

    async checkVerificationCode(req:Request, res:Response){
        try {
            const payload = req.body as {username: string, code: string};

            if(!payload.username)
                throw new Error('El email no puede estar vacío');
            if(!payload.code)
                throw new Error('El código de verificación no puede estar vacío');


            const authStorageGateway = new AuthStorageGateway();

            const candidate = await authStorageGateway.findUserOnCandidateTable({ username: payload.username } as RequestToAuth);
            const admin = await authStorageGateway.findUserOnAdminTable({ username: payload.username } as RequestToAuth);

            if (!candidate && !admin)
                throw new Error('Usuario no encontrado');

            let verificationCode: string | null = null;
            if (candidate) {
                verificationCode = candidate.verification_code;
            } else if (admin) {
                verificationCode = admin.verification_code;
            }

            if (verificationCode !== payload.code) {
                throw new Error('Código de verificación incorrecto');
            }

            const body: ResponseApi<boolean> = {
                data: true,
                status: 200,
                message: 'Código de verificación válido',
                error: false
            };

            res.status(200).json(body);

        } catch (error) {
            logger.error(error)

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);
        }
    }

    async changePassword(req:Request, res:Response){
        try {
            const payload = req.body as { username: string, newPassword: string };
    
            if (!payload.username)
                throw new Error('El nombre de usuario no puede estar vacío');
            if (!payload.newPassword)
                throw new Error('La nueva contraseña no puede estar vacía');
            if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(payload.newPassword))
                throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
    
            const authStorageGateway = new AuthStorageGateway();
    
            // Verificar si el usuario es un candidato o un administrador
            const candidate = await authStorageGateway.findUserOnCandidateTable({ username: payload.username } as RequestToAuth);
            const admin = await authStorageGateway.findUserOnAdminTable({ username: payload.username } as RequestToAuth);
    
            if (!candidate && !admin)
                throw new Error('Usuario no encontrado');
    
            // Cifrar la nueva contraseña
            const hashedPassword = await encode(payload.newPassword);
    
            // Actualizar la contraseña dependiendo del tipo de usuario
            if (candidate) {
                await authStorageGateway.updatePasswordCandidate(payload.username, hashedPassword);
            } else if (admin) {
                await authStorageGateway.updatePasswordAdmin(payload.username, hashedPassword);
            }
    
            const body: ResponseApi<boolean> = {
                data: true,
                status: 200,
                message: 'Contraseña actualizada correctamente',
                error: false
            };
    
            res.status(200).json(body);
        } catch (error) {
            logger.error(error);
    
            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);
        }
    }


    // generar token
    static async generateToken(id_candidate: number){
        try {
            const candidateStorageGateway = new CandidatesStorageGateway();
            // traer la informacion del candidato
            const candidate = await candidateStorageGateway.getCandidateById({id_candidate});
            // traer la direccion del candidato
            const address = await candidateStorageGateway.getAddressesById({id_address: candidate.id_address});
            // traer la informacion del tutor
            const tutor = await candidateStorageGateway.getTutorById({id_candidate : candidate.id_candidate});
            // traer la informacion de la escuela
            const school = await candidateStorageGateway.getHighschoolInformationById({id_candidate : candidate.id_candidate});
            // traer las especialidades seleccionadas
            const specialities = await candidateStorageGateway.getSpecialitiesSelectedById({id_candidate : candidate.id_candidate});
            // traer la informacion institucional
            const institutional = await candidateStorageGateway.getInstitutionalInformation()
            institutional.logo = `data:image/png;base64,${Buffer.from(institutional.logo as Buffer).toString('base64')}`;

            
            const candidate_state = await candidateStorageGateway.getStateByMunicipality({ id_municipality: address.id_municipality });
            const candidate_municipality = await candidateStorageGateway.getMunicipalityByMunicipality({ id_municipality: address.id_municipality });
            
            const tutor_state = tutor.id_address ? await candidateStorageGateway.getStateByMunicipality({ id_municipality: tutor.tutor_address.id_municipality }) : '';
            const tutor_municipality = tutor.id_address ? await candidateStorageGateway.getMunicipalityByMunicipality({ id_municipality: tutor.tutor_address.id_municipality }) : '';
            
            const school_state = await candidateStorageGateway.getStateByMunicipality({ id_municipality: school.id_municipality });
            const school_municipality = await candidateStorageGateway.getMunicipalityByMunicipality({ id_municipality: school.id_municipality  });

            const get_id_period = await candidateStorageGateway.getPeriodByIdCandidate({ id_candidate: candidate.id_candidate });
            const sale_period = await candidateStorageGateway.getSalePeriod({ id_period: get_id_period });

            const dataToDocument: requestToGenarateTokenDTO = {
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
            }

            const document = await createToken(dataToDocument);

            return document;
            
        } catch (error) {
            throw error;
        }
    }
}


AuthRouter.post('/login', new AuthController().login);
AuthRouter.post('/send-code', new AuthController().getUserbyUsername);
AuthRouter.post('/check-code', new AuthController().checkVerificationCode);
AuthRouter.post('/change-password', new AuthController().changePassword);

export default AuthRouter;