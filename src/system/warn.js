"use strict";

const Discord = require("discord.js");
const functions = require("../functions.js");
const util = require("../util.js");
const dbutil = require("../dbutil.js");

const errwarn = function (message, log) {
  var status;
  var warn;
  if (log === undefined) {
    status = "undefinederror";
    warn = "不明なエラーが発生しました。";
    msg = "開発者へご連絡をお願いいたします。";
  }
  if (log === "noadmin") {
    status = "err.noadmin";
    warn = "開発者限定コマンドの使用権限がありません。";
    msg = "権限がありません。開発者以外は利用できないコマンドです。";
  }
  if (log === "nopermit") {
    status = "err.nopermission";
    warn = "開発者またはサーバー管理人権限がありません。";
    msg = "権限がありません。開発者または鯖缶以外は利用できないコマンドです。";
  }
  if (log === "noargs") {
    status = "err.noargs";
    warn = "必要な引数がありません。";
    msg = "引数が不足しています。コマンドを確認してください。";
  }
  if (log === "badargs") {
    status = "err.badargs";
    warn = "不正な引数が呼び出されました。";
    msg = "不正な引数があります。コマンドを確認してください。";
  }
  if (log === "nocommand") {
    status = "err.nocommand";
    warn = "そんなコマンドないで";
    msg = "コマンドが存在するか確認してください。";
  }

  //console.log("loged")
  message.channel.send({
    embeds: [
      functions.getEmbed(
        0xff0000,
        warn,
        `
			メッセージの内容:\`${message.content}\`\n
			実行者:\`${message.author.username}#${message.author.discriminator}\`\n
			エラータイプ:\`${status}\`\n
			メッセージ:\`${msg}\`\n
			コマンドが合っているにもかかわらずエラーが出た場合は開発者へご連絡ください。`,
        true
      ),
    ],
  });
};
exports.errwarn = errwarn;
