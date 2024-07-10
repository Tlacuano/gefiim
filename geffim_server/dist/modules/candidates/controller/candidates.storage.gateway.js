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
    getTotalTokens(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`SELECT COUNT(ss.id_selected_speciality) AS total_tokens
                                                                        FROM selected_specialities ss
                                                                        JOIN speciality_by_period sbp ON ss.id_speciality_by_period = sbp.id_speciality_by_period
                                                                        WHERE sbp.id_period = ?
                                                                        AND ss.herarchy = 1;`, [payload.id_period]);
                return response[0].total_tokens;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getSpecialitiesByPeriodAndSpeciality(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`SELECT sbp.id_speciality_by_period
                                                                                FROM speciality_by_period sbp
                                                                                WHERE sbp.id_period = ?
                                                                                AND sbp.id_speciality = ?`, [payload.id_period, payload.id_speciality]);
                return response[0].id_speciality_by_period;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    // registro de candidato
    registerAddress(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`INSERT INTO addresses (postal_code, id_municipality, neighborhood, street_and_number) VALUES (?, ?, ?, ?)`, [payload.postal_code, payload.id_municipality, payload.neighborhood, payload.street_and_number]);
                return response.insertId;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    registerCandidate(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`INSERT INTO candidates (name, first_last_name, second_last_name, curp, birthdate, gender, email, id_birth_municipality, phone_number, secondary_phone_number, id_address, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [payload.name, payload.first_last_name, payload.second_last_name, payload.curp, payload.birthdate, payload.gender, payload.email, payload.id_birth_municipality, payload.phone_number, payload.secondary_phone_number, payload.candidate_id_address, payload.username, payload.password]);
                return response.insertId;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    registerTutor(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`INSERT INTO tutors (name, first_last_name, second_last_name, phone_number, secondary_phone_number, live_separated, id_address, id_candidate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [payload.tutor_name, payload.tutor_first_last_name, payload.tutor_second_last_name, payload.tutor_phone_number, payload.tutor_secondary_phone_number, payload.tutor_live_separated, payload.tutor_id_address, payload.id_candidate]);
                return response.insertId;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    registerHighschoolInformation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`INSERT INTO highschool_information (school_key, school_type, school_name, id_municipality, average_grade, has_debts, scholarship_type, id_candidate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [payload.school_key, payload.school_type, payload.school_name, payload.school_id_municipality, payload.average_grade, payload.has_debts, payload.scholarship_type, payload.id_candidate]);
                return response.insertId;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    registerSpecialitiesSelected(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`INSERT INTO selected_specialities (id_speciality_by_period, id_candidate, herarchy) VALUES (?, ?, ?)`, [payload.id_speciality_by_period, payload.id_candidate, payload.herarchy]);
                return response.insertId;
            }
            catch (error) {
                throw (error);
            }
        });
    }
}
exports.CandidatesStorageGateway = CandidatesStorageGateway;
