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
exports.UserStorageGateway = void 0;
const db_connection_1 = require("../../../utils/data_base/db_connection");
class UserStorageGateway {
    getTotalUsers(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('SELECT COUNT(id_admin) as total FROM admins');
                const { total } = response[0];
                return total;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getUsersPaginated(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM admins LIMIT ? OFFSET ? ", [payload.limit, payload.offset]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    //bucar por username
    getUserByUsername(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM admins WHERE username = ?", [payload]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getUserById(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM admins WHERE id_admin = ?", [payload]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    registerUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('INSERT INTO admins (username, password, email) VALUES (?, ?, ?)', [payload.username, payload.password, payload.email]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    updateUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('UPDATE admins SET username = ?, email = ? WHERE id_admin = ?', [payload.username, payload.email, payload.id_admin]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    changeStatus(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('UPDATE admins SET status = ? WHERE id_admin = ?', [payload.status, payload.id_admin]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    changePassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('UPDATE admins SET password = ? WHERE id_admin = ?', [payload.password, payload.id_admin]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
}
exports.UserStorageGateway = UserStorageGateway;
