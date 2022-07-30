module.exports = (sequelize, Sequelize) => {
  const Unit = sequelize.define("unit", {
    name: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.INTEGER,
    },
  });
  return Unit;
};
