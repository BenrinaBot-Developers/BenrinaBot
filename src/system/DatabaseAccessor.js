"use strict";

const { fetch } = require("./API.js");

class BaseDatabaseAccessor {
  constructor(type, { name = "" } = {}) {
    Object.defineProperties(this, {
      type: { value: type },
      name: { value: name },
    });
  }
  static apiEndpoint =
    "https://script.google.com/macros/s/AKfycbzqU2cXUrPsgFhD4JBxj92Nj5af8i8xO72AzJ33FcOaEBPyA8I1j91LgUznmQt6zhmd/exec";

  #getBaseBody(_action = "ping") {
    return {
      action: _action,
      type: this.type,
      key: "test",
    };
  }

  static ping() {
    return fetch("post", this.apiEndpoint, { data: { action: "ping" } });
  }

  put(_object) {
    return fetch("post", BaseDatabaseAccessor.apiEndpoint, {
      data: {
        ...this.#getBaseBody("set"),
        data: _object,
      },
    });
  }
  get(..._keys) {
    _keys.flat();
    return fetch("post", BaseDatabaseAccessor.apiEndpoint, {
      data: {
        ...this.#getBaseBody("get"),
        data: _keys.flat(Infinity),
      },
    });
  }
  delete(_keys, { _getting = false } = {}) {
    return fetch("post", BaseDatabaseAccessor.apiEndpoint, {
      data: {
        ...this.#getBaseBody("delete"),
        data: _keys.flat(Infinity),
        getting: _getting,
      },
    });
  }
}
module.exports = { BaseDatabaseAccessor };
