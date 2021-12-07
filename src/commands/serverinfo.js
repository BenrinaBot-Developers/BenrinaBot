'use strict';

const Discord = require("discord.js");
const { client, guildRank } = require("../util.js");
const functions = require("../functions.js");
const { PageController } = require("../system")

const serverInfo = function(_from) {
  const pages = [];
  const guild = _from.guild
  const guildDescription = guild.description ? guild.description : " "
  const guildStatus = guild.available ? "🟢有効" : "🔴無効"
 // console.log(_from);
  pages[0] = {
    embeds: [
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(guild.name)
        .setDescription(
          "このサーバーの概要だよ！",
        )
        .addFields(
          //5こまで
          { name: "サーバー名", value: `\`${guild.name}\`` },
          { name: "サーバーID", value: `\`${guild.id}\`` },
          { name: "サーバー概要", value: `\`${guildDescription}\`` },
          { name: "サーバー作成日時", value: `\`${functions.dateToString(guild.createdAt)}\`` },
          { name: "サーバー人数", value: `\`${guild.memberCount}\`` },
          { name: "サーバーオーナー", value: `<@${guild.ownerId}>` },
          { name: "サーバーステータス", value: `\`${guildStatus}\`` },
          { name: "サーバーランク", value: `\`${guildrank}\`` },
          )
        .setTimestamp()
		    .setFooter(``)
    ]
  }
  



  //console.log(pages)
	const pageController = new PageController({title:"", pageLoop:true, pageNumber: true, endMessage:{content: ""},
    authors:[_from?.user.id]})
  pageController.addPages(...pages);
  //console.log(_from)
  return pageController.begin(_from)
}
exports.serverInfo = serverInfo;
