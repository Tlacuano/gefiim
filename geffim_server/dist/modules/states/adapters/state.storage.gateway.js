"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateStorageGateway = void 0;
const db_connection_1 = require("./../../../utils/data_base/db_connection");
class StateStorageGateway {
    getStates(payload) {
        try {
            const response = (0, db_connection_1.queryDB)('SELECT * FROM states');
            return response;
        }
        catch (error) {
            throw (error);
        }
    }
}
exports.StateStorageGateway = StateStorageGateway;
