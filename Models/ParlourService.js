const mongoose =require("mongoose");

const parlourServiceSchema =new mongoose.Schema({

  parlourId:{
    type:
    mongoose.Schema.Types.ObjectId,

    ref:"BeautyParlour",

    required:true
  },

  serviceId:{
    type:
    mongoose.Schema.Types.ObjectId,

    ref:"ServiceMaster",

    required:true
  },

  price:{
    type:Number,
    required:true
  },

  gst:{
    type:Number,
    required:true
  },

  netAmount:{
    type:Number,
    required:true
  }

},
{
  timestamps:true
});

module.exports =mongoose.model("ParlourService",parlourServiceSchema);