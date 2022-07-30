const db = require("../models");

const multer = require("multer");
const path = require("path");
const { sequelize } = require("../models");
const Product = db.products;
const Unit = db.units;
// const ProductUnit = db.productUnit;

const addProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    let data = {
      categoryId: id,
      image: req.path.image,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      published: req.body.published ? req.body.published : false,
    };
    const product = await Product.create(data, { transaction: t });
    res.status(200).send(product);
    t.commit();
    console.log(product);
  } catch (error) {
    t.rollback();
  }
};

const getAllProduct = async (req, res) => {
  let products = await Product.findAll({});
  res.status(200).send(products);
};

const updateProduct = async (req, res) => {
  let id = req.params.id;
  const product = await Product.update(req.body, { where: { id: id } });
  res.status(200).send(product);
};

const deleteProduct = async (req, res) => {
  let id = req.params.id;
  await Product.destroy({ where: { id: id } });
  res.status(200).send("Product is deleted");
};

//upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("image");

const findAllProduct = async (req, res) => {
  try {
    const data = await Product.findAll({
      include: [
        {
          model: Unit,
          as: "units",
        },
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(400);
  }
};

const getProductUnit = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Product.findOne({
      include: [
        {
          model: Unit,
          as: "units",
          attributes: ["id", "name", "price"],
          through: {
            attributes: ["productId", "unitId"],
          },
        },
      ],
      where: { id: id },
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(400);
  }
};

// const getProductUnitByProduct = async (req, res) => {
//   const data = await Product.findAll({
//     include: [
//       {
//         model: ProductUnit,
//         as: "product_unit",
//       },
//     ],
//   });
//   res.status(200).json(data);
// };
module.exports = {
  addProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  upload,
  findAllProduct,
  getProductUnit,
};
