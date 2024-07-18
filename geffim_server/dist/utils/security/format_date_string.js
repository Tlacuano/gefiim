"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
const formatDate = (date) => {
    const datePart = date.split('T')[0];
    const dateArray = datePart.split('-');
    const [year, month, day] = dateArray;
    return `${day}/${month}/${year}`;
};
exports.formatDate = formatDate;
