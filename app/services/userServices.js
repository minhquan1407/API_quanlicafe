const allAccess = (req, res) => {
  res.status(200).json("Public Content.");
};

const userBoard = (req, res) => {
  res.status(200).json("User Content.");
};

const adminBoard = (req, res) => {
  res.status(200).json("Admin Content.");
};

const moderatorBoard = (req, res) => {
  res.status(200).json("Moderator Content.");
};
module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
};
