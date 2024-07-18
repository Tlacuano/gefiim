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
exports.convertToBase64 = void 0;
const convertToBase64 = (pdfDoc) => __awaiter(void 0, void 0, void 0, function* () {
    const Base64 = yield new Promise((resolve, reject) => {
        pdfDoc.getBase64((result) => {
            if (result) {
                resolve(result);
            }
            else {
                reject(new Error('Error generating the document'));
            }
        });
    });
    return `${Base64}`;
});
exports.convertToBase64 = convertToBase64;
