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
exports.StateStorageGateway = void 0;
const db_connection_1 = require("./../../../utils/data_base/db_connection");
const response_messages_1 = require("../../../utils/messages/response_messages");
class StateStorageGateway {
    getStates(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('SELECT * FROM states');
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
    getStateById(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, db_connection_1.queryDB)('SELECT * FROM states WHERE id_state = ?', [payload]);
                if (response.length === 0) {
                    throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
                }
                return response;
            }
            catch (error) {
                throw (error);
            }
        });
    }
}
exports.StateStorageGateway = StateStorageGateway;
