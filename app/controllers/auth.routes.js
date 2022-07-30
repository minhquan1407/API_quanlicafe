module.exports = (app) => {
  var router = require("express").Router();
  const services = require("../services/authServices");
  const { verifySignUp, authJwt } = require("../middleware/index");
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  router.post(
    "/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    services.signup
  );

  router.post("/signIn", services.signIn);

  router.post("/signOut", services.signOut);

  router.post("/forgot", services.forgotPassword);

  router.post("/activation", services.activateEmail);

  router.post("/reset", authJwt.auth, services.resetPassword);

  app.use("/api/auth", router);
};
