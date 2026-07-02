const mongoose =require("mongoose");

const serviceMasterSchema =new mongoose.Schema({

  name:{
    type:String,
    required:true,
    unique:true
  }

},
{
  timestamps:true
});

module.exports =mongoose.model("ServiceMaster",serviceMasterSchema);