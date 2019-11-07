"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes/routes");
const errorController_1 = require("./controllers/errorController");
exports.app = express_1.default();
exports.app.use(cors_1.default());
exports.app.use(helmet_1.default());
exports.app.use(express_1.default.json());
/**
 * morgan logger as a 3rd party middleware
 */
if (process.env.NODE_ENV === 'development') {
    exports.app.use(morgan_1.default('dev')); // logging only while
}
const limiter = express_rate_limit_1.default({
    max: 10,
    windowMs: 36000,
    message: `please try after sometime you exceeded rate limit`
});
/**
 * custom middle ware
 */
exports.app.use('/api', limiter);
exports.app.use((req, res, next) => {
    // req.requestTime = new Date().toISOString();
    next(); // to continue the req res cycle
});
/**
 * custom router middleware
 */
exports.app.use('/api/v1/ecommerce', routes_1.router);
exports.app.all('*', (req, res, next) => {
    next(new Error(`can't find ${req.originalUrl} on this server`));
});
exports.app.use(errorController_1.errorController);
//# sourceMappingURL=app.js.map