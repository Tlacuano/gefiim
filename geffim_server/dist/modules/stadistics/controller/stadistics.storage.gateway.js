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
exports.StadisticsStorageGateway = void 0;
const db_connection_1 = require("../../../utils/data_base/db_connection");
class StadisticsStorageGateway {
    getTotalTokensAutorized(id_speciality) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("select SUM(tokens_allowed) as total from speciality_by_period where id_period =  ?", [id_speciality]);
                return response[0].total;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getTotalTokensRegistered(id_speciality) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("select COUNT(ss.id_selected_speciality) as total from selected_specialities ss join speciality_by_period sbp on ss.id_speciality_by_period = sbp.id_speciality_by_period where ss.herarchy = 1 and sbp.id_period = ?", [id_speciality]);
                return response[0].total;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getStadisticsBySpeciality(id_speciality) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`SELECT
    s.name AS speciality_name,
    CAST(COALESCE(SUM(CASE WHEN c.payed = 1 THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS payed_count,
    CAST(COALESCE(SUM(CASE WHEN c.payed = 0 THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS not_payed_count,
    CAST(COALESCE(sbp.tokens_allowed, 0) AS UNSIGNED) AS total_tokens
FROM
    specialities s
LEFT JOIN
    speciality_by_period sbp ON s.id_speciality = sbp.id_speciality
LEFT JOIN
    sale_periods sp ON sbp.id_period = sp.id_period AND sp.id_period = ? AND sp.status = 'active'
LEFT JOIN
    selected_specialities ss ON sbp.id_speciality_by_period = ss.id_speciality_by_period AND ss.herarchy = 1
LEFT JOIN
    candidates c ON ss.id_candidate = c.id_candidate
WHERE
    s.status = 1
GROUP BY
    s.name, sbp.tokens_allowed;
`, [id_speciality]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
}
exports.StadisticsStorageGateway = StadisticsStorageGateway;
