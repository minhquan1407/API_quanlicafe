const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

const addTutorial = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).json({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create a Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  };
  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};
const findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
  Tutorial.findAll({ where: condition })
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
const findOne = (req, res) => {
  const id = req.params.id;
  Tutorial.findByPk(id)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({
          message: `Cannot find Tutorial with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};
const updateTutorial = (req, res) => {
  console.log("====================");
  const id = req.params.id;
  console.log("check", req.body);
  Tutorial.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.json({
          message: "Tutorial was updated successfully.",
        });
      } else {
        res.json({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        });
      }
      console.log("check num: ", num);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};
const deleteTutorial = (req, res) => {
  const id = req.params.id;
  Tutorial.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.json({
          message: "Tutorial was deleted successfully!",
        });
      } else {
        res.json({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};
const deleteAllTutorial = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.json({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};
module.exports = {
  addTutorial,
  findAll,
  findOne,
  updateTutorial,
  deleteTutorial,
  deleteAllTutorial,
};
