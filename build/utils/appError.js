"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    /**
     *
     * @param message destructured message and statusCode as param0
     * @param statusCode
     */
    constructor({ message, statusCode }) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=appError.js.map