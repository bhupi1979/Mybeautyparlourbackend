const mongoose = require("mongoose");

const bookingSchema =
new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

parlourId:{
type:mongoose.Schema.Types.ObjectId,
ref:"BeautyParlour",
required:true
},

serviceId:{
type:mongoose.Schema.Types.ObjectId,

required:true
},

serviceName:{
type:String,
required:true
},

amount:{
type:Number,
required:true
},

status:{
type:String,
enum:[
"Pending",
"Accepted",
"Rejected",
"Completed"
],
default:"Pending"
},

bookingDate:{
type:Date,
default:Date.now
},
paymentStatus:{
    type:String,
    enum:["Pending","Paid","Failed"],
    default:"Pending"
},

paymentMethod:{
    type:String,
    enum:["UPI","Cash"],
    default:"UPI"
},

utrNumber:{
    type:String,
    default:""
},
razorpay_payment_id:{
type:String
},

razorpay_order_id:{
type:String
},

razorpay_signature:{
type:String
},
paymentDate:{
    type:Date
}

},{
timestamps:true
});

module.exports =
mongoose.model(
"Booking",
bookingSchema
);