import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      min: 3,
      max: 255,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      max: 255,
      min: 6,
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your phone number"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      max: 1024,
      min: 5,
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
