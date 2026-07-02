const mongoose =
require("mongoose");

const beautyParlourSchema =
new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  mobile:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true,
    
  },

  location:{

    type:{
      type:String,
      enum:["Point"],
      default:"Point"
    },

    coordinates:{
      type:[Number],
      default:[0,0]
    }

  }

},
{
  timestamps:true
});

beautyParlourSchema.index({
  location:"2dsphere"
});

module.exports =mongoose.model("BeautyParlour",beautyParlourSchema);