"use strict";

const { Collection } = require("discord.js");
const { client } = require("../util.js");

const { isObject } = require("../functions.js");
const Logger = require("../system/Logger.js");
const { DatabaseError } = require("../system/ApplicationError.js");

const fs = require("fs");

class Cache {
  #lastKeyName;
  #initialData;
  #tags;
  constructor(_type, { level: _level = 1, name: _name, lower: _lowerCache } = {}) {
    Object.defineProperties(this, {
      type: { value: _type },
      level: { value: _level },
      lower: { value: _lowerCache },
    });
    this.#initialData = `{"data":{}}`;
    this.#lastKeyName = "lastUpdateAt";
    this.#tags = [];
  }
  async begin() {
    this.fileSelecter = await this.#getNewerFileSelecter();
    return this;
  }

  clear() {
    return Promise.allSettled([
      fs.promises.writeFile(this.#getPath("A"), this.#initialData),
      fs.promises.writeFile(this.#getPath("B"), this.#initialData),
    ]);
  }

  async get(_keys) {
    const cache = await this.#read();
    const response = new Collection();
    _keys.forEach((_key) => response.set(_key, cache.data[_key]));
    return response;
  }
  async set(_object = {}, _options) {
    const cache = await this.#read();
    Object.assign(cache.data, _object);
    return this.$write(cache, _options);
  }
  async delete(_keys, _options) {
    const cache = await this.#read();
    //console.log(cache, _keys);
    _keys.forEach((_key) => {
      delete cache.data[_key];
    });
    //console.log(cache);
    return this.$write(cache, _options);
  }

  #read() {
    return this.#readFile(this.#currentPath);
  }
  async $write(_data, { writeback = true } = {}) {
    if (writeback) this.#updateLower(_data);
    /*if(waitWriteback) await this.#updateLower(_data, {waitWriteback:true});
    else */
    this.#tags = Object.keys(_data.data);
    _data = Object.assign({}, _data, {
      [this.#lastKeyName]: Date.now(),
    });
    this.fileSelecter = !this.fileSelecter;
    return this.#writeFile(this.#currentPath, _data);
  }
  #updateLower(_cache, _options) {
    return this?.lower?.set(_cache.data, _options);
  }

  async #readFile(_path) {
    const jsonStr = (await fs.promises.readFile(_path, "utf8")) || this.#initialData;
    return JSON.parse(jsonStr);
  }
  async #writeFile(_path, _data = this.initialData) {
    _data = JSON.stringify(_data);
    return fs.promises.writeFile(_path, _data);
  }

  async #getNewerFileSelecter() {
    const Cache_A = this.#readFile(this.#getPath("A"));
    const Cache_B = this.#readFile(this.#getPath("B"));
    return ((await Cache_A)[this.#lastKeyName] ?? 0) >= ((await Cache_B)[this.#lastKeyName] ?? 0);
  }
  get #currentPath() {
    return this.#getPath(this.fileSelecter ? "A" : "B");
  }
  #getPath(_selecter) {
    return `${__dirname}/cache/L${this.level}/${_selecter}/${this.type}.json`;
  }

  get size() {
    return this.#tags.length;
  }
}

class CacheManager {
  #begun;
  constructor(_type, _options) {
    this.#begun = false;
    Object.defineProperties(this, {
      L2: { value: new Cache(_type, { level: 2, ..._options }) },
    });
    Object.defineProperties(this, {
      L1: { value: new Cache(_type, { level: 1, lower: this.L2, ..._options }) },
    });
  }

  async begin() {
    await Promise.all([this.L1.begin(), this.L2.begin()]);
    await this.L1.clear();
    this.#begun = true;
    return this;
  }
  async clear() {
    this.checkBegun();
    await Promise.all([this.L1.clear(), this.L2.clear()]);
    return this;
  }

  async get(..._keys) {
    this.checkBegun();
    let keys = _keys.flat(Infinity);
    let response = await this.L1.get(keys);
    keys = getRestKeys(response);
    //console.log(response, keys)
    response = response.concat(await this.L2.get(keys));
    keys = getRestKeys(response);
    //console.log(response, keys)
    response.sweep((_, _key) => keys.includes(_key));
    Logger.log(Logger.Type.DATABASE, { method: "get", data: { data: Object.fromEntries(response), rest: keys } });
    return { data: response, rest: keys };
    function getRestKeys(_collection) {
      return [..._collection.filter((_value, _key) => _value === void 0).keys()];
    }
  }

  async set(_key, _value) {
    this.checkBegun();
    if (typeof _key !== "string") throw new DatabaseError("Invalid Key Type: " + _key);
    const data = { [_key]: _value };
    await this.L1.set(data);
    Logger.log(Logger.Type.DATABASE, { method: "set", data: data });
    return this;
  }
  async put(_object = {}) {
    this.checkBegun();
    if (!isObject(_object)) throw new DatabaseError("Invalid Type: " + _object);
    await this.L1.set(_object);
    Logger.log(Logger.Type.DATABASE, { method: "put", data: _object });
    return this;
  }

  async delete(..._keys) {
    this.checkBegun();
    _keys = _keys.flat(Infinity);
    await Promise.allSettled([
      this.L1.delete(_keys, { writeback: false }),
      this.L2.delete(_keys, { writeback: false }),
    ]);
    Logger.log(Logger.Type.DATABASE, { method: "delete", data: _keys });
    return this;
  }

  checkBegun() {
    if (this.#begun) return;
    throw new DatabaseError("The .begin() method must be called first.");
  }
}

module.exports = { CacheManager };

return;

client.on("ready", async () => {
  const cacheManager_test1 = new CacheManager("normal");
  await cacheManager_test1.begin();
  //await cacheManager_test1.clear()
  await cacheManager_test1.set("aaa", 12345);
  cacheManager_test1.get("aaa").then(console.log);
  cacheManager_test1.get("aaa", "test").then(console.log);
  await cacheManager_test1.put({ aaa: 54321, bbb: "abc", ccc: "xyz1234" });
  cacheManager_test1.get("test", "aaa", "test2", "test", "bbb", "ccc").then(console.log);
  await cacheManager_test1.delete("aaa", "ccc", "test", "vvv");
  cacheManager_test1.get("test", "aaa", "test2", "test", "bbb", "ccc").then(console.log);
  /*for(let i = 0; i < 128; i++) {
    console.log(new Date())
    await cacheManager_test1.put({[`test${i}`]:i})
  }*/
  /*for(let i = 0; i < 128; i++) {
    //console.log(new Date())
    cacheManager_test1.get(`test${i}`).then(console.log)
  }*/
});
/*
class BaseDatabaseManager {
  #intervals
  #lastKeyName
  #initialData
  constructor(_type, {name:_name, intervals:_intervals} = {}) {
    Object.defineProperties(this, {
      type: {value: _type},
      accessor: {value: new BaseDatabaseAccessor(_type, {name: _name})}
    });
    this.#initialData = `{"data":{}}`
    this.#lastKeyName = "lastUpdateAt";
    this.intervals = {
      json: _intervals?.json ?? 5000, //60 * 1000,
      web: _intervals?.web ?? 10000 //5 * 60 * 1000
    };
    this.#resetQuere(true);
    console.log(this.intervals)
    this.writeCounter = 0;
    this.currentTimerID;
  }
  async begin() {
    await this.clearCache()
    this.fileSelecter = { //true:A, false:B
      l1: await this.#getNewerFileSelecter(1),
      l2: await this.#getNewerFileSelecter(2)
    };
    console.log(this.fileSelecter)
    return this.#save()
  }
}

class NormalDatabaseManager extends BaseDatabaseManager {
  constructor() {
    super("normal")
  }
}

class ObjectDatabaseManager extends BaseDatabaseManager {
  constructor() {
    super("object")
  }
}

const normal_test = new NormalDatabaseManager();
normal_test.begin()
//normal_test.accessor.set({"aaa": "iii"}).then(console.log);
client.on("messageCreate", message => {
  if (message.channel.id != "879671366444515340") return;
  if(message.author.bot) return;
  if(message.content.startsWith("/bt!db_test2 ")) {
    const objStr = message.content.replace("/bt!db_test2 ","")
    normal_test.set(JSON.parse(objStr))
  } else if(message.content.startsWith("/bt!db_test3 ")) {
    const arrStr = message.content.replace("/bt!db_test3 ","")
    //console.log(arrStr.split(","))
    normal_test.delete(arrStr.split(","));
  } else if(message.content.startsWith("/bt!db_test4")) {
    //console.log((normal_test.#getNewerFileSelecter().then(console.log)), normal_test.fileSelecter);
  } else if(message.content.startsWith("/bt!db_test.end")) {
    console.log(normal_test.end());
  }
});*/
