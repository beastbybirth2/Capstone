var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "",
  },
  students: {
    type: Object,
    trim: true,
    default: {},
  },
  teachers: {
    type: Object,
    trim: true,
    default: {},
  },
  requests: {
    sent: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    received: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  quizScores: [
    {
      quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        default: {},
      },
      score: {
        type: Number,
        default: -1,
      },
      response: {
        type: [{ type: String }],
        default: [],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

userSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

userSchema.plugin(uniqueValidator);
User = mongoose.model("User", userSchema);

module.exports = User;
