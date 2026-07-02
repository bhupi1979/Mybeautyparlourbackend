
const jwt =require("jsonwebtoken");
const User = require("../Models/User");
const Otp = require("../Models/Otp")
//const nodemailer = require("nodemailer");
require('dotenv').config()
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
//sending otp to the user
//************************ */
exports.sendOtp =
async (req,res)=>{

try{

const { mobile,email } = req.body;

const otp =Math.floor(100000 +Math.random()*900000).toString();

await Otp.updateMany({ mobile, isUsed: false }, { $set: { isUsed: true } })
await Otp.create({mobile,email,otp,expiresAt:new Date(Date.now()+10*60*1000)

})

//     const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // 587 ke liye false
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "OTP Verification",
//       html: `
//         <h2>Your OTP is ${otp}</h2>
//         <p>This OTP is valid for 10 minutes.</p>
//       `,
//     };

//     const info = await transporter.sendMail(mailOptions)
//     console.log("Email sent: " + info.response)
const info=await resend.emails.send({
  from: "onboarding@resend.dev",
  to: email,
  subject: "OTP Verification",
  html: `
    <h2>Your OTP is ${otp}</h2>
    <p>This OTP is valid for 10 minutes.</p>
  `,
})
console.log("Email sent: " + info.response)
res.json({success:true,otp});

}
catch(err){
console.error("Error sending OTP:", err)
res.status(500)
.json({
message:
err.message
});

}

}
//end of sending otp to the user***************
//verifying otp of the usere****************
exports.verifyOtp =async (req,res)=>{
try{

const {mobile,email,otp}=req.body;

const data = await Otp.findOne({
  mobile,
  email,
  otp,
  isUsed: false
}).sort({ createdAt: -1 });
;
if(!data){

return res.json({
success:false,
otpvalid:false,
message:
"Invalid OTP"

});

}
console.log("Expiry :", data.expiresAt);
console.log("Current:", new Date());
console.log(" true or false Expired ?", data.expiresAt < new Date())
if(
data.expiresAt
<
new Date()
){
console.log(data.expiresAt)
return res.json({

success:false,
otpexpired:false,
message:
"OTP Expired"

});

}

data.isUsed = true;

await data.save();

let user =await User.findOne({mobile})

if(!user){

return res.json({

success:true,

isRegistered:false

})

}

const token =jwt.sign(
  {id:user._id},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);

res.json({

success:true,

isRegistered:true,

token,

user

})

}
catch(err){
res.status(500)
.json({
message:
err.message
});

}

}
//**********end of verifying the otp of the user */
//REgistering  the user after verifyig the otp***********
exports.register =async (req,res)=>{
  try{
const {name,mobile,email,longitude,latitude}=req.body;
console.log("1");
let user =
await User.findOne({mobile})
console.log("2", user);
if(user){

return res.json({

success:false,
exist:true,
message:
"User already exists"

});

}
console.log("3");
 const usernew =
    await User.create({

      name,
      mobile,
        email,
      isVerified: true,

      location: {
        type: "Point",

        coordinates: [
          longitude,
          latitude
        ]
      }

    });

console.log("4", usernew);

console.log("5");
const token =
jwt.sign(

{
id:usernew._id
},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);

res.json({

success:true,

token,

usernew

});
console.log("TOKEN =", token);
console.log("USER =", usernew);
console.log("TYPE =", typeof usernew);
}
catch(err){

res.status(500)
.json({
message:
err.message
});

}

}
//end of registering the user after verifying the otp
//gert profile of the user**********************


exports.getProfile =
async (req,res)=>{

try{

const user1 =
await User.findById(
  req.user1.id
);

res.json({
  success:true,
  user1
});

}
catch(err){

res.status(500).json({
  success:false,
  message:err.message
});

}

}