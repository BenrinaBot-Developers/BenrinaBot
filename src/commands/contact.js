'use strict';

const Discord = require("discord.js");
const util = require("../util.js");
const functions = require("../functions.js");
const client = util.client
const { PageController } = require("../system");
const contactChannel = "892371358116380733"

module.exports = async function (_choices,_content){

  let nform
	if(this.from.channel.isThread() === true){
		nfrom = `${this.from.guild.name}/${this.from.channel.parent.name}/${this.from.channel.name}`
	}else{
	  nfrom = `${this.from.guild.name}/${this.from.channel.name}`
	}


	const pages = [];
	pages[0] = {
    embeds: [
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`ご連絡ありがとうございます。`)
        .setDescription(
          "開発サーバーへ連絡しました。必要であれば後日開発者から返信が来ます。",
        )
        .setThumbnail(util.avatarURL)
        .addFields(
          //5こまで
          { name: "報告タイプ", value: _choices },
		  { name: "報告内容", value: _content },
        )
        .setTimestamp()
    ]
  }
	pages[1] = {
    embeds: [
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`報告内容`)
        .setDescription(
          "詳細情報",
        )
        .setThumbnail(util.avatarURL)
        .addFields(
          //5こまで
		  { name: "報告タイプ", value: _choices },
		  { name: "報告内容", value: _content },
          { name: "報告者id", value: this.from.user.id },
		  { name: "報告者名", value: `${this.from.user.username}#${this.from.user.discriminator}` },
		  { name: "報告があったチャンネル", value: nfrom},
        )
        .setTimestamp()
    ]
  }

	functions.send(contactChannel,pages[1])

	const pageController = new PageController({
		title:"(^^)", 
		pageLoop:true, 
		pageNumber: true, 
		endMessage:{content: "Thank you for your reading!"},
    	authors:[this.from?.user.id]})

  		pageController.addPages(...pages);
  		return pageController.begin(this.from)

		

}