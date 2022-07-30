module.exports = (app) => {
  var router = require("express").Router();
  const services = require("../services/userServices");
  const { authJwt } = require("../middleware");
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  router.get("/all", services.allAccess);

  router.get("/user", [authJwt.verifyToken], services.userBoard);

  router.get(
    "/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    services.moderatorBoard
  );

  router.get(
    "/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    services.adminBoard
  );
  app.use("/api/test", router);
};
