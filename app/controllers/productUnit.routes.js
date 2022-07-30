module.exports = (app) => {
  const productUnits = require("../services/productUnitServices");
  var router = require("express").Router();

  //api product
  router.get("/findAllProductUnit", productUnits.getAllProductUnit);
  router.post("/addProductUnit", productUnits.addProductUnit);
  router.delete("/deleteProductUnit/:price", productUnits.deleteProductUnit);

  app.use("/api/productUnits", router);
};
