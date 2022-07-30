// const { sequelize } = require("../models");
const db = require("../models");

const ProductUnit = db.productUnit;

const getAllProductUnit = async (req, res) => {
  const data = await ProductUnit.findAll({});
  res.status(200).json(data);
};
const addProductUnit = async (req, res) => {
  // const t = await sequelize.transaction();
  try {
    let data = {
      unitId: req.body.unitId,
      productId: req.body.productId,
      nameUnit: req.body.nameUnit,
      price: req.body.price,
    };

    if (!data.unitId || !data.productId || !data.price || !data.nameUnit) {
      return res.sendStatus(400);
    }
    const unit = await ProductUnit.create(data);
    // t.commit();
    res.status(200).json(unit);
  } catch (error) {
    // t.rollback();
  }
};

const deleteProductUnit = async (req, res) => {
  let price = req.params.price;
  const data = await ProductUnit.destroy({ where: { price: price } });
  res.status(200).json(data);
};
module.exports = {
  addProductUnit,
  getAllProductUnit,
  deleteProductUnit,
};
