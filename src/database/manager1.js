'use strict';

//実行されない
return;


const {workerData} = require('worker_threads')

const { Collection } = require("discord.js");
const {client } = require("../util.js")

const functions = require("../functions.js");

const fs = require("fs");

const { BaseDatabaseAccessor } = require("./accessor.js");

class BaseDatabaseManager {
  #intervals
  #lastKeyName
  #initialBuffer
  constructor(_type, {name:_name, intervals:_intervals} = {}) {
    Object.defineProperties(this, {
      type: {value: _type},
      accessor: {value: new BaseDatabaseAccessor(_type, {name: _name})}
    });
    this.#initialBuffer = `{"data":{}}`
    this.#lastKeyName = "lastUpdateAt";
    this.intervals = {
      json: _intervals?.json ?? 5000, //60 * 1000,
      web: _intervals?.web ?? 10000 //5 * 60 * 1000
    };
    this.#resetQuere(true);
    /*this.intervals.unit = functions.gcd(this.intervals.json, this.intervals.web);
    this.intervals.resetCount = functions.lcm(this.intervals.json, this.intervals.web);*/
    console.log(this.intervals)
    this.writeCounter = 0;
    this.currentTimerID;
  }

  set intervals(_obj) {
    this.#intervals = _obj
    Object.assign(this.#intervals, {
      unit: functions.gcd(this.intervals.json, this.intervals.web),
      resetCount: functions.lcm(this.intervals.json, this.intervals.web)
    })
  } 
  get intervals() {
    return this.#intervals
  }

  async begin() {
    await this.clearBuffer()
    this.fileSelectFlags = { //true:A, false:B
      l1: await this.#getNewerFileSelectFlag(1),
      l2: await this.#getNewerFileSelectFlag(2)
    };
    console.log(this.fileSelectFlags)
    return this.#save()
  }
  end() {
    clearTimeout(this.currentTimerID);
    return this.#write({
      set: Object.fromEntries(Array.from(this.queue.set.entries())),
      delete: Array.from(this.queue.delete)
    });
    this.#resetQuere();
  }

  set(_object) {
    Object.keys(_object).forEach(_key => this.queue.delete.delete(_key));
    this.queue.set = this.queue.set.concat(new Collection(Object.entries(_object)))
    //Object.assign(this.queue.set, _object);
  }
  delete(_keys) {
    _keys.forEach(_key => {
      this.queue.set.delete(_key);
      this.queue.delete.add(_key);
    });
    //Object.assign(this.queue.set, _object);
  }

  clearBuffer() {
    return Promise.allSettled([
      fs.promises.writeFile(this.#getBufferPath(1, "A"), this.#initialBuffer),
      fs.promises.writeFile(this.#getBufferPath(1, "B"), this.#initialBuffer),
      fs.promises.writeFile(this.#getBufferPath(2, "A"), this.#initialBuffer),
      fs.promises.writeFile(this.#getBufferPath(2, "B"), this.#initialBuffer)
    ]);
  }

  #resetQuere(_first = false) {
    const temp = this.queue?.databaseDeltete;
    this.queue = {
      set: new Collection(),
      delete: new Set()
    }
    if(_first) this.queue.databaseDeltete = new Set();
    else this.queue.databaseDeltete = temp;
  }

  async #save() {
    if(this.writeCounter % this.intervals.json === 0) {
      //console.log(Array.from(this.queue.delete).toString())
      console.log("queues:" ,this.queue.set.size, this.queue.delete.size)
      if(this.queue.set.size || this.queue.delete.size) {
        await this.#write({
          set: Object.fromEntries(Array.from(this.queue.set.entries())),
          delete: Array.from(this.queue.delete)
        });
        this.#resetQuere()
      }
    }
    if(this.writeCounter % this.intervals.web === 0) {
      const checkUpdate = this.#isUpdateFound();
      if((await checkUpdate.next()).value) {
        console.log("api!!!!!!!!!!!")
        await this.#post((await checkUpdate.next()).value);
        this.#resetQuere()
      }
    }
    console.log(this.writeCounter)
    this.writeCounter += this.intervals.unit;
    if(this.writeCounter >= this.intervals.resetCount) {
      this.writeCounter = 0;
    }

    return this.currentTimerID = setTimeout(this.#save.bind(this), this.intervals.unit);
  }

  async #getNewerFileSelectFlag(_level) {
    const buffer_A = this.#getBuffer(this.#getBufferPath(_level, "A"));
    const buffer_B = this.#getBuffer(this.#getBufferPath(_level, "B"));
    return ((await buffer_A)[this.#lastKeyName] ?? 0) >= ((await buffer_B)[this.#lastKeyName] ?? 0);
  }
  #getCurrentBufferPath(_level) {
    return this.#getBufferPath(_level, this.fileSelectFlags[`l${_level}`] ? "A" : "B");
  } 
  #getBufferPath(_level ,_selecter) {
    return `${__dirname}/buffers/L${_level}/${_selecter}/${this.type}.json`;
  }
  #getCachePath(_selecter) {
    return `${__dirname}/cache/${_selecter}/${this.type}.json`;
  }

  async #write({set: _object = {}, delete: _keys = []} = {}) {
    const buffer = await this.#getBuffer(this.#getCurrentBufferPath(1));
    console.log(buffer);
    Object.assign(buffer.data, _object);
    Object.assign(buffer, {[this.#lastKeyName]: Date.now()});
    _keys.forEach(_key => {
      const has = _key in buffer.data;
      delete buffer.data[_key];
      /*if(!has)*/ this.queue.databaseDeltete.add(_key);
    });
    console.log(_object, _keys)
    console.log("The rest:", this.queue.databaseDeltete)
    //console.log(buffer);
    console.log(this.fileSelectFlags.l1)
    this.fileSelectFlags.l1 = !this.fileSelectFlags.l1;
    return await fs.promises.writeFile(this.#getCurrentBufferPath(1), JSON.stringify(buffer));
  }

  async #post(_buffer){
    Object.assign(_buffer, {[this.#lastKeyName]: Date.now()});
    this.fileSelectFlags.l2 = !this.fileSelectFlags.l2;
    fs.promises.writeFile(this.#getCurrentBufferPath(2), JSON.stringify(_buffer));
    //databaseDelteteQueue
    console.log(this.queue)
    let deleteQueue = Array.from(this.queue.databaseDeltete);
    deleteQueue = deleteQueue.filter(_key => {
      const has = _key in _buffer.data;
      delete _buffer.data[_key];
      return !has
    });
    const accessQueues = [];
    if(_buffer?.data) accessQueues.push(this.accessor.set(_buffer?.data));
    if(this.queue.databaseDeltete.size) {
      accessQueues.push(this.accessor.delete(deleteQueue));
    }
    this.queue.databaseDeltete = new Set();
    return Promise.allSettled(accessQueues);
  }
  async *#isUpdateFound() {
    const l1 = await this.#getBuffer(this.#getCurrentBufferPath(1));
    const l2 = await this.#getBuffer(this.#getCurrentBufferPath(2));
    const l1_coll = new Collection(Object.entries(l1.data));
    const l2_coll = new Collection(Object.entries(l2.data));
    const boolean = !l1_coll.equals(l2_coll);
    //console.log(l1_coll); console.log(l2_coll)
    console.log("update:", boolean)
    yield boolean;
    yield boolean ? l1 : l2;
  }

  async #getBuffer(_path) {
    const jsonStr = await fs.promises.readFile(_path, 'utf8') || this.#initialBuffer;
    //console.log(jsonStr);
    return JSON.parse(jsonStr);
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
    //console.log((normal_test.#getNewerFileSelectFlag().then(console.log)), normal_test.fileSelectFlags);
  } else if(message.content.startsWith("/bt!db_test.end")) {
    console.log(normal_test.end());
  }
});