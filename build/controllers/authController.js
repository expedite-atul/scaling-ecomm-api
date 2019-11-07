"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const catchAsync_1 = require("../utils/catchAsync");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../utils/appError");
/**
 * utility func to generate token
 * @param id id to be decoded in JWT
 */
const signToken = (id) => jsonwebtoken_1.default.sign({ id }, 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN
});
/**
 * utility function to manage response
 * @param user user data from the front-end
 * @param statusCode response of the api
 * @param res json data
 */
const createToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const options = {
        path: '/',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    res.cookie('jwt', token, options);
    user.password = undefined;
    user.passwordChangedAt = undefined;
    res.status(statusCode).json({
        statusCode: statusCode,
        message: 'success',
        token: token,
        data: user
    });
};
/**
 * path /users --> to get all the users
 */
exports.users = catchAsync_1.catchAsync(async (req, res) => {
    const checkUserName = await user_1.UserDataLogin.find();
    if (checkUserName.length === 0) {
        return res.status(400).json({
            statusCode: 400,
            message: `user doesn't exist`
        });
    }
    let users = await user_1.UserDataLogin.aggregate([
        { $project: { _id: 1, username: 1, role: 1, image: 1 } }
    ]);
    res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: users
    });
});
/**
 * path /users/:id
 */
exports.deleteSellerOrUser = catchAsync_1.catchAsync(async (req, res) => {
    let data = await user_1.UserDataLogin.findByIdAndDelete(req.params.id);
    res.status(204).json({
        statusCode: '204',
        message: 'success'
    });
});
/**
 * path /signup
 */
exports.signup = catchAsync_1.catchAsync(async (req, res) => {
    let newUser = await user_1.UserDataLogin.create(req.body);
    console.log(newUser);
    createToken(newUser, 201, res);
});
exports.login = catchAsync_1.catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    // check if username and password is existing
    if (!username || !password) {
        return next(new appError_1.AppError({ message: 'please provide username and password!', statusCode: 400 }));
    }
    // console.log(username);
    //to check whether the given username provided exists or not
    const checkUserName = await user_1.UserDataLogin.find({
        username: req.body.username
    });
    // console.log('hi',checkUserName.length);
    if (checkUserName.length === 0) {
        return res.status(400).json({
            statusCode: 400,
            message: `user doesn't exist`
        });
    }
    const user = await user_1.UserDataLogin.findOne({ username }).select('+password');
    const correct = user.correctPassword(password, user.password);
    if (!user || !correct) {
        return next(new appError_1.AppError({ message: 'Incorrect username or password', statusCode: 401 }));
    }
    createToken(user, 200, res);
});
exports.protect = catchAsync_1.catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return next(new appError_1.AppError({ message: 'You are not logged in! Please log in to get access.', statusCode: 401 }));
    }
    // 2) Verification token
    const decoded = await util_1.promisify(jsonwebtoken_1.default.verify)(token, 'secret');
    const currentUser = await user_1.UserDataLogin.findById(decoded.id);
    if (!currentUser) {
        return next(new appError_1.AppError({ message: 'The user belonging to this token does no longer exist.', statusCode: 401 }));
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError_1.AppError({ message: 'User recently changed password! Please log in again.', statusCode: 401 }));
    }
    req.user = currentUser;
    next();
});
/**
 * utility func restrictTo
 * @param roles admin seller buyer
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError_1.AppError({ message: 'You do not have permission to perform this action', statusCode: 403 }));
        }
        next();
    };
};
// export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   const user = await UserdataLogin.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new AppError({ message: 'There is no such email address found!!\n please check the email again', statusCode: 403 }));
//   }
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });
//   const resetURL = `${req.protocol}://${req.get(
//     'host'
//   )}/api/v1/ecommerce/resetPassword/${resetToken}`;
//   const message = `Forgot your password ? Confirm your password to: ${resetURL}.\n`;
//   try {
//     await sendEmail({
//       email: user.email,
//       subject: `your password reset token[valid only for next 10 minutes]`,
//       message
//     });
//     res.status(200).json({
//       statusCode: 200,
//       status: 'success',
//       message: 'If email provided exists then check your mail for reset token'
//     });
//   } catch (error) {
//     user.passwordResetToken = undefined;
//     user.passwordResetTokenExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     return next(new AppError({ message: `Some error occured please try again later`, statusCode: 500 }));
//   }
// });
exports.resetPassword = catchAsync_1.catchAsync(async (req, res, next) => {
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await user_1.UserDataLogin.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpires: { $gt: Date.now() }
    }).select('+password');
    if (!user) {
        return next(new appError_1.AppError({ message: 'Token is invalid or has expired', statusCode: 400 }));
    }
    if (await bcrypt_1.default.compare(req.body.password, user.password)) {
        return res.status(400).json({
            statusCode: 400,
            status: 'fail',
            message: 'new password should not be old password'
        });
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();
    createToken(user, 200, res);
});
exports.updatePassword = catchAsync_1.catchAsync(async (req, res, next) => {
    let user = await user_1.UserDataLogin.findById(req.user.id).select('+password');
    if (!user.correctPassword(req.body.currentPassword, user.password)) {
        return next(new appError_1.AppError({ message: `current password is wrong please try again`, statusCode: 400 }));
    }
    console.log(req.body.currentPassword, user.password);
    if (await bcrypt_1.default.compare(req.body.password, user.password)) {
        return res.status(400).json({
            statusCode: 400,
            status: 'fail',
            message: 'new password should not be old password'
        });
    }
    user.password = req.body.password;
    user.currentPassword = req.body.currentPassword;
    await user.save();
    createToken(user, 200, res);
});
//# sourceMappingURL=authController.js.map