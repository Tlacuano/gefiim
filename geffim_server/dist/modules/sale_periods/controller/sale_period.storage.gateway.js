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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalePeriodStorageGateway = void 0;
const db_connection_1 = require("../../../utils/data_base/db_connection");
class SalePeriodStorageGateway {
    getTotalSalePeriods(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('SELECT COUNT(id_period) as total FROM sale_periods');
                const { total } = response[0];
                return total;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getSalePeriodsPaginated(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM sale_periods ORDER BY start_date DESC LIMIT ? OFFSET ? ", [payload.limit, payload.offset]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    // para registrar y actualizar periodos de venta
    getTotalSalePeriodsCrossing(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = payload.id_period ? "SELECT COUNT(id_period) as total FROM sale_periods WHERE start_date <= ? AND end_date >= ? AND id_period != ? AND status IN ('pending', 'active')" : "SELECT COUNT(id_period) as total FROM sale_periods WHERE start_date <= ? AND end_date >= ? AND status IN ('pending', 'active')";
            try {
                const response = yield (0, db_connection_1.queryDB)(query, [payload.start_date, payload.end_date, payload.id_period]);
                const { total } = response[0];
                return total;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getSalePeriodById(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM sale_periods WHERE id_period = ?", [payload.id_period]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    registerSalePeriod(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('INSERT INTO sale_periods (start_date, end_date, bank_name, bank_account, bank_clabe, concept, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [payload.start_date, payload.end_date, payload.bank_name, payload.bank_account, payload.bank_clabe, payload.concept, payload.amount, payload.status]);
                return response.insertId;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    registerSpecialityBySalePeriod(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('INSERT INTO speciality_by_period (id_period, id_speciality, tokens_allowed) VALUES (?, ?, ?)', [payload.id_period, payload.id_speciality, payload.tokens_allowed]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    updateSalePeriod(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('UPDATE sale_periods SET start_date = ?, end_date = ?, bank_name = ?, bank_account = ?, bank_clabe = ?, concept = ?, amount = ?, status = ? WHERE id_period = ?', [payload.start_date, payload.end_date, payload.bank_name, payload.bank_account, payload.bank_clabe, payload.concept, payload.amount, payload.status, payload.id_period]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    changeStatusSalePeriod(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('UPDATE sale_periods SET status = ? WHERE id_period = ?', [payload.status, payload.id_period]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    updateNewActiveSpeciality(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("UPDATE sale_periods SET status = 'active' WHERE start_date <= ? AND end_date >= ? AND status = 'pending'", [payload.today, payload.today]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    finalizeSalePeriod(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            payload.today.setHours(0, 0, 0, 0);
            try {
                const response = yield (0, db_connection_1.queryDB)("UPDATE sale_periods SET status = 'finalized' WHERE end_date < ? AND status = 'active'", [payload.today]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getCurrrentSalePeriod(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            payload.today.setHours(0, 0, 0, 0);
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM sale_periods WHERE start_date <= ? AND end_date >= ? AND status = 'active'", [payload.today, payload.today]);
                return response[0];
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getTotalTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`SELECT
                                                                                                                                s.id_speciality,
                                                                                                                                s.name,
                                                                                                                                COALESCE(sbp.tokens_allowed, 0) AS tokens_allowed,
                                                                                                                                COUNT(CASE WHEN ss.herarchy = 1 THEN ss.id_selected_speciality END) AS saled
                                                                                                                            FROM
                                                                                                                                specialities s
                                                                                                                            LEFT JOIN
                                                                                                                                speciality_by_period sbp ON s.id_speciality = sbp.id_speciality
                                                                                                                            LEFT JOIN
                                                                                                                                sale_periods sp ON sbp.id_period = sp.id_period AND sp.status = 'active'
                                                                                                                            LEFT JOIN
                                                                                                                                selected_specialities ss ON sbp.id_speciality_by_period = ss.id_speciality_by_period
                                                                                                                            WHERE
                                                                                                                                s.status = 1
                                                                                                                            AND sp.status = 'active'
                                                                                                                            GROUP BY
                                                                                                                                s.id_speciality, s.name, sbp.tokens_allowed;`, []);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    // actualizar tokens vendidos
    getSpecialityBySalePeriod(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(` SELECT
                                                                                                                                s.id_speciality,
                                                                                                                                s.name,
                                                                                                                                COALESCE(sbp.tokens_allowed, 0) AS tokens_allowed
                                                                                                                            FROM
                                                                                                                                specialities s
                                                                                                                            LEFT JOIN
                                                                                                                                speciality_by_period sbp ON s.id_speciality = sbp.id_speciality AND sbp.id_period = ?
                                                                                                                            WHERE
                                                                                                                                s.status = 1
                                                                                                                            ORDER BY
                                                                                                                                s.id_speciality;`, [payload.id_period]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    existSpecialityBySalePeriod(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`select id_speciality_by_period, tokens_allowed from speciality_by_period where id_period = ? and id_speciality = ?;`, [payload.id_period, payload.id_speciality]);
                return response[0];
            }
            catch (error) {
                throw (error);
            }
        });
    }
    updateTokensAllowed(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('UPDATE speciality_by_period SET tokens_allowed = ? WHERE id_speciality_by_period = ?', [payload.tokens_allowed, payload.id_speciality_by_period]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
}
exports.SalePeriodStorageGateway = SalePeriodStorageGateway;
