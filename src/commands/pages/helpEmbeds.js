'use strict';

const Discord = require("discord.js");
const util = require("../../util.js");
const client = util.client
const pages = [];
const embedlength = 2; //これ要る？いる

pages[0] = {
    embeds: [
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`べんりなぼっとのヘルプ！`)
        .setDescription(
          "目次だよ！コマンドリストは/cmdだよ！",
        )
        .setThumbnail(util.avatarURL)
        .addFields(
          //5こまで
          { name: ":one:\*\*1ページ目\*\*", value: "このページだよ！" },
		  { name: ":two:\*\*2ページ目\*\*", value: "ヘルプだよ！" },
		  { name: ":three:\*\*3ページ目\*\*", value: "詳細情報だよ！" },
		  { name: ":four:\*\*4ページ目\*\*", value: "注意点と利用規約だよ！" }
        )
        .setTimestamp()
		.setFooter(`(1/${embedlength})`)
    ]
  }

  pages[1] = {
    embeds: [
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`べんりなぼっとのヘルプ！`)
        .setDescription(
          "ヘルプや導入方法だよ！",
        )
        .setThumbnail(util.avatarURL)
        .addFields(
          //5こまで
          { name: ":regional_indicator_c:\*\*コマンドリストを表示する。\*\*", value: "cmdというコマンドを実行してみてね！コマンドリストが表示されるよ！" },
		  { name: ":regional_indicator_i:\*\*導入したい！\*\*", value: `[ここだよ！](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`},
		  { name: ":regional_indicator_s:\*\*サポート鯖はどこ？\*\*", value: `[招待リンクだよ！](https://discord.gg/zmphu5T5Mg)` },
        )
        .setTimestamp()
		.setFooter(`(2/${embedlength})`)
    ]
  }

  pages[2] = {
    embeds: [
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`べんりなぼっとのヘルプ！`)
        .setDescription(
          "詳しい情報だよ！",
        )
        .setThumbnail(util.avatarURL)
        .addFields(
          //5こまで
          { name: ":computer:\*\*開発環境\*\*", value:"Replit\ndiscord.js v13\nnode.js v14" ,inline:true},
		  { name: ":man_technologist:\*\*開発者\*\*", value: "Akane\nUni\nLloyd\nMiyaChan\nFkunn" ,inline:true},
		  { name: ":calendar_spiral:\*\*開発開始日\*\*", value: "2020/07/23?" ,inline:true},
		  { name: ":regional_indicator_g:\*\*世代\*\*", value: "第五世代\nFifth Gen\nNBB", inline:true},
		   { name: ":man_technologist:\*\*開発組織\*\*", value: "BenrinaSoftware", inline:true},
		    { name: ":regional_indicator_p:\*\*プレフィックス\*\*", value: "スラッシュコマンド\n開発版:bt!\n通常版:b!", inline:true},
			 { name: ":green_circle:\*\*ステータス\*\*", value: "開発中", inline:true}
        )
        .setTimestamp()
		.setFooter(`(3/${embedlength})`)
    ]
  }




module.exports = pages;



