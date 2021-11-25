'use strict';

const Discord = require("discord.js");
const { client } = require("../util.js");

const support = function () {
	return functions.getEmbed(
      0x00f521,
      "サポートサーバーへ行く",
      `[招待リンクだよ！](https://discord.gg/zmphu5T5Mg)`,
      true);
}
exports.support = support;
