"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * mongoose schema for collections
 */
const userLoginSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, 'A user must have a username'],
        unique: true,
        trim: true
    },
    email: {
        required: [true, 'A user must fill email'],
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'User must fill the password'],
        minlength: 8,
        maxlength: 10,
        unique: false,
        select: false,
        trim: true
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    dob: {
        type: Date,
        required: [true, 'User must have date of birth'],
        default: new Date() // just for getting ISO date
    },
    role: {
        type: String,
        enum: ['user', 'seller', 'admin'],
        default: 'user'
    },
    image: {
        type: String,
        required: [true, 'Every user must have an image'],
        unique: false,
        trim: true
    }
}, {
    timestamps: true
});
/**
 *
 */
userLoginSchema.pre('save', async function (next) {
    const user = this;
    if (!this.isModified('password'))
        return next();
    // this.password = await bcrypt.hash(this.password, 12);
    user.password = await bcrypt_1.default.hash(user.password, 12);
});
/**
 *
 */
userLoginSchema.pre('save', async function (next) {
    const user = this;
    if (!this.isModified('password'))
        return next();
    user.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});
/**
 *
 */
userLoginSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt_1.default.compare(candidatePassword, userPassword);
};
/**
 *
 */
userLoginSchema.methods.changedPasswordAfter = function (JWTTimestamp, passwordChangedAt) {
    if (this.passwordChangedAt) {
        const changedTimestamp = (this.passwordChangedAt.getTime() / 1000,
            10);
        return JWTTimestamp < changedTimestamp;
    }
    // False means password was NOT changed
    return false;
};
/**
 *
 */
userLoginSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    console.log(this.passwordResetTokenExpires);
    return resetToken;
};
exports.UserDataLogin = mongoose_1.default.model("User", userLoginSchema);
//# sourceMappingURL=user.js.map