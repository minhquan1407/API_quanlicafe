const db = require("../models");

const Category = db.categories;
const Product = db.products;
const Op = db.Sequelize.Op;

const addCategory = async (req, res) => {
  let info = {
    name: req.body.name,
  };
  const category = await Category.create(info);
  res.status(200).json(category);
  console.log(category);
};

const getAllCategory = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  Category.findAll({ where: condition })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

const updateCategory = async (req, res) => {
  let id = req.params.id;
  const category = await Category.update(req.body, { where: { id: id } });

  res.status(200).json(category);
};

const deleteCategory = async (req, res) => {
  let id = req.params.id;
  await Category.destroy({ where: { id: id } });
  res.status(200).json("Product is deleted!");
};

//connect one to many relation Category and Product
const getCategoryProducts = async (req, res) => {
  const id = req.params.id;

  const data = await Category.findOne({
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
    where: { id: id },
  });
  res.status(200).json(data);
};
module.exports = {
  addCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
};
