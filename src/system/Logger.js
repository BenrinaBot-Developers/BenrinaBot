"use strict";

const { Collection } = require("discord.js");
const { inlineCode, codeBlock } = require("@discordjs/builders");

const functions = require("../functions.js");
const { client, systemLogChannels, getTime } = require("../util.js");
const dbutil = require("../dbutil.js");

try {
  require("dotenv").config();
} catch (e) {
  console.error(e);
}
const log = async (
  type,
  { date, command, method, message, error, data, response: { config: apiConfig, data: apiResponse } = {} }
) => {
  if (process.env.EXECUTION_LOCATION !== "replit") return;
  let channelIDs;
  let information = new Collection();
  switch (type) {
    case Type.START_UP:
      channelIDs = systemLogChannels.start_up;
      information.set("StartsAt", getTime(date));
      break;

    case Type.ERROR:
      channelIDs = systemLogChannels.error;

      if ("toCollection" in error) information = information.concat(error.toCollection());
      else information.set(Symbol(codeBlock("js", error?.stack)));

      if (error?.origin) information.set("Exception origin", error.origin);
      break;

    case Type.COMMAND:
      channelIDs = systemLogChannels.command;
      information
        .set("Command", command)
        .set(Symbol("$"))
        .set("Message", inlineCode(message?.content))
        .set("User", `${message?.author} [${message?.author.tag}] (${message?.author.id})`)
        .set(Symbol("$"))
        .set("ID", message?.id)
        .set(Symbol("$"))
        .set("Guild", `${message?.guild} (${message?.guild?.id})`)
        .set("Channel", `${message?.channel} [${message?.channel?.name}] (${message?.channel?.id})`);
      break;

    case Type.API:
      channelIDs = systemLogChannels.api;
      const replacers = {
        response(key, value) {
          if (!key) return value;
          return String(value);
        },
      };
      const config = { url: apiConfig.url, method: apiConfig.method };
      if (apiConfig?.data) config.body = JSON.parse(apiConfig.data);
      if (apiConfig?.params) config.parameters = apiConfig.params;
      if (config?.length > 180) information.set("Request", "_longString_");
      else if (config) information.set("Request", codeBlock("json", JSON.stringify(config, replacers.request, 2)));
      if (apiResponse?.length > 180) information.set("Response", "_longString_");
      else if (apiResponse)
        information.set("Response", codeBlock("json", JSON.stringify(apiResponse, replacers.response, 2)));
      break;

    case Type.DATABASE:
      channelIDs = systemLogChannels.database;
      information.set("Method", `\`${method}\``);
      if (data) information.set("Data/Content", codeBlock("json", JSON.stringify(data, null, 2)));
      break;

    default:
      throw new Error("This is Invalid log type:" + type);
  }
  let informationString = "",
    informationStringForDev = "";
  information.forEach((_content, _tag) => {
    //console.log(typeof _tag)
    if (typeof _tag === "symbol") {
      if (_tag?.description === "$") informationString += "\n";
      else informationString += `${_tag?.description}\n`;
    } else {
      informationString += `${_tag}: ${_content}\n`;
    }
  });
  //console.log(response.data, information, informationString, channelIDs);
  let channelTags = [];
  const sentChannelIDs = [];
  //const title = type === Type.ERROR && error?.type ? error.type : type.description;
  const title = type.description;
  channelIDs.forEach((_chID) => {
    //console.log(_chID)
    channelTags.push(`<#${_chID}>`);
    sentChannelIDs.push(
      functions.send(_chID, { embeds: [functions.getEmbed(0x00ff00, title, informationString)] }).catch(console.log)
    );
  });
  information = information.filter((_, _key) => typeof _key !== "symbol");

  channelTags = channelTags.join(" ");
  //informationString = informationString.replace("\n", " ");
  systemLogChannels.synthesized.forEach((_chID) => {
    sentChannelIDs.push(
      functions
        .send(_chID, `${channelTags}：${title} <${[...information.keys()].join(", ")}>  [${getTime()}]`)
        .catch(console.log)
    );
  });
  return Promise.all(sentChannelIDs);
};
module.exports.log = log;

const Type = {
  START_UP: Symbol("StartUp"),
  ERROR: Symbol("Error"),
  COMMAND: Symbol("Command"),
  API: Symbol("Api"),
  DATABASE: Symbol("Database"),
};
module.exports.Type = Type;
//log({type: Type.COMMAND, message:{content:"test", guild:{name:"a"}, channel:{name:"a"}, id:0}})

var commandlogchannel = "867682846738219037";
var startuplogchannel = "867682923099193354";
var errlogchannel = "868689953264123945";

const customlog = function (command, message, status, warn, title) {
  if (status === undefined) {
    status = "success";
    warn = "正常にコマンドは実行されました。";
  }
  //console.log("loged")
  functions.send(commandlogchannel, {
    embeds: [
      functions.getEmbed(
        0x00f521,
        title,
        `
			実行コマンド:\`${command}\`\n
			メッセージの内容:\`${message.content}\`\n
			実行者:\`${message.author.username}#${message.author.discriminator}\`\n

			実行サーバー:\`${message.channel.guild.name}\`\n
			実行チャンネル:\`${message.channel.name}\`\n
			出力ステータス:\`${status}\`\n
			追加情報:\`${warn}\``,
        true
      ),
    ],
  });
};
exports.customlog = customlog;

const commandlog = function (command, message, log) {
  var status;
  var warn;
  if (log === undefined) {
    status = "success";
    warn = "正常にコマンドは実行されました。";
  }
  if (log === "admin") {
    status = "success.admin";
    warn = "開発者限定コマンドが実行されました。";
  }

  //console.log("loged")
  functions.send(commandlogchannel, {
    embeds: [
      functions.getEmbed(
        0x00f521,
        "コマンドが呼び出されました",
        `実行コマンド:\`${command}\`\n
			メッセージの内容:\`${message.content}\`\n
			実行者:\`${message.author.username}#${message.author.discriminator}\`\n

			実行サーバー:\`${message.guild.name}\`\n
			実行チャンネル:\`${message.channel.name}\`\n
			出力ステータス:\`${status}\`\n
			追加情報:\`${warn}\``,
        true
      ),
    ],
  });
};
exports.commandlog = commandlog;

const errlog = function (command, message, log) {
  var status;
  var warn;
  if (log === undefined) {
    status = "undefinederror";
    warn = "不明なエラーが発生しました。";
  }
  if (log === "noadmin") {
    status = "err.noadmin";
    warn = "開発者限定コマンドの使用権限がありません。";
  }
  if (log === "nopermit") {
    status = "err.nopermission";
    warn = "開発者またはサーバー管理人権限がありません。";
  }
  if (log === "noargs") {
    status = "err.noargs";
    warn = "必要な引数がありません。";
  }
  if (log === "badargs") {
    status = "err.badargs";
    warn = "不正な引数が呼び出されました。";
  }
  if (log === "nocommand") {
    status = "err.nocommand";
    warn = "コマンドが一致しません。";
  }

  //console.log("loged")
  functions.send(commandlogchannel, {
    embeds: [
      functions.getEmbed(
        0xff0000,
        "エラーが発生しました。",
        `
			実行コマンド:\`${command}\`\n
			メッセージの内容:\`${message.content}\`\n
			実行者:\`${message.author.username}#${message.author.discriminator}\`\n

			実行サーバー:\`${message.channel.guild.name}\`\n
			実行チャンネル:\`${message.channel.name}\`\n
			エラータイプ:\`${status}\`\n
			追加情報:\`${warn}\``,
        true
      ),
    ],
  });

  functions.send(errlogchannel, {
    embeds: [
      functions.getEmbed(
        0xff0000,
        "エラーが発生しました。",
        `
			実行コマンド:\`${command}\`\n
			メッセージの内容:\`${message.content}\`\n
			実行者:\`${message.author.username}#${message.author.discriminator}\`\n

			実行サーバー:\`${message.channel.guild.name}\`\n
			実行チャンネル:\`${message.channel.name}\`\n
			エラータイプ:\`${status}\`\n
			追加情報:\`${warn}\``,
        true
      ),
    ],
  });
};
exports.errlog = errlog;
