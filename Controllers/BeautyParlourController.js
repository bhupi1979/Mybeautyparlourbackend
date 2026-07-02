const mongoose =
require("mongoose");

const BeautyParlour =require("../Models/BeautyParlour");

const ParlourService =require("../Models/ParlourService");

exports.createParlour =async(req,res)=>{

const session =await mongoose.startSession();

try{

session.startTransaction();

const {
  name,
  email,
  mobile,
  latitude,
  longitude,
  services
}
=
req.body;

const parlour =
await BeautyParlour.create(
[
{
  name,
  email,
  mobile,

  location:{

    type:"Point",

    coordinates:[
      Number(longitude),
      Number(latitude)
    ]

  }

}
],
{
  session
}
);

const parlourId =
parlour[0]._id;

const serviceData =
services.map(
service=>({

  parlourId,

  serviceId:
  service.serviceId,

  price:
  service.price,

  gst:
  service.gst,

  netAmount:
  service.netAmount

})
);

await ParlourService.insertMany(
serviceData,
{
  session
}
);

await session.commitTransaction();

res.status(201).json({

success:true,

message:
"Parlour Created"

});

}
catch(err){

await session.abortTransaction();

res.status(500).json({

success:false,

message:err.message

});

}
finally{

session.endSession();

}

}
//get **********beautyparloure*********
//******************** */

exports.getParlours =
async(req,res)=>{

try{

const parlours =
await BeautyParlour.aggregate([

{
$lookup:{
from:"parlourservices",
localField:"_id",
foreignField:"parlourId",
as:"services"
}
},

{
$unwind:{
path:"$services",
preserveNullAndEmptyArrays:true
}
},

{
$lookup:{
from:"servicemasters",
localField:"services.serviceId",
foreignField:"_id",
as:"serviceInfo"
}
},

{
$unwind:{
path:"$serviceInfo",
preserveNullAndEmptyArrays:true
}
},

{
$group:{

_id:"$_id",

name:{
$first:"$name"
},

mobile:{
$first:"$mobile"
},

email:{
$first:"$email"
},

location:{
$first:"$location"
},

createdAt:{
$first:"$createdAt"
},

services:{
$push:{
 serviceId:
    "$services.serviceId",

serviceName:
"$serviceInfo.name",

price:
"$services.price",

gst:
"$services.gst",

netAmount:
"$services.netAmount"

}

}

}

},

{
$sort:{
createdAt:-1
}
}

]);

res.status(200).json({
success:true,
data:parlours
});

}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

}
///********updata controller ka code */
exports.updateParlour =
async(req,res)=>{

const session =
await mongoose.startSession();

try{

session.startTransaction();

const { id } =
req.params;

const {

name,
mobile,
email,
latitude,
longitude,
services

}
=
req.body;

await BeautyParlour.findByIdAndUpdate(

id,

{
name,
mobile,
email,

location:{
type:"Point",

coordinates:[
Number(longitude),
Number(latitude)
]
}

},

{
session
}

);

await ParlourService.deleteMany(
{
parlourId:id
},
{
session
}
);

const serviceData =
services.map(
service=>({

parlourId:id,

serviceId:
service.serviceId,

price:
service.price,

gst:
service.gst,

netAmount:
service.netAmount

})
);

await ParlourService.insertMany(
serviceData,
{
session
}
);

await session.commitTransaction();

res.status(200).json({

success:true,

message:
"Parlour Updated"

});

}
catch(error){

await session.abortTransaction();

res.status(500).json({

success:false,

message:error.message

});

}
finally{

session.endSession();

}

}
//delete controller ka code *******************//
//************************************* */
exports.deleteParlour =
async(req,res)=>{

const session =
await mongoose.startSession();

try{

session.startTransaction();

const { id } =
req.params;

await ParlourService.deleteMany(
{
parlourId:id
},
{
session
}
);

await BeautyParlour.findByIdAndDelete(
id,
{
session
}
);

await session.commitTransaction();

res.status(200).json({

success:true,

message:
"Parlour Deleted"

});

}
catch(error){

await session.abortTransaction();

res.status(500).json({

success:false,

message:error.message

});

}
finally{

session.endSession();

}

}
//***********************nearby parlour
//******************************* */

exports.getNearbyParlours =
async(req,res)=>{


try{

const {
latitude,
longitude,
minDistance,
maxDistance
}
=
req.query;

const parlours =
await BeautyParlour.aggregate([

{
$geoNear:{
near:{
type:"Point",

coordinates:[
Number(longitude),
Number(latitude)
]
},

distanceField:"distance",

minDistance:
Number(minDistance),

maxDistance:
Number(maxDistance),

spherical:true
}
},

{
$lookup:{
from:"parlourservices",

localField:"_id",

foreignField:"parlourId",

as:"services"
}
},

{
$unwind:{
path:"$services",
preserveNullAndEmptyArrays:true
}
},

{
$lookup:{
from:"servicemasters",

localField:
"services.serviceId",

foreignField:"_id",

as:"serviceInfo"
}
},

{
$unwind:{
path:"$serviceInfo",
preserveNullAndEmptyArrays:true
}
},

{
$group:{

_id:"$_id",

name:{
$first:"$name"
},

mobile:{
$first:"$mobile"
},

email:{
$first:"$email"
},

distance:{
$first:"$distance"
},

services:{
$push:{
serviceId:
    "$services.serviceId",
name:
"$serviceInfo.name",

price:
"$services.price",

gst:
"$services.gst",

netAmount:
"$services.netAmount"

}

}

}

}

]);

res.status(200).json({

success:true,

parlours

});

}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

}
