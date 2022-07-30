const db = require("../models");

const Unit = db.units;
const Product = db.products;

const addUnit = async (req, res) => {
  try {
    const unit = await Unit.create({
      name: req.body.name,
      price: req.body.price,
    });
    res.status(200).json(unit);
  } catch (error) {}
};
const findAllUnit = async (req, res) => {
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = 0;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber;
  }

  let size = 6;
  if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 6) {
    size = sizeAsNumber;
  }
  try {
    const data = await Unit.findAndCountAll({
      limit: size,
      offset: page * size,
      include: [
        {
          model: Product,
          as: "products",
          attributes: [
            "id",
            "image",
            "title",
            "description",
            "price",
            "published",
          ],
          through: {
            attributes: [],
          },
        },
      ],
    });
    res.status(200).json({
      data: data.rows,
      total_page: Math.ceil(data.count / size),
      currentPage: page ? +page : 0,
      limit: size,
      page: Math.ceil(data.count / size),
      total: data.count,
    });
  } catch (error) {
    res.sendStatus(400);
  }
};

const findUnitProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Unit.findOne({
      include: [
        {
          model: Product,
          as: "products",
          attributes: [
            "id",
            "image",
            "title",
            "description",
            "price",
            "published",
          ],
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
// const paginationUnit = async (req, res) => {
//   const pageAsNumber = Number.parseInt(req.query.page);
//   const sizeAsNumber = Number.parseInt(req.query.size);

//   let page = 0;
//   if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
//     page = pageAsNumber;
//   }

//   let size = 6;
//   if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 6) {
//     size = sizeAsNumber;
//   }

//   const units = await Unit.findAndCountAll({
//     limit: size,
//     offset: page * size,
//   });
//   res
//     .status(200)
//     .json({ content: units.rows, totalPages: Math.ceil(units.count / size) });
// };

module.exports = {
  findUnitProduct,
  findAllUnit,
  addUnit,
};
