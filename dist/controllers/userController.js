"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("..models/models");
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const app = (0, _express.default)();
app.use(_express.default.json());
const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    position
  } = req.body;
  try {
    const newUser = await _models.User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      position
    });
    return res.status(201).json({
      message: "User created",
      data: newUser
    });
  } catch (err) {
    console.log("Error: " + err);
    return res.status(500).json(err);
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await _models.User.findAll({
      include: []
    });
    return res.status(200).json({
      message: "Users retrieved",
      data: users
    });
  } catch (err) {
    console.log("Error: " + err);
    return res.status(500).json(err);
  }
};
const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await _models.User.findOne({
      where: {
        id
      }
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    return res.status(200).json({
      message: "User retrieved",
      data: user
    });
  } catch (err) {
    console.log("Error: " + err);
    return res.status(500).json(err);
  }
};
const deleteUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const numRowsDeleted = await _models.User.destroy({
      where: {
        id
      }
    });
    if (numRowsDeleted !== 1) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    return res.status(200).json({
      message: "User deleted"
    });
  } catch (err) {
    console.log("Error: " + err);
    return res.status(500).json(err);
  }
};
var _default = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById
};
exports.default = _default;