"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a productName'],
        unique: true,
    },
    category: {
        type: String,
        required: [true, 'A category is needed'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'A description is needed'],
        min: (8),
        max: (255)
    },
    shortDescription: {
        type: String,
        required: [true, 'A description is needed to show'],
        min: (8),
        max: (255)
    },
    image: {
        type: String,
        required: [true, 'Every user must have an image']
    },
    soldBy: {
        sellerId: {
            type: String,
            required: [true, 'A product seller must have an id']
        },
        sellerName: {
            type: String,
            required: [true, 'A product seller must have a name']
        }
    }
}, {
    timestamps: true
});
exports.ProductData = mongoose_1.default.model('product', productSchema);
//# sourceMappingURL=product.js.map