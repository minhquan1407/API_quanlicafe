const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
var morgan = require("morgan");
const cookieSession = require("cookie-session");
var corsOptions = {
  origin: "http://localhost:3000",
};
app.use(morgan("combined"));
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Quan." });
});
app.use(
  cookieSession({
    name: "zed-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
    sameSite: "strict",
  })
);
// set port, listen for requests
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}
const PORT = process.env.PORT || 8080;
require("./app/controllers/tutorial.routes")(app);
require("./app/controllers/category.routes")(app);
require("./app/controllers/product.routes")(app);
require("./app/controllers/unit.routes")(app);
require("./app/controllers/productUnit.routes")(app);
require("./app/controllers/auth.routes")(app);
require("./app/controllers/user.routes")(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
