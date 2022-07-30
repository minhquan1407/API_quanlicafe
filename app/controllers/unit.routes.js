module.exports = (app) => {
  const units = require("../services/unitServices");
  var router = require("express").Router();

  //api product
  router.post("/addUnit", units.addUnit);
  router.get("/getAllUnit", units.findAllUnit);
  router.get("/getUnitIdProduct/:id", units.findUnitProduct);

  app.use("/api/units", router);
};
