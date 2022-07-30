const db = require("../models");
// const { sequelize } = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const sendMail = require("./sendMailServices");
const signup = async (req, res) => {
  // const t = await sequelize.transaction();
  try {
    let data = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    };
    if (!data.username || !data.email || !data.password)
      return res.status(400).json({ msg: "Please fill in all fields." });
    if (!validateEmail(data.email))
      return res.status(400).json({ msg: "Invalid emails." });
    if (data.password.length < 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });

    const user = await User.create(data);

    let result;
    if (req.body.role) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.role,
          },
        },
      });

      result = user.setRoles(roles);
    } else {
      // user has role = 1
      result = user.setRoles([1]);
    }

    const activation_token = createActivationToken(data);

    const url = `${config.CLIENT_URL}/user/activate/${activation_token}`;
    sendMail(data.email, url, "Verify your email address");

    res.status(200).json({
      msg: "Register Success! Please activate your email to start.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const signIn = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;

    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const activateEmail = async (req, res) => {
  try {
    const { activation_token } = req.body;
    const user = jwt.verify(activation_token, config.ACTIVATION_TOKEN_SECRET);

    const { username, email, password } = user;

    const check = await User.findOne({ where: { email: email } });
    if (check)
      return res.status(400).json({ msg: "This email already exists." });

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    res.json({ msg: "Account has been activated!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    // const { email } = req.body;
    const email = req.body.email;
    const user = await User.findOne({ where: { email: email } });
    if (!user)
      return res.status(400).json({ msg: "This email does not exist." });

    const access_token = createAccessToken({ id: user.id });
    const url = `${config.CLIENT_URL}/user/reset/${access_token}`;

    sendMail(email, url, "Reset your password");
    res.json({ msg: "Re-send the password, please check your email." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    console.log(password);
    const passwordHash = await bcrypt.hash(password, 12);

    await User.findOne({ where: { id: req.user.id, password: passwordHash } });
    await User.update(
      { password: passwordHash },
      { where: { id: req.user.id } }
    );

    res.json({ msg: "Password successfully changed!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const signOut = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).json({
      message: "You've been signed out!",
    });
  } catch (err) {
    this.next(err);
  }
};
const createActivationToken = (payload) => {
  return jwt.sign(payload, config.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
const createAccessToken = (payload) => {
  return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
module.exports = {
  signOut,
  signIn,
  signup,
  forgotPassword,
  resetPassword,
  activateEmail,
};
