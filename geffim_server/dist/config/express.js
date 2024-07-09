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
const state_controller_1 = __importDefault(require("../modules/states/adapters/state.controller"));
const municipality_controller_1 = __importDefault(require("../modules/municipalities/adapters/municipality.controller"));
const speciality_controller_1 = __importDefault(require("../modules/specialities/controller/speciality.controller"));
const sale_period_controller_1 = __importDefault(require("../modules/sale_periods/controller/sale_period.controller"));
const institutional_information_controller_1 = __importDefault(require("../modules/institutional_information/controller/institutional_information.controller"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.set('port', process.env.PORT || 3000);
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json({ limit: '50mb' }));
app.get('/', (__, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Hello World');
}));
app.use('/api-gefiim/state', state_controller_1.default);
app.use('/api-gefiim/municipality', municipality_controller_1.default);
app.use('/api-gefiim/speciality', speciality_controller_1.default);
app.use('/api-gefiim/sale-period', sale_period_controller_1.default);
app.use('/api-gefiim/institutional-information', institutional_information_controller_1.default);
exports.default = app;
