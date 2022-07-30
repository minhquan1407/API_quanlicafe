module.exports = (app) => {
  const products = require("../services/productServices");
  var router = require("express").Router();

  //api product
  router.post("/addProduct/:id", products.upload, products.addProduct);
  router.get("/allProduct", products.getAllProduct);
  router.delete("/deleteProduct/:id", products.deleteProduct);
  router.put("/updateProduct/:id", products.updateProduct);
  router.get("/getProductUnit", products.findAllProduct);
  router.get("/getIdProductUnit/:id", products.getProductUnit);
  // router.get("/getProductUnitByProduct", products.getProductUnitByProduct);

  app.use("/api/products", router);
};
