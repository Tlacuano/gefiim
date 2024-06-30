"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMunicipalitiesByStateId = void 0;
const response_messages_1 = require("../../../utils/messages/response_messages");
class GetMunicipalitiesByStateId {
    constructor(repository) {
        this.repository = repository;
    }
    execute(payload) {
        if (!payload)
            throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
        if (!(Number.isInteger(payload) || payload <= 0))
            throw new Error(response_messages_1.MESSAGES.BAD_REQUEST.DEFAULT);
        return this.repository.getMunicipalitiesByStateId(payload);
    }
}
exports.GetMunicipalitiesByStateId = GetMunicipalitiesByStateId;
