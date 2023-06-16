const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "cashier", "regular", "member"],
    default: "member",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
