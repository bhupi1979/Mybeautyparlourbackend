const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
   email:{
      type:String,
      required:true
   },
    mobile: {
      type: String,
      required: true,
      unique: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },

      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({
  location: "2dsphere"
});

const User = mongoose.model(
  "User",
  userSchema
);

module.exports = User;