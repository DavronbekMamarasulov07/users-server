import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: false },
    isFrozen: { type: Boolean, default: false },
    balance: {type: Number, default: 0},
    role: {
      type: String,
      enum: ["admin", "student", "mentor", "super_admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

// 🔥 REGISTER vaqtida HASH
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // next() kerak emas

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});



export default mongoose.model("User", userSchema);

