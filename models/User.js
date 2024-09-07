import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // Ensure the username is unique
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure the email is unique
  },
  password: {
    type: String,
    required: true
  }
});

export const User = mongoose.model("User", userSchema);
