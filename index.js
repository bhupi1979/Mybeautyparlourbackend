require("dotenv").config();

const express =require("express");

const cors =require("cors");

const dbconnect =require("./DB/database");

const serviceRoutes =require("./Routes/ServiceMasterRoutes");

const beautyParlourRoutes =require("./Routes/BeautyParlourRoutes")
const Mainroutes=require("./Routes/MainRoutes")
const paymentroutes=require("./Routes/PaymentRoutes")

const app =express();

app.use(cors());

app.use(express.json());

dbconnect();

app.use("/api/services",serviceRoutes)
app.use("/api/parlours",beautyParlourRoutes)
app.use(Mainroutes)
app.use("/api/payment",paymentroutes)

app.listen(process.env.PORT,async()=>
    {
        
        console.log(`Server Running on port${process.env.PORT}`)
}
)