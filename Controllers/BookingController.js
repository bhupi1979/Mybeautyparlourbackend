const BeautyParlour = require("../Models/BeautyParlour");
const Booking = require("../Models/Booking")
const crypto = require("crypto")
const Razorpay = require("razorpay");
require("dotenv").config();
const User = require("../Models/User");
const nodemailer = require("nodemailer");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY)
exports.createBooking =
async(req,res)=>{

try{
console.log(req.body);
const booking =await Booking.create(
{

...req.body,

paymentStatus:"Pending"

}
);


//nodemailer se email parlourowener ko jayega
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})
const parlour =
await BeautyParlour.findById(
  req.body.parlourId
);

const user =
await User.findById(
  req.body.userId
);

if(parlour?.email){
// await resend.emails.send({
//   from: "onboarding@resend.dev",
//   to: parlour.email,
//   subject: "Booking Received",
//   html: `
//     <h2>New Booking Received</h2>

//  <hr/>

// <h3>Customer Details</h3>

// <p>
// <b>Name:</b>
// ${user?.name}
// </p>

// <p>
//  <b>Mobile:</b>
//  ${user?.mobile}
//  </p>

//  <p>
// <b>Email:</b>
// ${user?.email}
//  </p>

//  <hr/>

//  <h3>Booking Details</h3>

//  <p>
//  <b>Service:</b>
//  ${req.body.serviceName}
//  </p>

//  <p>
//  <b>Amount:</b>
//  ₹${req.body.amount}
//  </p>

//  <p>
//  <b>Status:</b>
//  Pending
//  </p>

//  <p>
//  <b>Booking Date:</b>
//  ${new Date().toLocaleString()}
//  </p>

//   `
// })
await transporter.sendMail({

from:process.env.EMAIL_USER,

to:parlour.email,

subject:"New Booking Received",

html:`

<h2>New Booking Received</h2>

<hr/>

<h3>Customer Details</h3>

<p>
<b>Name:</b>
${user?.name}
</p>

<p>
<b>Mobile:</b>
${user?.mobile}
</p>

<p>
<b>Email:</b>
${user?.email}
</p>

<hr/>

<h3>Booking Details</h3>

<p>
<b>Service:</b>
${req.body.serviceName}
</p>

<p>
<b>Amount:</b>
₹${req.body.amount}
</p>

<p>
<b>Status:</b>
Pending
</p>

<p>
<b>Booking Date:</b>
${new Date().toLocaleString()}
</p>

`
});

}
//sending data to frontend
res.status(201).json({success:true,booking})
}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

}
//*********getUserBookiing */
//*********************** */
exports.getUserBookings =
async(req,res)=>{

try{

const {userId}=req.params;

const bookings =
await Booking
.find({userId})
.populate(
"parlourId",
"name mobile"
)
.sort({
createdAt:-1
});

res.json({
success:true,
bookings
});

}
catch(error){

res.status(500).json({
message:error.message
});

}

}
//********parlour wise booking** */
//********************* */ */
exports.getParlourBookings =
async(req,res)=>{

try{

const {parlourId}=req.params;

const bookings =
await Booking
.find({parlourId})
.populate(
"userId",
"name mobile email"
)
.sort({
createdAt:-1
});

res.json({
success:true,
bookings
});

}
catch(error){

res.status(500).json({
message:error.message
});

}

}
//************Update approve or reject booking***** */
exports.updateBookingStatus =
async(req,res)=>{

try{

const {id}=req.params;

const {status}=req.body;

const booking =
await Booking.findByIdAndUpdate(

id,

{
status
},

{
new:true
}

);

res.json({
success:true,
booking
});

}
catch(error){

res.status(500).json({
message:error.message
});

}

}
//************save payment cotroller with upi intent */


// exports.savePayment = async(req,res)=>{

// try{

// const { id } = req.params;

// const { utrNumber } = req.body;

// if(!utrNumber){

// return res.status(400).json({
// success:false,
// message:"UTR Number Required"
// });

// }

// const booking =
// await Booking.findByIdAndUpdate(

// id,

// {
// utrNumber,
// paymentStatus:"Paid",
// status:"Completed",
// paymentDate:new Date()
// },

// {
//     returnDocument:"after"
//   }

// );

// if(!booking){

// return res.status(404).json({
// success:false,
// message:"Booking Not Found"
// });

// }
// //payment success sent to email of parlour owern
// //***************** */
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// })
// const parlour =
// await BeautyParlour.findById(
//   booking.parlourId
// );
// console.log("**this is servicename**",booking.serviceName)
// const user =
// await User.findById(
//   booking.userId
// );

// if(parlour?.email){

// await transporter.sendMail({

// from:process.env.EMAIL_USER,

// to:parlour.email,

// subject:"Payment Done",

// html:`

// <h2>Payment by custome done</h2>

// <hr/>

// <h3>Customer Details</h3>

// <p>
// <b>Name:</b>
// ${user?.name}
// </p>

// <p>
// <b>Mobile:</b>
// ${user?.mobile}
// </p>

// <p>
// <b>Email:</b>
// ${user?.email}
// </p>

// <hr/>

// <h3>Booking Details</h3>

// <p>
// <b>Service:</b>
// ${booking.serviceName||booking.name}
// </p>

// <p>
// <b>Amount:</b>
// ₹${booking.amount}
// </p>

// <p>
// <b>Status:</b>
// Completed
// </p>

// <p>
// <b>Payment Date:</b>
// ${new Date().toLocaleString()}
// </p>

// `
// });

// }
// //end of email sent 
// res.status(200).json({
// success:true,
// message:"Payment Updated",
// booking
// });

// }
// catch(error){

// res.status(500).json({
// success:false,
// message:error.message
// });

// }

// };
//save payment with razor pay*********************//
exports.savePayment = async(req,res)=>{

try{

const {id}=req.params;

const{

razorpay_payment_id,

razorpay_order_id,

razorpay_signature

}=req.body;
//crypot razor pay**********
const generated_signature = crypto
.createHmac(
"sha256",
process.env.RAZORPAY_SECRET
)
.update(
razorpay_order_id + "|" + razorpay_payment_id
)
.digest("hex");

if(generated_signature !== razorpay_signature){

return res.status(400).json({

success:false,

message:"Invalid Signature"

});

}
//endof cryptp razor pay
const booking =
await Booking.findById(id);

if(!booking){

return res.status(404).json({

success:false,

message:"Booking Not Found"

});

}

booking.paymentStatus="Paid";

booking.status="Completed";

booking.paymentDate=new Date();

booking.razorpay_payment_id=
razorpay_payment_id;

booking.razorpay_order_id=
razorpay_order_id;

booking.razorpay_signature=
razorpay_signature;

await booking.save();


//payment success sent to email of parlour owern
//***************** */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})
const parlour =
await BeautyParlour.findById(
  booking.parlourId
);
console.log("**this is servicename**",booking.serviceName)
const user =
await User.findById(
  booking.userId
);

if(parlour?.email){

await transporter.sendMail({

from:process.env.EMAIL_USER,

to:parlour.email,

subject:"Payment Done",

html:`

<h2>Payment by custome done</h2>

<hr/>

<h3>Customer Details</h3>

<p>
<b>Name:</b>
${user?.name}
</p>

<p>
<b>Mobile:</b>
${user?.mobile}
</p>

<p>
<b>Email:</b>
${user?.email}
</p>

<hr/>

<h3>Booking Details</h3>

<p>
<b>Service:</b>
${booking.serviceName||booking.name}
</p>

<p>
<b>Amount:</b>
₹${booking.amount}
</p>

<p>
<b>Status:</b>
Completed
</p>

<p>
<b>Payment Date:</b>
${new Date().toLocaleString()}
</p>

`
});

}

res.json({

success:true

});

}
catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

}
//paymentcontroller