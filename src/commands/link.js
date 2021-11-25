'use strict';

const Discord = require("discord.js");
const functions = require("../functions.js");
const util = require("../util.js");
const client = util.client;
const dbutil = require("../dbutil.js");
const { Logger } = require("../system")
db = dbutil.db;

const msglink = function (message, index) {
  //文字列分割

  var split = message.content.split("");
  this.split = split;

  var length = this.split.length;
  var split1 = this.split.splice(index, index + 85);

  var split2 = split1.splice(0, 85);

  var sourceStr = split2.join();
  var targetStr = ",";

  var regExp = new RegExp(targetStr, "g");

  var lasturl = sourceStr.replace(regExp, "");

  const regex =
    /https?:\/\/([a-z]+\.)?discord(app)?\.com\/channels\/(?<guildid>\d{16,18})\/(?<channelid>\d{16,18})\/(?<messageid>\d{16,18})/;
  const url = lasturl;
  const match = url.match(regex);

  const guild = client.guilds.cache.get(match.groups.guildid);

  if (!guild) return;

  const channel = guild.channels.cache.get(match.groups.channelid);
  if (!channel) return;

  channel.messages.fetch(match.groups.messageid).then(msg => {
    message.channel.send({embeds:[
      functions.getEmbed(
        0x00f521,
        "引用",
        `${msg.content}\n
			\`発言サーバー:${msg.channel.guild.name}/${msg.channel.name}\`\n
			\`発言者:${msg.author.username}#${msg.author.discriminator}\`\n`,
        true,
      ),]}
    );

    Logger.commandlog("link", message);
  });
};
exports.msglink = msglink;
