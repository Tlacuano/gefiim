import { ResponseApi } from './../../kernel/types';
import { MESSAGES } from '../../utils/messages/response_messages';

const errors: { [x: string]: ResponseApi<undefined> } = {
    'Vaya, algo salió mal. Inténtalo de nuevo más tarde.' : { data: undefined, message: MESSAGES.SERVER_ERROR, status: 500, error: true },
    // errors by payload
    'Error en la petición. Por favor, verifica los datos enviados.' : { data: undefined, message: MESSAGES.BAD_REQUEST.DEFAULT, status: 400, error: true }
}

export const validateError = (error: Error): ResponseApi<undefined> => {
    return errors[error.message] || { data: undefined, message: MESSAGES.SERVER_ERROR, status: 500, error: true };
}