import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


/**
 * types
 */
export type UserDocument = mongoose.Document & {
  correctPassword: (password: string, userPassword: string) => {};
  password: string;
  email: string;
  username: string;
  passwordChangedAt: Date;
  soldBy: { sellerId: string, sellerName: string };
  gravatar: (size: number) => string;
  changedPasswordAfter: (JWTTimestamp: number) => {};
  createPasswordResetToken: () => {};
  passwordResetToken: string | undefined;
  passwordResetTokenExpires: string | undefined;
  currentPassword: string;
};

/**
 * mongoose schema for collections
 */
const userLoginSchema = new mongoose.Schema({
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
},
  {
    timestamps: true
  });

/**
 * 
 */
userLoginSchema.pre('save', async function (next) {
  const user = this as UserDocument;
  if (!this.isModified('password')) return next();
  // this.password = await bcrypt.hash(this.password, 12);
  user.password = await bcrypt.hash(user.password, 12);
});


/**
 * 
 */
userLoginSchema.pre('save', async function (next) {
  const user = this as UserDocument;
  if (!this.isModified('password')) return next();
  user.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});


/**
 * 
 */
userLoginSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * 
 */
userLoginSchema.methods.changedPasswordAfter = function (JWTTimestamp: number, passwordChangedAt: any) {
  if (this.passwordChangedAt) {
    const changedTimestamp = (
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means password was NOT changed
  return false;
};

/**
 * 
 */
userLoginSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  console.log(this.passwordResetTokenExpires);
  return resetToken;
};

export const UserDataLogin = mongoose.model<UserDocument>("User", userLoginSchema);
