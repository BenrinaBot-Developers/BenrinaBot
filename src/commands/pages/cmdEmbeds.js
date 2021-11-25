'use strict';

const Discord = require("discord.js");
const util = require("../../util.js");

const pages = [];

const embedlength = 4; //これ要る？いる
 pages[0] = {
    embeds: [
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`べんりなぼっとのコマンド一覧`)
        .setDescription(
          "コマンドリストの目次だよ！",
        )
        .setThumbnail(util.avatarURL)
        .addFields(
          //5こまで
		  {
            name: "・1ページ目-目次",
            value: "どこに何のコマンドが記載されているか書いてあるよ!",
          },
		  {
            name: "・2ページ目-基本コマンド",
            value: "一番大切でよく使うものをまとめているよ！\`helpなど\`",
          },
		  {
            name: "・3ページ目-便利系コマンド",
            value: "便利系の機能を提供するコマンドだよ！\`wikipediaなど\`",
          },
		  {
            name: "・4ページ目-開発者、サポートコマンド",
            value: "開発向けコマンドやサポート用コマンドなどだよ！\`contactなど\`",
          },
			
        )
        .setTimestamp()
		.setFooter(`(4/${embedlength})`)
    ]
  }

pages[1] = {
    embeds: [
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`べんりなぼっとのコマンド一覧`)
        .setDescription(
          "基本的なコマンドの一覧だよ！",
        )
        .setThumbnail(util.avatarURL)
        .addFields(
          //5こまで
          { name: "・help", value: "ヘルプを表示するよ！" },
		  { name: "・cmd", value: "コマンド一覧を表示するよ。" },
          {
            name: "・cmdinfo <コマンド名>",
            value: "そのコマンドの詳しい情報を表示するよ！",
          },
          { name: "・invite", value: "このbotの招待リンクを送信するよ！" },
		  { name: "・setup", value: "このbotの基本的設定をナビゲートするよ！" },
		   { name: "・support", value: "サポートサーバーの招待を生成するよ！" },
        )
        .setTimestamp()
		.setFooter(`(2/${embedlength})`)
    ]
  }

  pages[2] = {
    embeds: [
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`べんりなぼっとのコマンド一覧`)
        .setDescription(
          "便利系コマンドの一覧だよ！",
        )
        .setThumbnail(util.avatarURL)
        .addFields(
          //5こまで
		  {
            name: "・math <式>",
            value: "式を入力すると計算をするよ！微積分もできるよ！",
          },
			{
            name: "・translate <文> <翻訳元> <翻訳先>",
            value: "google翻訳を利用して翻訳するよ！",
          },
          {
            name: "・wikipedia <検索するワード> <数> <言語>",
            value: "wikipediaで検索するよ！",
          },
		  {
            name: "・setrate <秒数> <理由>",
            value: "そのチャンネルの低速を設定するよ！",
          },
		  {
            name: "・first",
            value: "そのチャンネルの最初のメッセージがわかるよ！",
          },
		  { name: "・memo <行動> <内容(書き込みのみ)>", value: "あなた専用のメモだよ！" },
		  { name: "・emoji", value: "鯖のカスタム絵文字にできそうな絵文字をランダムに生成するよ!" },
		  { name: "・user <指定>", value: "指定されたユーザーの情報を表示するよ！指定されてなければ実行者の情報を表示するよ！" },
		  { name: "・server", value: "コマンドが実行されたサーバーの情報を表示するよ！" },
		  {
            name: "・compose",
            value: "AIが作曲するよ！ちょっと時間かかるよ！",
          },
		  {
            name: "・map <type>",
            value: "鯖のマップを表示するよ！テキストとファイルで選べるよ！",
          },
        )
        .setTimestamp()
		.setFooter(`(3/${embedlength})`)
    ]
  }

  pages[3] = {
    embeds: [
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`べんりなぼっとのコマンド一覧`)
        .setDescription(
          "開発者連絡、テスト関係コマンドの一覧だよ！",
        )
        .setThumbnail(util.avatarURL)
        .addFields(
          //5こまで
		  {
            name: "・contact <type> <内容>",
            value: "運営に直接要望などを伝えるよ！虚偽の報告はbanだよ！",
          },
		  {
            name: "・report <type> <報告対象id> <内容>",
            value: "スクショとかで荒らしを共有できるよ！",
          },
		  {
            name: "・emojiadd <画像URL> <コメント>",
            value: "emojiコマンドの候補を追加する依頼だよ！"
          },
		  {
            name: "・devtest <arg1>",
            value: "ゴミみたいな開発者用コマンドだよ！なにもないね！",
          },
			
        )
        .setTimestamp()
		.setFooter(`(4/${embedlength})`)
    ]
  }



module.exports = pages;
