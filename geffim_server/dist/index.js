"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const express_1 = __importDefault(require("./config/express"));
const logger_1 = __importDefault(require("./config/logs/logger"));
const main = () => {
    try {
        express_1.default.listen(express_1.default.get('port'), () => {
            logger_1.default.info(`Server is running in http://localhost:${express_1.default.get('port')}`);
        });
    }
    catch (err) {
        logger_1.default.error(winston_1.error);
    }
};
main();
