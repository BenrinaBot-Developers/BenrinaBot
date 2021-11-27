'use strict';

const CommandController = require("./CommandController.js");
const PageController = require("./PageController.js");

const Database = require("./DatabaseManager.js");
const API = require("./API.js");
const Logger = require("./Logger.js");
const ApplicationError = require("./ApplicationError.js");

const warn = require("./warn.js");
const errors = require("./errors.js");

module.exports = {
  API, Logger,
  warn, errors,
  Database,
  ...CommandController, ...PageController,
  ...ApplicationError,
};