import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    notification: {
      type: Array,
      default: [],
    },
    seennotification: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
