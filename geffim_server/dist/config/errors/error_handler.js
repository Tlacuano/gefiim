"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateError = void 0;
const response_messages_1 = require("../../utils/messages/response_messages");
const errors = {
    'Vaya, algo salió mal. Inténtalo de nuevo más tarde.': { data: undefined, message: response_messages_1.MESSAGES.SERVER_ERROR, status: 500, error: true },
    // errors by payload
    'Error en la petición. Por favor, verifica los datos enviados.': { data: undefined, message: response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT, status: 400, error: true }
};
const validateError = (error) => {
    return errors[error.message] || { data: undefined, message: response_messages_1.MESSAGES.SERVER_ERROR, status: 500, error: true };
};
exports.validateError = validateError;
