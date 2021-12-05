'use strict';

const Discord = require("discord.js");
const { client } = require("../util.js");
const functions = require("../functions.js");
const { PageController } = require("../system")

exports = async function() {
	//console.log(this.from)
	const channel = client.channels.cache.get(this.from.channelId);
  const firstMessage = await channel.messages.fetch({ after: "0", limit: 1 })
	const messageId = firstMessage.first().id
	const url = `https://discord.com/channels/${channel.guild.id}/${channel.id}/${messageId}`;
  //console.log(url)
	return {embeds:[functions.getEmbed(0x00f521,"最初のメッセージ",
    `[このチャンネルのトップへ](${url})`, true)
  ]};
}
