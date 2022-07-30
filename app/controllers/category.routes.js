module.exports = (app) => {
  const categories = require("../services/categoryServices");
  var router = require("express").Router();

  //api category
  router.post("/addCategory", categories.addCategory);
  router.get("/allCategory", categories.getAllCategory);
  router.delete("/deleteCategory/:id", categories.deleteCategory);
  router.put("/updateCategory/:id", categories.updateCategory);
  router.get("/getCategoryProducts/:id", categories.getCategoryProducts);

  app.use("/api/categories", router);
};
