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
exports.InstitutionalInformationStorageGateway = void 0;
const db_connection_1 = require("../../../utils/data_base/db_connection");
class InstitutionalInformationStorageGateway {
    getInstitutionalInformation() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)("SELECT * FROM institutional_information");
                return response[0];
            }
            catch (error) {
                throw (error);
            }
        });
    }
    updateInstitutionalInformation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('UPDATE institutional_information SET primary_color = ?, secondary_color = ?, logo = ?, main_image = ? WHERE id = 1', [payload.primary_color, payload.secondary_color, payload.logo, payload.main_image]);
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
}
exports.InstitutionalInformationStorageGateway = InstitutionalInformationStorageGateway;
