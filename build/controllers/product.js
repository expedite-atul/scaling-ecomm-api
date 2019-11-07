"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const catchAsync_1 = require("../utils/catchAsync");
const user_1 = require("../models/user");
// export const productValidatorResponse = (req: Request, res: Response, next: NextFunction) => {
//   const { error } = productValidator(req.body);
//   if (error) {
//     res.status(400).json({
//       status: 400,
//       message: error.details[0].message
//     });
//     return;
//   }
//   next();
// };
/**
 * payload type
 */
// export type payloadSchema = Joi.Root & {
//   name: string;
//   category: string;
//   description: string;
//   shortDescription: string
//   image: string;
//   soldBy: {}
// }
// export const productValidator = function validateProduct(update: payloadSchema) {
//   const schema = {
//     name: Joi.string()
//       .min(3)
//       .required(),
//     category: Joi.string()
//       .min(1)
//       .max(255)
//       .required(),
//     description: Joi.string().required(),
//     shortDescription: Joi.string().required(),
//     image: Joi.string().required(),
//     soldBy: Joi.object().keys({
//       sellerId: Joi.string().optional(),
//       sellerName: Joi.string().optional()
//     })
//   };
//   return Joi.validate(update, schema);
// };
exports.addProduct = catchAsync_1.catchAsync(async (req, res) => {
    const { soldBy } = req.body;
    if (soldBy.sellerId && soldBy.sellerName) {
        const check = await user_1.UserDataLogin.find({
            _id: soldBy.sellerId,
            username: soldBy.sellerName
        });
        if (check.length !== 0) {
            let newProduct = await product_1.ProductData.create(req.body);
            res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: newProduct
            });
        }
        else {
            res.status(400).json({
                statusCode: 400,
                message: 'error please check the seller name'
            });
        }
    }
});
exports.getProducts = catchAsync_1.catchAsync(async (req, res) => {
    let products = await product_1.ProductData.find().limit(10);
    console.log('ip address', req.ip);
    res.status(200).json({
        statusCode: 200,
        message: 'All product details',
        data: {
            products
        }
    });
});
exports.getProduct = catchAsync_1.catchAsync(async (req, res) => {
    let keyWords = req.query;
    let filter = {};
    // if (keyWords._id) {
    //   filter._id = keyWords._id;
    // } else if (keyWords.sellerId) {
    //   filter['soldBy.sellerId'] = keyWords.sellerId;
    // } else if (keyWords.sellerName) {
    //   filter['soldBy.sellerName'] = keyWords.sellerName;
    // }
    let data = await product_1.ProductData.aggregate([
        { $match: filter },
        {
            $project: {
                _id: 0,
                name: 1,
                category: 1,
                image: 1,
                shortDescription: 1,
                soldBy: 1
            }
        }
    ]);
    res.status(200).json({
        statusCode: 200,
        message: 'required details',
        data: {
            data
        }
    });
});
exports.updateProduct = catchAsync_1.catchAsync(async (req, res) => {
    const { soldBy } = req.body;
    let seller = await user_1.UserDataLogin.findById({ _id: soldBy.sellerId });
    if (seller.username === soldBy.sellerName) {
        let updatedProduct = await product_1.ProductData.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        return res.status(200).json({
            statusCode: 200,
            message: 'success',
            data: updatedProduct
        });
    }
    else {
        res.json({
            statusCode: 400,
            message: `you can't update product please provide valid seller name or id`
        });
    }
});
exports.deleteProduct = catchAsync_1.catchAsync(async (req, res) => {
    const { id } = req.params;
    if (id) {
        let prodSoldBy = await product_1.ProductData.findOne({ _id: id });
        if (prodSoldBy.soldBy.sellerId === req.user.id) {
            await product_1.ProductData.findByIdAndDelete(req.params.id);
            res.status(204).json({
                statusCode: '204',
                message: 'success'
                // data: data
            });
        }
    }
    else {
        res.status(400).json({
            statusCode: '400',
            message: 'error',
            data: `invalid credential try with required credential`
        });
    }
});
//# sourceMappingURL=product.js.map