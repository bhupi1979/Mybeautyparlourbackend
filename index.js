require("dotenv").config();

const express =require("express");

const cors =require("cors");

const dbconnect =require("./DB/Database");

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running on port ${PORT}`);
}
);
