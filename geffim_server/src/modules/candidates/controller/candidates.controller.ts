import { Router, Request, Response } from "express"
import logger from "../../../config/logs/logger"
import { validateError } from "../../../config/errors/error_handler";
import { Candidate } from "../model/candidates";
import { CandidatesStorageGateway } from "./candidates.storage.gateway";
import { randomCode } from "../../../utils/security/random";
import { encode } from "../../../utils/security/bcrypt";
import { requestToGenarateTokenDTO } from "./dtos/request_to_generatte_token.dto";
import { formatDate } from "../../../utils/security/format_date_string";
import { createToken } from "../functions/create_token";
import { ResponseApi } from "../../../kernel/types";
import { registerCandidateRequestDto } from "./dtos/response_register_candidate.dto";

const CandidatesRouter = Router();

export class CandidatesController {
    async registerCandidate (req: Request, res: Response) {
        try {
            // obtener el cuerpo de la petición
            const payload = req.body as Candidate;

            // instanciar el gateway
            const candidatesStorageGateway = new CandidatesStorageGateway();


            // Validar informacion del candidato
            if(!payload.name)
                throw new Error('El nombre del candidato no puede estar vacío');
            if(!payload.first_last_name)
                throw new Error('El primer apellido del candidato no puede estar vacío');
            if(!payload.curp)
                throw new Error('La CURP del candidato no puede estar vacía');
            if(!payload.birthdate)
                throw new Error('La fecha de nacimiento del candidato no puede estar vacía');
            if(!payload.gender)
                throw new Error('El género del candidato no puede estar vacío');
            if(!payload.email)
                throw new Error('El correo electrónico del candidato no puede estar vacío');
            if(!payload.phone_number)
                throw new Error('El número de teléfono del candidato no puede estar vacío');
            if(!payload.secondary_phone_number)
                throw new Error('El número de teléfono secundario del candidato no puede estar vacío');
            
            if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.name))
                throw new Error('El nombre del candidato no es válido');
            if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.first_last_name))
                throw new Error('El primer apellido del candidato no es válido');
            if(payload.second_last_name){
                if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.second_last_name))
                    throw new Error('El segundo apellido del candidato no es válido');
            }

            if(!/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(payload.curp))
                throw new Error('La CURP del candidato no es válida');


            // validar que la edad del candidato sea mayor a 13 años
            const today = new Date();
            const birthdate = new Date(payload.birthdate);

            if(today.getFullYear() - birthdate.getFullYear() < 13)
                throw new Error('El candidato debe ser mayor de 13 años');

            if(payload.gender !== 'M' && payload.gender !== 'F')
                throw new Error('El género del candidato no es válido');
            
            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(payload.email))
                throw new Error('El correo electrónico del candidato no es válido');

            if(!/^(\d{10})$/.test(payload.phone_number))
                throw new Error('El número de teléfono del candidato no es válido');
            if(payload.secondary_phone_number){
                if(!/^(\d{10})$/.test(payload.secondary_phone_number))
                    throw new Error('El número de teléfono secundario del candidato no es válido');
            }
            
            // buscar si el candidato ya realizo su registro en el periodo actual
            const candidateCount = await candidatesStorageGateway.findCandidateByPeriod({ curp: payload.curp, id_period: payload.id_period });

            if(candidateCount > 0)
                throw new Error('El candidato ya ha realizado su registro en el periodo actual');
            

            // validar la dirección del candidato
            if(!payload.candidate_postal_code)
                throw new Error('El código postal del candidato no puede estar vacío');
            if(!payload.candidate_id_municipality)
                throw new Error('El municipio del candidato no puede estar vacío');
            if(!payload.candidate_neighborhood)
                throw new Error('La colonia del candidato no puede estar vacía');
            if(!payload.candidate_street_and_number)
                throw new Error('La calle y número del candidato no puede estar vacía');

            if(!/^(\d{5})$/.test(payload.candidate_postal_code))
                throw new Error('El código postal del candidato no es válido');
            if(/(<script)\b/g.test(payload.candidate_neighborhood))
                throw new Error('La colonia del candidato no es válida');
            if(/(<script)\b/g.test(payload.candidate_street_and_number))
                throw new Error('La calle y número del candidato no es válido');


            // validar la información del tutor
            if(!payload.tutor_name)
                throw new Error('El nombre del tutor no puede estar vacío');
            if(!payload.tutor_first_last_name)
                throw new Error('El primer apellido del tutor no puede estar vacío');
            if(!payload.tutor_phone_number)
                throw new Error('El número de teléfono del tutor no puede estar vacío');
            if(!payload.tutor_secondary_phone_number)
                throw new Error('El número de teléfono secundario del tutor no puede estar vacío');

            if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.tutor_name))
                throw new Error('El nombre del tutor no es válido');
            if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.tutor_first_last_name))
                throw new Error('El primer apellido del tutor no es válido');
            if(payload.tutor_second_last_name){
                if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(payload.tutor_second_last_name))
                    throw new Error('El segundo apellido del tutor no es válido');
            }


            if(!/^(\d{10})$/.test(payload.tutor_phone_number))
                throw new Error('El número de teléfono del tutor no es válido');
            if(payload.tutor_secondary_phone_number){
                if(!/^(\d{10})$/.test(payload.tutor_secondary_phone_number))
                    throw new Error('El número de teléfono secundario del tutor no es válido');
            }

            // validar la dirección del tutor si viven separados
            if(payload.tutor_live_separated){
                if(!payload.tutor_postal_code)
                    throw new Error('El código postal del tutor no puede estar vacío');
                if(!payload.tutor_id_municipality)
                    throw new Error('El municipio del tutor no puede estar vacío');
                if(!payload.tutor_neighborhood)
                    throw new Error('La colonia del tutor no puede estar vacía');
                if(!payload.tutor_street_and_number)
                    throw new Error('La calle y número del tutor no puede estar vacía');

                if(!/^(\d{5})$/.test(payload.tutor_postal_code))
                    throw new Error('El código postal del tutor no es válido');
                if(/(<script)\b/g.test(payload.tutor_neighborhood))
                    throw new Error('La colonia del tutor no es válida');
                if(/(<script)\b/g.test(payload.tutor_street_and_number))
                    throw new Error('La calle y número del tutor no es válido');
            }

            // validar la información de la escuela
            if(!payload.school_key)
                throw new Error('La clave de la escuela no puede estar vacía');
            if(!payload.school_type)
                throw new Error('El tipo de escuela no puede estar vacío');
            if(!payload.school_name)
                throw new Error('El nombre de la escuela no puede estar vacío');
            if(!payload.school_id_municipality)
                throw new Error('El municipio de la escuela no puede estar vacío');
            if(!payload.average_grade)
                throw new Error('El promedio del candidato no puede estar vacío');
            if(!payload.scholarship_type)
                throw new Error('El tipo de beca del candidato no puede estar vacío');

            if(!/^[A-Za-z0-9]{1,10}$/.test(payload.school_key))
                throw new Error('La clave de la escuela no es válida');
            if(!/^(SECUNDARIA GENERAL|SECUNDARIA TECNICA|SECUNDARIA PRIVADA|TELESECUNDARIA)$/.test(payload.school_type))
                throw new Error('El tipo de escuela no es válido');
            if(payload.average_grade < 0 || payload.average_grade > 10)
                throw new Error('El promedio del candidato no es válido');
            if(!/^(Ninguna|Propia institución|Intercambio|Oportunidades|Continuación de estudios|Contra el abandono escolar|Desarrollo de competencias|Estudiantes con Alguna Discapacidad|Probems|Salario|Otra beca federal|Beca estatal|Beca particular|Beca internacional|Otra)$/.test(payload.scholarship_type))
                throw new Error('El tipo de beca del candidato no es válido');

            // validar datos del periodo y especialidades
            if(!payload.id_period)
                throw new Error('El periodo no puede estar vacío');
            if(!payload.specialities_by_period)
                throw new Error('Las especialidades no pueden estar vacías');

            // validar que el candidato haya seleccionado 3 especialidades, que no se repitan y que esten las 3 gerarquizadas
            if(payload.specialities_by_period.length !== 3)
                throw new Error('El candidato debe seleccionar 3 especialidades');

            const hierarchySet = new Set([1, 2, 3]);
            const specialitySet = new Set();

            for (const speciality of payload.specialities_by_period) {
                if(!speciality.id_speciality)
                    throw new Error('La especialidad no puede estar vacía');
                if(!speciality.hierarchy)
                    throw new Error('La jerarquía de la especialidad no puede estar vacía');
                if(!speciality.name)
                    throw new Error('El nombre de la especialidad no puede estar vacío');

                if(!hierarchySet.has(speciality.hierarchy))
                    throw new Error('La jerarquía de la especialidad no es válida');

                if(specialitySet.has(speciality.id_speciality))
                    throw new Error('Las especialidades no pueden repetirse');

                specialitySet.add(speciality.id_speciality);
            }

            
            // obtener el total de candidatos por especialidad en el periodo actual y los tokens permitidos
            const totalCandidates = await candidatesStorageGateway.findTotalCandidatesByPeriodAndSpeciality({ id_period: payload.id_period, id_speciality: payload.specialities_by_period[0].id_speciality });
            const tokensAllowed = await candidatesStorageGateway.getTokensAllowed({ id_period: payload.id_period, id_speciality: payload.specialities_by_period[0].id_speciality });
            
            if(totalCandidates >= tokensAllowed)
                throw new Error('El cupo para la especialidad seleccionada ya está lleno');


            // traer el numero de su ficha
            const totalTokens = await candidatesStorageGateway.getTotalTokens({ id_period: payload.id_period });
            const token = totalTokens + 1;
            payload.username = payload.id_period + token.toString().padStart(5, '0');

            //generar una contraseña aleatoria
            const passwordBlank = randomCode();
            payload.password = await encode(passwordBlank);

            // registrar al candidato en el siguiente orden: dirección, candidato, direccion del tutor si aplica, tutor, escuela, especialidades
            // registrar dirección del candidato
            payload.candidate_id_address = await candidatesStorageGateway.registerAddress({postal_code: payload.candidate_postal_code, id_municipality: payload.candidate_id_municipality, neighborhood: payload.candidate_neighborhood, street_and_number: payload.candidate_street_and_number});

            // registrar candidato
            payload.id_candidate = await candidatesStorageGateway.registerCandidate(payload);

            // registrar dirección del tutor si aplica
            if(payload.tutor_live_separated){
                payload.tutor_id_address = await candidatesStorageGateway.registerAddress({postal_code: payload.tutor_postal_code, id_municipality: payload.tutor_id_municipality, neighborhood: payload.tutor_neighborhood, street_and_number: payload.tutor_street_and_number});
            }

            // registrar tutor
            payload.tutor_id_tutor = await candidatesStorageGateway.registerTutor(payload);

            // registrar escuela
            payload.id_highschool = await candidatesStorageGateway.registerHighschoolInformation(payload);

            // registrar especialidades 
            for(const speciality of payload.specialities_by_period){
                const specialityByPeriod = await candidatesStorageGateway.getSpecialitiesByPeriodAndSpeciality({ id_period: payload.id_period, id_speciality: speciality.id_speciality });
                await candidatesStorageGateway.registerSpecialitiesSelected({ id_candidate: payload.id_candidate, id_speciality_by_period: specialityByPeriod, herarchy: speciality.hierarchy });
            }

            // generar ficha

            //obtener los datos faltantes
            const candidate_state = await candidatesStorageGateway.getStateByMunicipality({ id_municipality: payload.candidate_id_municipality });
            const candidate_municipality = await candidatesStorageGateway.getMunicipalityByMunicipality({ id_municipality: payload.candidate_id_municipality });

            const tutor_state = payload.tutor_live_separated ? await candidatesStorageGateway.getStateByMunicipality({ id_municipality: payload.tutor_id_municipality }) : '';
            const tutor_municipality = payload.tutor_live_separated ? await candidatesStorageGateway.getMunicipalityByMunicipality({ id_municipality: payload.tutor_id_municipality }) : '';

            const school_state = await candidatesStorageGateway.getStateByMunicipality({ id_municipality: payload.school_id_municipality });
            const school_municipality = await candidatesStorageGateway.getMunicipalityByMunicipality({ id_municipality: payload.school_id_municipality });

            const sale_period = await candidatesStorageGateway.getSalePeriod({ id_period: payload.id_period });

            const institutionalInformation = await candidatesStorageGateway.getInstitutionalInformation();

            institutionalInformation.logo = `data:image/png;base64,${Buffer.from(institutionalInformation.logo as Buffer).toString('base64')}`; 
            

            const dataToDocument: requestToGenarateTokenDTO = {
                logo: institutionalInformation.logo,

                token: payload.username,
                speciality_1: payload.specialities_by_period[0].name,
                speciality_2: payload.specialities_by_period[1].name,
                speciality_3: payload.specialities_by_period[2].name,

                name: payload.name,
                first_last_name: payload.first_last_name,
                second_last_name: payload.second_last_name ? payload.second_last_name : '',
                curp: payload.curp,
                birthdate: formatDate(payload.birthdate.toString()),
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
            }

            // generar documento
            const document = await createToken(dataToDocument);
            // generar cuerpo de respuesta
            const body: ResponseApi<registerCandidateRequestDto> = {
                data: {
                    token_number: payload.username,
                    password: passwordBlank,
                    token: document,
                },
                status: 200,
                message: 'Candidato registrado correctamente',
                error: false
            }
            

            res.status(200).json(body);

        } catch (error) {
            logger.error(error)

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);            
        }
    }

    async validateCurpOnPeriod (req: Request, res: Response) {
        try {
            // obtener el cuerpo de la petición
            const payload = req.body as Candidate;

            // instanciar el gateway
            const candidatesStorageGateway = new CandidatesStorageGateway();

            // buscar si el candidato ya realizo su registro en el periodo actual
            const candidateCount = await candidatesStorageGateway.findCandidateByPeriod({ curp: payload.curp, id_period: payload.id_period });

            if(candidateCount > 0)
                throw new Error('El candidato ya ha realizado su registro en el periodo actual');

            const body: ResponseApi<boolean> = {
                data: true,
                status: 200,
                message: 'CURP válida',
                error: false
            }

            res.status(200).json(body);

        } catch (error) {
            logger.error(error)

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);            
        }
    }
}




CandidatesRouter.post('/register-candidate', new CandidatesController().registerCandidate);
CandidatesRouter.post('/validate-curp-on-period', new CandidatesController().validateCurpOnPeriod);


export default CandidatesRouter;