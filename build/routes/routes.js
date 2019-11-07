"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("./../controllers/authController");
const product_1 = require("../controllers/product");
/**
 * routes only without params or query string
 */
exports.router = express_1.default.Router();
exports.router.post('/signup', authController_1.signup);
exports.router.post('/login', authController_1.login);
exports.router.post('/forgotPassword');
exports.router.patch('/resetPassword/:token', authController_1.resetPassword);
exports.router.patch('/updatePassword/', authController_1.protect, authController_1.updatePassword);
exports.router.get('/users', authController_1.protect, authController_1.restrictTo('admin'), authController_1.users); //list all users
exports.router.delete('/users/:id', authController_1.protect, authController_1.restrictTo('admin'), authController_1.deleteSellerOrUser);
exports.router.post('/product', authController_1.protect, authController_1.restrictTo('admin', 'seller'), 
// productValidatorResponse,
product_1.addProduct);
exports.router.put('/product/:id', authController_1.protect, authController_1.restrictTo('seller'), 
// productValidatorResponse,
product_1.updateProduct);
exports.router.delete('/product/:id', authController_1.protect, authController_1.restrictTo('seller', 'admin'), product_1.deleteProduct);
exports.router.get('/products', authController_1.protect, authController_1.restrictTo('admin', 'user', 'seller'), product_1.getProducts);
exports.router.get('/product/?', authController_1.protect, authController_1.restrictTo('admin', 'user', 'seller'), product_1.getProduct);
//# sourceMappingURL=routes.js.map