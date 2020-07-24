const mongoose = require("mongoose");
const validator = require("validator");
const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
      validate(value) {
        if (!validator.isDate(value, new Date())) {
          throw new Error("invalid date");
        }
      },
    },
    ownerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
