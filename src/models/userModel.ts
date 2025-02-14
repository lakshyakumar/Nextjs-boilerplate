import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
      min: 3,
      max: 255,
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
      min: 3,
      max: 255,
    },
    email: {
      type: String,
      max: 255,
      min: 6,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      max: 1024,
      min: 5,
    },
    username: {
      type: String,
      required: [true, "Please enter your username"],
      max: 255,
      min: 5,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    mfa_enabled: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    emailVerificationOTP: String,
    phoneVerificationOTP: String,
    verificationOTPExpiry: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Create compound indexes with partial filter expressions
userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $ne: null } },
  }
);

userSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { phoneNumber: { $ne: null } },
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
