import mongoose from "mongoose";
import { compare, hash, genSalt } from "bcrypt";

interface UserDocument extends mongoose.Document {
  email: string;
  username: string;
  role: "admin" | "school_admin" | "user";
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  createdAt: Date;
}

interface Methods {
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument, {}, Methods>(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      trim: true,
      maxlength: [50, "Username cannot be more than 50 characters"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      trim: true,
      maxlength: [50, "Email cannot be more than 50 characters"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    role: {
      type: String,
      enum: ["user", "school_admin", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      trim: true,
      minlength: [6, "Password cannot be less than 6 characters"],
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    console.log(password, this.password);
    return await compare(password, this.password);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
