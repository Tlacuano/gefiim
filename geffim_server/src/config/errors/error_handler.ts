import { ResponseApi } from './../../kernel/types';
import { MESSAGES } from '../../utils/messages/response_messages';
import logger from '../../config/logs/logger';

const errors: { [x: string]: ResponseApi<undefined> } = {
    'Vaya, algo salió mal. Inténtalo de nuevo más tarde.' : { data: undefined, message: MESSAGES.SERVER_ERROR, status: 500, error: true },
    // errors by payload
    'Error en la petición. Por favor, verifica los datos enviados.' : { data: undefined, message: MESSAGES.BAD_REQUEST.DEFAULT, status: 400, error: true },
    'El email no puede estar vacío': { data: undefined, message: 'El email no puede estar vacío', status: 400, error: true },
    'La contraseña no puede estar vacía': { data: undefined, message: 'La contraseña no puede estar vacía', status: 400, error: true },
    'Usuario o contraseña incorrectos': { data: undefined, message: 'Usuario o contraseña incorrectos', status: 400, error: true },
    'El nombre del candidato no puede estar vacío' : { data: undefined, message: 'El nombre del candidato no puede estar vacío', status: 400, error: true },
    'El primer apellido del candidato no puede estar vacío' : { data: undefined, message: 'El primer apellido del candidato no puede estar vacío', status: 400, error: true },
    'La CURP del candidato no puede estar vacía' : { data: undefined, message: 'La CURP del candidato no puede estar vacía', status: 400, error: true },
    'La fecha de nacimiento del candidato no puede estar vacía' : { data: undefined, message: 'La fecha de nacimiento del candidato no puede estar vacía', status: 400, error: true },
    'El género del candidato no puede estar vacío' : { data: undefined, message: 'El género del candidato no puede estar vacío', status: 400, error: true },
    'El correo electrónico del candidato no puede estar vacío' : { data: undefined, message: 'El correo electrónico del candidato no puede estar vacío', status: 400, error: true },
    'El número de teléfono del candidato no puede estar vacío' : { data: undefined, message: 'El número de teléfono del candidato no puede estar vacío', status: 400, error: true },
    'El número de teléfono secundario del candidato no puede estar vacío' : { data: undefined, message: 'El número de teléfono secundario del candidato no puede estar vacío', status: 400, error: true },
    'El nombre del candidato no es válido' : { data: undefined, message: 'El nombre del candidato no es válido', status: 400, error: true },
    'El primer apellido del candidato no es válido' : { data: undefined, message: 'El primer apellido del candidato no es válido', status: 400, error: true },
    'El segundo apellido del candidato no es válido' : { data: undefined, message: 'El segundo apellido del candidato no es válido', status: 400, error: true },
    'La CURP del candidato no es válida' : { data: undefined, message: 'La CURP del candidato no es válida', status: 400, error: true },
    'El candidato debe ser mayor de 13 años' : { data: undefined, message: 'El candidato debe ser mayor de 13 años', status: 400, error: true },
    'El género del candidato no es válido' : { data: undefined, message: 'El género del candidato no es válido', status: 400, error: true },
    'El correo electrónico del candidato no es válido' : { data: undefined, message: 'El correo electrónico del candidato no es válido', status: 400, error: true },
    'El número de teléfono del candidato no es válido' : { data: undefined, message: 'El número de teléfono del candidato no es válido', status: 400, error: true },
    'El número de teléfono secundario del candidato no es válido' : { data: undefined, message: 'El número de teléfono secundario del candidato no es válido', status: 400, error: true },
    'El candidato ya ha realizado su registro en el periodo actual' : { data: undefined, message: 'El candidato ya ha realizado su registro en el periodo actual', status: 400, error: true },
    'El código postal del candidato no puede estar vacío' : { data: undefined, message: 'El código postal del candidato no puede estar vacío', status: 400, error: true },
    'El municipio del candidato no puede estar vacío' : { data: undefined, message: 'El municipio del candidato no puede estar vacío', status: 400, error: true },
    'La colonia del candidato no puede estar vacía' : { data: undefined, message: 'La colonia del candidato no puede estar vacía', status: 400, error: true },
    'La calle y número del candidato no puede estar vacía' : { data: undefined, message: 'La calle y número del candidato no puede estar vacía', status: 400, error: true },
    'El código postal del candidato no es válido' : { data: undefined, message: 'El código postal del candidato no es válido', status: 400, error: true },
    'La colonia del candidato no es válida' : { data: undefined, message: 'La colonia del candidato no es válida', status: 400, error: true },
    'La calle y número del candidato no es válido' : { data: undefined, message: 'La calle y número del candidato no es válido', status: 400, error: true },
    'El nombre del tutor no puede estar vacío' : { data: undefined, message: 'El nombre del tutor no puede estar vacío', status: 400, error: true },
    'El primer apellido del tutor no puede estar vacío' : { data: undefined, message: 'El primer apellido del tutor no puede estar vacío', status: 400, error: true },
    'El número de teléfono del tutor no puede estar vacío' : { data: undefined, message: 'El número de teléfono del tutor no puede estar vacío', status: 400, error: true },
    'El número de teléfono secundario del tutor no puede estar vacío' : { data: undefined, message: 'El número de teléfono secundario del tutor no puede estar vacío', status: 400, error: true },
    'El nombre del tutor no es válido' : { data: undefined, message: 'El nombre del tutor no es válido', status: 400, error: true },
    'El primer apellido del tutor no es válido' : { data: undefined, message: 'El primer apellido del tutor no es válido', status: 400, error: true },
    'El segundo apellido del tutor no es válido' : { data: undefined, message: 'El segundo apellido del tutor no es válido', status: 400, error: true },
    'El número de teléfono del tutor no es válido' : { data: undefined, message: 'El número de teléfono del tutor no es válido', status: 400, error: true },
    'El número de teléfono secundario del tutor no es válido'  : { data: undefined, message: 'El número de teléfono secundario del tutor no es válido', status: 400, error: true },
    'El código postal del tutor no puede estar vacío' : { data: undefined, message: 'El código postal del tutor no puede estar vacío', status: 400, error: true },
    'El municipio del tutor no puede estar vacío' : { data: undefined, message: 'El municipio del tutor no puede estar vacío', status: 400, error: true },
    'La colonia del tutor no puede estar vacía' : { data: undefined, message: 'La colonia del tutor no puede estar vacía', status: 400, error: true },
    'La calle y número del tutor no puede estar vacía' : { data: undefined, message: 'La calle y número del tutor no puede estar vacía', status: 400, error: true },
    'El código postal del tutor no es válido' : { data: undefined, message: 'El código postal del tutor no es válido', status: 400, error: true },
    'La colonia del tutor no es válida' : { data: undefined, message: 'La colonia del tutor no es válida', status: 400, error: true },
    'La calle y número del tutor no es válido' : { data: undefined, message: 'La calle y número del tutor no es válido', status: 400, error: true },
    'La clave de la escuela no puede estar vacía' : { data: undefined, message: 'La clave de la escuela no puede estar vacía', status: 400, error: true },
    'El tipo de escuela no puede estar vacío' : { data: undefined, message: 'El tipo de escuela no puede estar vacío', status: 400, error: true },
    'El nombre de la escuela no puede estar vacío' : { data: undefined, message: 'El nombre de la escuela no puede estar vacío', status: 400, error: true },
    'El municipio de la escuela no puede estar vacío' : { data: undefined, message: 'El municipio de la escuela no puede estar vacío', status: 400, error: true },
    'El promedio del candidato no puede estar vacío' : { data: undefined, message: 'El promedio del candidato no puede estar vacío', status: 400, error: true },
    'El tipo de beca no puede estar vacío' : { data: undefined, message: 'El tipo de beca no puede estar vacío', status: 400, error: true },
    'La clave de la escuela no es válida' : { data: undefined, message: 'La clave de la escuela no es válida', status: 400, error: true },
    'El tipo de escuela no es válido' : { data: undefined, message: 'El tipo de escuela no es válido', status: 400, error: true },
    'El nombre de la escuela no es válido' : { data: undefined, message: 'El nombre de la escuela no es válido', status: 400, error: true },
    'El promedio del candidato no es válido' : { data: undefined, message: 'El promedio del candidato no es válido', status: 400, error: true },
    'El tipo de beca del candidato no es válido' : { data: undefined, message: 'El tipo de beca del candidato no es válido', status: 400, error: true },
    'El candidato debe seleccionar 3 especialidades' : { data: undefined, message: 'El candidato debe seleccionar 3 especialidades', status: 400, error: true },
    'La especialidad no puede estar vacía' : { data: undefined, message: 'La especialidad no puede estar vacía', status: 400, error: true },
    'La jerarquía de la especialidad no puede estar vacía' : { data: undefined, message: 'La jerarquía de la especialidad no puede estar vacía', status: 400, error: true },
    'El nombre de la especialidad no puede estar vacío' : { data: undefined, message: 'El nombre de la especialidad no puede estar vacío', status: 400, error: true },
    'La jerarquía de la especialidad no es válida' : { data: undefined, message: 'La jerarquía de la especialidad no es válida', status: 400, error: true },
    'Las especialidades no pueden repetirse' : { data: undefined, message: 'Las especialidades no pueden repetirse', status: 400, error: true },
    'El cupo para la especialidad seleccionada ya está lleno' : { data: undefined, message: 'El cupo para la especialidad seleccionada ya está lleno', status: 400, error: true },

    'El color primario no puede estar vacío' : { data: undefined, message: 'El color primario no puede estar vacío', status: 400, error: true },
    'El color secundario no puede estar vacío' : { data: undefined, message: 'El color secundario no puede estar vacío', status: 400, error: true },
    'El logo no puede estar vacío' : { data: undefined, message: 'El logo no puede estar vacío', status: 400, error: true },
    'La imagen principal no puede estar vacía' : { data: undefined, message: 'La imagen principal no puede estar vacía', status: 400, error: true },
    'El color primario no tiene un formato válido' : { data: undefined, message: 'El color primario no tiene un formato válido', status: 400, error: true },
    'El color secundario no tiene un formato válido' : { data: undefined, message: 'El color secundario no tiene un formato válido', status: 400, error: true },
    'El logo no tiene un formato válido' : { data: undefined, message: 'El logo no tiene un formato válido', status: 400, error: true },
    'La imagen principal no tiene un formato válido' : { data: undefined, message: 'La imagen principal no tiene un formato válido', status: 400, error: true },

    'La fecha de inicio y la fecha de fin son obligatorias' : { data: undefined, message: 'La fecha de inicio y la fecha de fin son obligatorias', status: 400, error: true },
    'El nombre del banco es obligatorio' : { data: undefined, message: 'El nombre del banco es obligatorio', status: 400, error: true },
    'El numero de cuenta es obligatorio' : { data: undefined, message: 'El numero de cuenta es obligatorio', status: 400, error: true },
    'El numero de clabe es obligatorio' : { data: undefined, message: 'El numero de clabe es obligatorio', status: 400, error: true },
    'El concepto es obligatorio' : { data: undefined, message: 'El concepto es obligatorio', status: 400, error: true },
    'El monto debe ser un numero positivo' : { data: undefined, message: 'El monto debe ser un numero positivo', status: 400, error: true },
    'El numero de cuenta debe ser numerico' : { data: undefined, message: 'El numero de cuenta debe ser numerico', status: 400, error: true },
    'El numero de clabe debe ser numerico' : { data: undefined, message: 'El numero de clabe debe ser numerico', status: 400, error: true },
    'La fecha de inicio debe ser menor a la fecha de fin' : { data: undefined, message: 'La fecha de inicio debe ser menor a la fecha de fin', status: 400, error: true },
    'No se puede registrar un periodo de venta con una fecha de fin menor a la fecha actual' : { data: undefined, message: 'No se puede registrar un periodo de venta con una fecha de fin menor a la fecha actual', status: 400, error: true },
    'El rango de fechas se cruza con otro rango de fechas' : { data: undefined, message: 'El rango de fechas se cruza con otro rango de fechas', status: 400, error: true },
    'Las fichas permitidas deben ser un número entero positivo' : { data: undefined, message: 'Las fichas permitidas deben ser un número entero positivo', status: 400, error: true },
    'El periodo de venta no se puede actualizar' : { data: undefined, message: 'El periodo de venta no se puede actualizar', status: 400, error: true },
    'El estado del periodo de venta debe ser finalizado' : { data: undefined, message: 'El estado del periodo de venta debe ser finalizado', status: 400, error: true },
    'El estado del periodo de venta debe ser cancelado' : { data: undefined, message: 'El estado del periodo de venta debe ser cancelado', status: 400, error: true },
    'El estado del periodo de venta no se puede cambiar' : { data: undefined, message: 'El estado del periodo de venta no se puede cambiar', status: 400, error: true },
    'No hay periodo de venta activo' : { data: undefined, message: 'No hay periodo de venta activo', status: 400, error: true },
    'No hay fichas disponibles' : { data: undefined, message: 'No hay fichas disponibles', status: 400, error: true },

    'El nombre de la especialidad es obligatorio' : { data: undefined, message: 'El nombre de la especialidad es obligatorio', status: 400, error: true },
    'El nombre de la especialidad no es valido' : { data: undefined, message: 'El nombre de la especialidad no es valido', status: 400, error: true },
    'El acronimo de la especialidad es obligatorio' : { data: undefined, message: 'El acronimo de la especialidad es obligatorio', status: 400, error: true },
    'El acronimo de la especialidad no es valido' : { data: undefined, message: 'El acronimo de la especialidad no es valido', status: 400, error: true },
    'El nombre de la especialidad ya existe' : { data: undefined, message: 'El nombre de la especialidad ya existe', status: 400, error: true },
    'El acronimo ya existe' : { data: undefined, message: 'El acronimo ya existe', status: 400, error: true },





}

export const validateError = (error: Error): ResponseApi<undefined> => {
    const response = errors[error.message] || { data: undefined, message: MESSAGES.SERVER_ERROR, status: 500, error: true };
    logger.error(error.message);
    return response;
}