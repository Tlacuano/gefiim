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
exports.AuthStorageGateway = void 0;
const db_connection_1 = require("../../../utils/data_base/db_connection");
class AuthStorageGateway {
    findUserOnCandidateTable(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`select * from candidates where username = ?`, [payload.username]);
                return response[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    findUserOnAdminTable(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)(`select * from admins where username = ?  AND status = 1`, [payload.username]);
                return response[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    setVerificationCodeCandidate(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, db_connection_1.queryDB)(`UPDATE candidates SET verification_code = ? WHERE username = ?`, [payload.code, payload.username]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    setVerificationCodeAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, db_connection_1.queryDB)(`UPDATE admins SET verification_code = ? WHERE username = ?`, [payload.code, payload.username]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updatePasswordCandidate(username, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, db_connection_1.queryDB)(`UPDATE candidates SET password = ? WHERE username = ?`, [newPassword, username]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updatePasswordAdmin(username, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, db_connection_1.queryDB)(`UPDATE admins SET password = ? WHERE username = ?`, [newPassword, username]);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AuthStorageGateway = AuthStorageGateway;
