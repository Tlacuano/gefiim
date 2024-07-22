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
exports.SpecialityStorageGateway = void 0;
const db_connection_1 = require("../../../utils/data_base/db_connection");
class SpecialityStorageGateway {
    getTotalSpecialities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('SELECT COUNT(id_speciality) as total FROM specialities');
                const { total } = response[0];
                return total;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getSpecialitiesPaginated(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                payload.filter.value = '%' + payload.filter.value + '%';
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM specialities WHERE name like ? OR acronym like ? LIMIT ? OFFSET ? ", [payload.filter.value, payload.filter.value, payload.limit, payload.offset]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    // para registrar y actualizar especialidades
    getSpecialityById(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM specialities WHERE id_speciality = ?", [payload]);
                return response[0];
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getSpecialityByName(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM specialities WHERE name = ?", [payload]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getSpecialityByAcronym(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM specialities WHERE acronym = ?", [payload]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getSpecialityByNameWithId(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM specialities WHERE name = ? AND id_speciality != ?", [payload.name, payload.id_speciality]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getSpecialityByAcronymWithId(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM specialities WHERE acronym = ? AND id_speciality != ?", [payload.acronym, payload.id_speciality]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    registerSpeciality(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('INSERT INTO specialities (name, acronym) VALUES (?, ?)', [payload.name, payload.acronym]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    updateSpeciality(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('UPDATE specialities SET name = ?, acronym = ? WHERE id_speciality = ?', [payload.name, payload.acronym, payload.id_speciality]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    updateSpecialityStatus(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('UPDATE specialities SET status = ? WHERE id_speciality = ?', [payload.status, payload.id_speciality]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getSpecialitiesActive(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM specialities WHERE status = 1");
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getAllSpecialities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM specialities");
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
}
exports.SpecialityStorageGateway = SpecialityStorageGateway;
