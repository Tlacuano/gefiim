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
exports.CandidatesStorageGateway = void 0;
const db_connection_1 = require("../../../utils/data_base/db_connection");
class CandidatesStorageGateway {
    findCandidateByPeriod(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`SELECT COUNT(*) AS candidate_count
                                                                            FROM candidates c
                                                                            JOIN selected_specialities ss ON c.id_candidate = ss.id_candidate
                                                                            JOIN speciality_by_period sbp ON ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                            JOIN sale_periods sp ON sbp.id_period = sp.id_period
                                                                            WHERE c.curp = ?
                                                                            AND sp.id_period = ?`, [payload.curp, payload.id_period]);
                return response[0].candidate_count;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    findTotalCandidatesByPeriodAndSpeciality(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`SELECT COUNT(sbp.id_speciality_by_period) AS candidate_count
                                                                            FROM selected_specialities ss
                                                                            JOIN speciality_by_period sbp ON ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                            JOIN sale_periods sp ON sbp.id_period = sp.id_period
                                                                            WHERE sp.id_period = ?
                                                                            AND sbp.id_speciality = ?
                                                                            AND ss.herarchy = 1`, [payload.id_period, payload.id_speciality]);
                return response[0].candidate_count;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getTokensAllowed(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`SELECT tokens_allowed
                                                                        FROM speciality_by_period
                                                                        WHERE id_period = ?
                                                                        AND id_speciality = ?`, [payload.id_period, payload.id_speciality]);
                return response[0].tokens_allowed;
            }
            catch (error) {
                throw (error);
            }
        });
    }
}
exports.CandidatesStorageGateway = CandidatesStorageGateway;
