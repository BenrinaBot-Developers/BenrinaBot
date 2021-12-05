'use strict';

const Moment = require("moment-timezone");
const Discord = require("discord.js");

const checkundefined = function (n) {
  if (n === undefined) {
    return true;
  } else {
    return false;
  }
};
exports.checkundefined = checkundefined;

const startsAt = new Date();
module.exports.startsAt = startsAt;

const getTime = function (_date = new Date()) {
  return Moment(_date).tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss");
};
exports.getTime = getTime;

const slashguild = ["878512058088423454"]//rokkyo and dev
exports.slashguild = slashguild;

const { Intents, Client } = Discord;
const options = {
   intents: Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES,
 };
const client = new Client(options);
exports.clientOpitions = options;
exports.client = client;

const avatarURL = "https://cdn.discordapp.com/app-icons/860122667709497354/05b9167077333a8df02e4544c64dea42.png?size=1024";
exports.avatarURL = avatarURL;

const isAdmin = function (testid) {
  var adminids = [
    "709391738728349768",
    "804688154845904907",
    "597398016944635954",
    "687599949093011495",
  ];
  let passIndex = adminids.indexOf(testid);
  if (passIndex === -1) {
    return false;
  } else {
    return true;
  }
};
exports.isAdmin = isAdmin;

/*
const systemLogChannels = {
  synthesized:["886067642811699200"],
  start_up:["885405909642281010"],
  command:["885406484761022465"],
  error:["885406501219471361"],
  api:["885406513739468851"],
  database:["893102894818131988"]
};
*/
const systemLogChannels = {
  synthesized:["899175058075942932"],
  start_up:["899175440999120916"],
  command:["899175560159305769"],
  error:["899175629482762250"],
  database:["899175857191546922"],
  api:["899176298184859709"]
};
exports.systemLogChannels = systemLogChannels;