"use strict";

const { Collection, Util } = require("discord.js");
const { inlineCode, codeBlock } = require("@discordjs/builders");

const Logger = require("./Logger.js");

class ApplicationError extends Error {
  constructor(..._error) {
    super(..._error);
    this.type = "Runtime Error";
    Object.defineProperty(this, "name", { value: this.constructor.name });
  }
  async log() {
    return Logger.log(Logger.Type.ERROR, { error: this });
  }
  toCollection() {
    return new Collection([Symbol(this.stack)]);
  }
}

class ProcessError extends ApplicationError {
  constructor(_message, _origin) {
    super(_message);
    Object.defineProperty(this, "name", { value: this.constructor.name });
    this.origin = _origin;
  }
}

class DatabaseError extends ApplicationError {}

class BaseSecondaryError extends ApplicationError {
  toCollection() {
    const collection = new Collection();
    collection.set(this.name, this.message);
    if (this?.content?.stack) collection.set("Content", codeBlock("js", this.content.stack));
    return collection;
  }
}

class SystemError extends BaseSecondaryError {
  constructor(_message, _error) {
    super(_message);
    Object.defineProperty(this, "name", { value: this.constructor.name });
    this.content = _error;
  }
}

class CommandError extends BaseSecondaryError {
  constructor(_message, _error, _command) {
    super(_message ?? _error.message);
    Object.defineProperty(this, "name", { value: this.constructor.name });
    this.content = _error;
  }
}

module.exports = { ApplicationError, ProcessError, SystemError, CommandError, DatabaseError };
