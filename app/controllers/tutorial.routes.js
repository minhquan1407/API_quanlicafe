module.exports = (app) => {
  const tutorials = require("../services/tutorialServices");
  var router = require("express").Router();
  // Create a new Tutorial
  router.post("/", tutorials.addTutorial);
  router.get("/", tutorials.findAll);
  router.get("/:id", tutorials.findOne);
  router.delete("/:id", tutorials.deleteTutorial);
  router.delete("/", tutorials.deleteAllTutorial);
  router.put("/:id", tutorials.updateTutorial);

  app.use("/api/tutorials", router);
};
