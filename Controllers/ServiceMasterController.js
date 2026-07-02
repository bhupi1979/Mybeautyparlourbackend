const ServiceMaster = require("../Models/ServiceMaster");

//insert services****************
exports.createService =async(req,res)=>{
    try{

const service =
await ServiceMaster.create(
{
  name:req.body.name
}
);

res.status(201).json(
service
);

}
catch(err){

res.status(500).json({
message:err.message
});

}

}
//get services*****************
exports.getServices =
async(req,res)=>{

try{

const services =
await ServiceMaster.find();

res.json(services);

}
catch(err){

res.status(500).json({
message:err.message
});

}

}
// Update
exports.updateService = async (req, res) => {
  try {
    const service =
      await ServiceMaster.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name
        },
        {
          new: true
        }
      );

    res.json(service);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Delete
exports.deleteService = async (req, res) => {
  try {
    await ServiceMaster.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};