"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStatesInteractor = void 0;
class GetStatesInteractor {
    constructor(stateRepository) {
        this.stateRepository = stateRepository;
    }
    execute(payload) {
        return this.stateRepository.getStates(payload);
    }
}
exports.GetStatesInteractor = GetStatesInteractor;
