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
exports.generateList = void 0;
const pdfmake_1 = __importDefault(require("pdfmake/build/pdfmake"));
const vfs_fonts_1 = __importDefault(require("pdfmake/build/vfs_fonts"));
const base64_1 = require("../../../utils/security/base64");
const logger_1 = __importDefault(require("../../../config/logs/logger"));
const response_messages_1 = require("../../../utils/messages/response_messages");
pdfmake_1.default.vfs = vfs_fonts_1.default.pdfMake.vfs;
const generateList = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = data.candidates.map(candidate => {
            return [
                candidate.no_ficha,
                candidate.full_name,
                candidate.speciality
            ];
        });
        const docDefinition = {
            content: [
                {
                    table: {
                        widths: [200, '*',],
                        body: [
                            [
                                { text: 'Lista  de candidatos', style: 'title', border: [false, false, true], },
                                {
                                    rowSpan: 2,
                                    image: data.logo,
                                    width: 120,
                                    alignment: 'right'
                                },
                            ],
                            [
                                { text: data.date, border: [false, false, true], margin: [0, 3, 0, 0], },
                                '',
                            ],
                        ]
                    },
                    layout: {
                        defaultBorder: false,
                    }
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', '*'],
                        body: [
                            [
                                { text: 'No. Ficha', style: 'subtitle' },
                                { text: 'Nombre', style: 'subtitle' },
                                { text: 'Especialidad', style: 'subtitle' },
                            ],
                            ...rows
                        ]
                    },
                    margin: [0, 20, 0, 0]
                }
            ],
            styles: {
                title: {
                    bold: true,
                    fontSize: 20
                },
                subtitle: {
                    bold: true,
                    fontSize: 13,
                },
                smallText: {
                    fontSize: 10,
                }
            }
        };
        const pdf = pdfmake_1.default.createPdf(docDefinition);
        const base64 = yield (0, base64_1.convertToBase64)(pdf);
        return base64;
    }
    catch (error) {
        logger_1.default.error(error);
        throw new Error(response_messages_1.MESSAGES.SERVER_ERROR);
    }
});
exports.generateList = generateList;
