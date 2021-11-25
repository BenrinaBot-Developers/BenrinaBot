'use strict';

const Enmap = require("enmap");

const db = new Enmap({ name: "benrinabot" });
const otherEnmap = new Enmap({
  name: "settings",
  autoFetch: true,
  fetchAll: false,
});

var dbName = "NewBenrinaBot/"; //普通の名前
var dbSrv = `${dbName}token=0001/srv/`; //鯖データ
var dbuserdic = `${dbName}rankdic`;
var needexppath = `${dbName}rankneedexp`;

exports.db = db;
exports.dbName = dbName;
exports.dbSrv = dbSrv;
exports.dbuserdic = dbuserdic;
exports.needexppath = needexppath;