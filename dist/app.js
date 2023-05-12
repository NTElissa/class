"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Imports

// Sequelize configuration
// dotenv.config();
// App setup
_dotenv.default.config();
const app = (0, _express.default)();

// Routes

// Export the app
var _default = app;
exports.default = _default;