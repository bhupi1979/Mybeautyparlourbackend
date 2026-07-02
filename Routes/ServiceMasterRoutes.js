const router =require("express").Router();
const {createService,getServices, updateService, deleteService}=require("../Controllers/ServiceMasterController")

router.post("/",createService)

router.get("/",getServices)
//*******parlour routes */
router.put("/:id", updateService);

router.delete("/:id", deleteService);

module.exports =router;