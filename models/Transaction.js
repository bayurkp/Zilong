const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    memberId: {
      type: mongoose.ObjectId,
      require: true,
    },
    cashierId: {
      type: mongoose.ObjectId,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    details: [
      {
        bookId: {
          type: mongoose.ObjectId,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          required: false,
          default: 0,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Transaction", transactionSchema);
