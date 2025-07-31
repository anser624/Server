const { mongoose } = require("mongoose");
const validator = require('validator')


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      minLength: 3,
      trim:true,
      lowercase:true
    },
    email: {
      type: String,
      require: true,
      unique: true,
      minLength: 8,
      trim:true,
      lowercase:true,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
      trim:true,
      
    },
  },
  {
    collection: "Info",
    timestamps: true,
  }
);

const User = mongoose.model("Info", userSchema);

module.exports = {
  User
};
