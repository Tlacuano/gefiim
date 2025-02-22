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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateController = void 0;
const error_handler_1 = require("./../../../config/errors/error_handler");
const express_1 = require("express");
const state_storage_gateway_1 = require("./state.storage.gateway");
const get_states_interactor_1 = require("../use_cases/get-states.interactor");
const logger_1 = __importDefault(require("../../../config/logs/logger"));
const ger_state_by_id_interactor_1 = require("../use_cases/ger_state_by_id.interactor");
const StateRouter = (0, express_1.Router)();
class StateController {
    constructor() {
        this.getStates = (__, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const repository = new state_storage_gateway_1.StateStorageGateway();
                const interactor = new get_states_interactor_1.GetStatesInteractor(repository);
                const states = yield interactor.execute();
                const body = {
                    data: states,
                    message: 'States fetched successfully',
                    status: 200,
                    error: false
                };
                res.status(200).json(body);
            }
            catch (error) {
                logger_1.default.error(error);
                const errorBody = (0, error_handler_1.validateError)(error);
                res.status(errorBody.status).json(errorBody);
            }
        });
    }
}
exports.StateController = StateController;
_a = StateController;
// local methods
StateController.getStateById = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const respository = new state_storage_gateway_1.StateStorageGateway();
        const interactor = new ger_state_by_id_interactor_1.GetStateById(respository);
        const state = yield interactor.execute(payload);
        return state;
    }
    catch (error) {
        throw error;
    }
});
StateRouter.get('/get-states', new StateController().getStates);
exports.default = StateRouter;
