let mngs=require('mongoose')
require('dotenv').config()
const dbconnect=()=>{
mngs.connect(process.env.URL).then(()=>{
console.log("database connected successfuly")
console.log("Connected DB name:", mngs.connection.name)
})
}
module.exports=dbconnect