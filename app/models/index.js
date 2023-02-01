const dbConfig = require("../config/config.json");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    operatorsAliases: 0,

    pool: {
      max: 5,
      min: 0,
      acquire: 3000,
      idle: 10000,
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tutorials = require("../models/tutorial.model")(sequelize, Sequelize);
db.categories = require("../models/category.model")(sequelize, DataTypes);
db.products = require("../models/product.model")(sequelize, DataTypes);
db.units = require("../models/unit.model")(sequelize, DataTypes);
db.productUnit = require("../models/productUnit.model")(sequelize, DataTypes);
db.user = require("../models/user.model")(sequelize, DataTypes);
db.role = require("../models/role.model")(sequelize, DataTypes);
db.sequelize.sync({ alter: true }).then(() => {
  console.log("yes re-sync done!");
  // initial();
});
//o-t-m
db.categories.hasMany(db.products, {
  foreignKey: "categoryId",
  as: "product",
});
db.products.belongsTo(db.categories, {
  foreignKey: "categoryId",
  as: "category",
});

//o-t-m
// db.products.hasMany(db.productUnit, {
//   foreignKey: "productId",
//   as: "productUnit",
// });
// db.productUnit.belongsTo(db.products, {
//   foreignKey: "productId",
//   as: "product",
// });
//m-t-m units && product
db.units.belongsToMany(db.products, {
  through: "product_unit",
  as: "products",
  foreignKey: "unitId",
});
db.products.belongsToMany(db.units, {
  through: "product_unit",
  as: "units",
  foreignKey: "productId",
});

//m-t-m user && role
db.role.belongsToMany(db.user, {
  through: "user_roles",
  otherKey: "userId",
  foreignKey: "roleId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  otherKey: "roleId",
  foreignKey: "userId",
});
db.ROLES = ["user", "admin", "moderator"];
function initial() {
  db.role.create({
    id: 1,
    name: "user",
  });

  db.role.create({
    id: 2,
    name: "moderator",
  });

  db.role.create({
    id: 3,
    name: "admin",
  });
}
module.exports = db;
