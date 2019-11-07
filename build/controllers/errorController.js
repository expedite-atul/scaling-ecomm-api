"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * errorController utility function
 * @param err error response
 * @param req request payload
 * @param res
 * @param next
 */
exports.errorController = (err, req, res, next) => {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
    next();
};
//# sourceMappingURL=errorController.js.map