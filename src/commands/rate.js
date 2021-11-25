'use strict';

const Discord = require("discord.js");
const { client, slashguild } = require("../util.js")
const { warn } = require("../system")

const functions = require("../functions.js");

module.exports = async function(seconds = 0, reason) {
  let beforrate = this.from.channel.rateLimitPerUser
  let _reason = reason ?? "理由を書く気がなかったようです。"
	if (seconds > 21600) return "数値が大きすぎます！"
  this.from.channel.setRateLimitPerUser(seconds, reason)
  return {
    embeds: [functions.getEmbed(
      0x00f521,
      `${functions.chmention(this.from.channel.id, 1)}での低速を変更しました！`,
      `秒数:\`${beforrate}\`=>\`${seconds}\`\n
	  理由:\`${_reason}\``,
      true)]
  }
}