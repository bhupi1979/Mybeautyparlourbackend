const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../Models/Booking");
const BeautyParlour = require("../Models/BeautyParlour");
const User = require("../Models/User");
const nodemailer = require("nodemailer")
require("dotenv").config()
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY)
const razorpay = new Razorpay({

key_id:process.env.RAZORPAY_KEY_ID,

key_secret:process.env.RAZORPAY_SECRET

})
//*********create order */
exports.createOrder = async(req,res)=>{
console.log("create order hit")
try{

const {amount}=req.body;

const options={

amount:amount*100,

currency:"INR",

receipt:"receipt_"+Date.now()

};

const order=
await razorpay.orders.create(options);

res.json({

success:true,

order

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

}
//**********verify order */
exports.verifyPayment = async(req,res)=>{
console.log("Verify API Hit")
console.log(req.body)
try{

const {id}=req.params;

const{

razorpay_order_id,

razorpay_payment_id,

razorpay_signature

}=req.body;

const generatedSignature=

crypto

.createHmac(

"sha256",

process.env.RAZORPAY_SECRET

)

.update(

razorpay_order_id+

"|"+

razorpay_payment_id

)

.digest("hex");

if(

generatedSignature

!==

razorpay_signature

){

return res.status(400).json({

success:false,

message:"Invalid Signature"

});

}

const booking=

await Booking.findByIdAndUpdate(

id,

{

paymentStatus:"Paid",

status:"Completed",

paymentDate:new Date(),

razorpay_order_id,

razorpay_payment_id,

razorpay_signature

},

{

new:true

}

);

if(!booking){

return res.status(404).json({

success:false,

message:"Booking Not Found"

});

}

const parlour=

await BeautyParlour.findById(

booking.parlourId

);

const user=

await User.findById(

booking.userId

);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // 587 ke liye false
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

await transporter.sendMail({

from:process.env.EMAIL_USER,

to:parlour.email,

subject:"Payment Received",

html:`

<h2>Payment Successful</h2>

<p>

Customer :

${user.name}

</p>

<p>

Mobile :

${user.mobile}

</p>

<p>

Service :

${booking.serviceName}

</p>

<p>

Amount :

₹${booking.amount}

</p>

`

});
// await resend.emails.send({
//   from: "onboarding@resend.dev",
//   to: parlour.email,
//   subject: "Payment Received",
//   html: `
//     <h2>Payment Successful</h2>

//     <p>Customer : ${user.name}</p>

//     <p>Mobile : ${user.mobile}</p>

//     <p>Service : ${booking.serviceName}</p>

//     <p>Amount : ₹${booking.amount}</p>
//   `,
// })
res.json({

success:true,

booking

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};


//***endof verify order */