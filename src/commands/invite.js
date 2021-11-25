'use strict';

const Discord = require("discord.js");
const functions = require("../functions.js");
const { client } = require("../util.js");
/*
const invite = function (message) {
  message.channel.send
	  {embeds:[
    functions.getEmbed(
      0x00f521,
      "招待を生成しました。",
      `[こちらをクリック](https://discord.com/oauth2/authorize?client_id=860122667709497354&permissions=8&scope=bot%20applications.commands)\n
	  お知らせ:1.0.0-dev版よりリンクが更新されました。すでに導入していても、権限再設定のためもう一度認証をお願いします`,
      true,
    )]}
  
 log.commandlog("invite", message);
  return;
};
exports.invite = invite;
*/
const slashinvite = function () {
	return functions.getEmbed(
      0x00f521,
      "招待を生成しました。",
      `[こちらをクリック](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)\n
	  お知らせ:1.0.0-dev版よりリンクが更新されました。すでに導入していても、権限再設定のためもう一度認証をお願いします`,
      true);
}
exports.slashinvite = slashinvite;
