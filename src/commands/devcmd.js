"use strict";

const Discord = require("discord.js");
const { client, slashguild } = require("../util.js");

const { Database } = require("../system");
const functions = require("../functions.js");

module.exports = async function* (arg1) {
  const db = new Database.CacheManager("normal");
  await db.begin();
  const result = await db.get("devComd_test");
  console.log(result);
  yield { embeds: [functions.getEmbed(0x00f521, `Read`, `Result: ${result.data.first()}`, true)] };
  await db.set("devComd_test", arg1);
  return { embeds: [functions.getEmbed(0x00f521, `Write`, `Value: ${arg1}`, true)] };
};
