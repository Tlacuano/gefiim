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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MunicipalityController = void 0;
const express_1 = require("express");
const state_bounday_1 = require("../../../modules/states/adapters/state.bounday");
const municipality_storage_gateway_1 = require("./municipality.storage.gateway");
const get_municipalities_by_state_id_interactor_1 = require("../use_cases/get_municipalities_by_state_id.interactor");
const logger_1 = __importDefault(require("../../../config/logs/logger"));
const error_handler_1 = require("../../../config/errors/error_handler");
const MunicipalityRouter = (0, express_1.Router)();
class MunicipalityController {
    constructor() {
        this.getMunicipalitiesByStateId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                yield state_bounday_1.StateBoundary.getStateById(payload.id_state);
                const repository = new municipality_storage_gateway_1.MunicipalityStorageGateway();
                const interactor = new get_municipalities_by_state_id_interactor_1.GetMunicipalitiesByStateId(repository);
                const municipalities = yield interactor.execute(payload.id_state);
                const body = {
                    data: municipalities,
                    message: 'Municipalities fetched successfully',
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
exports.MunicipalityController = MunicipalityController;
MunicipalityRouter.post('/get-municipalities-by-state-id', new MunicipalityController().getMunicipalitiesByStateId);
exports.default = MunicipalityRouter;
