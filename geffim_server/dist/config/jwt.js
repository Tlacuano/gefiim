"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticator = exports.validateToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
};
exports.generateToken = generateToken;
const validateToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.validateToken = validateToken;
const Authenticator = (requiredRole) => {
    return (req, res, next) => {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({ message: 'No autorizado' });
        try {
            const { role } = (0, exports.validateToken)(token);
            if (requiredRole.includes(role)) {
                next();
            }
            else {
                return res.status(401).json({ message: 'No autorizado' });
            }
        }
        catch (error) {
            return res.status(401).json({ message: 'No autorizado' });
        }
        return;
    };
};
exports.Authenticator = Authenticator;
