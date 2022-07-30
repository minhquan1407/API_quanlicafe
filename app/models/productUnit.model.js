const db = require("./index");

const product = db.products;
const unit = db.units;
module.exports = (sequelize, DataTypes) => {
  const ProductUnit = sequelize.define("product_unit", {
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: product,
        key: "id",
      },
    },
    unitId: {
      type: DataTypes.INTEGER,
      references: {
        model: unit,
        key: "id",
      },
    },
    nameUnit: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
  });

  return ProductUnit;
};
