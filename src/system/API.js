"use strict";

const Discord = require("discord.js");
const client = require("../util.js").client;

const axiosBase = require("axios");

const Logger = require("./Logger.js");

const axios = axiosBase.create({
  headers: { "Content-Type": "application/json" },
  timeout: 15 * 1000,
  responseType: "json",
});

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error(error.body);
  }
);
axios.interceptors.response.use(
  (response) => {
    //console.log(response);
    Logger.log(Logger.Type.API, { response: response });
    return response;
  },
  (error) => {
    console.error(error.body);
  }
);

const fetch = async (method, url, options = {}) => {
  const config = {
    method,
    url,
    ...options,
  };
  //console.log(args)
  const response = await axios.request(config);
  //console.log(response)
  return response?.data;
};
exports.fetch = fetch;

client.on("ready", () => {
  const appID = "8070c32a-92b3-4cc7-8da0-0fa0807db1e3";
  const botID = "2389_BebrinaBot1123";

  /*fetch("post", "https://api-sunaba.xaiml.docomo-dialog.com/dialogue", {
    appId: appID,
    botId: botID,
    voiceText: "init",
    initTalkingFlag: false,
    language: "ja-JP",
    initTopicId: "kataraiTrial"
  }).then(console.log)*/

  const connectSunaba = async (message) => {
    const body = await fetch("post", "https://api-sunaba.xaiml.docomo-dialog.com/dialogue", {
      data: {
        appId: appID,
        botId: botID,
        clientData: {
          personal: {
            name: message?.author?.toString(),
          },
        },
        voiceText: message.content,
        initTalkingFlag: false,
        language: "ja-JP",
      },
    });
    if (body?.systemText?.expression == "NOMATCH") throw body;
    else return body;
  };
  exports.connectSunaba = connectSunaba;
});

const connectWolframAlpha = async (_input, options = {}) => {
  const url = "http://api.wolframalpha.com/v2/query";
  const body = await fetch("get", url, {
    params: {
      input: _input,
      output: "json",
      appid: "6JRE4A-RP72X57G2L",
      ...options,
    },
    timeout: 30 * 1000,
  });
  if (body) return body;
};
exports.connectWolframAlpha = connectWolframAlpha;

const googleTranslate = async (_input, _to, _from) => {
  const apiID = "AKfycbw4BF_Fi9VLosgoYzriMXJHGen-2Bl0Zm9uWqze3XwoClc315kL56Ej3igjEdPJD_OSIA";
  let url = `https://script.google.com/macros/s/${apiID}/exec`;
  const parameters = { text: _input, target: _to };
  if (_from) parms.source = _from;
  const body = await fetch("get", url, { params: parameters });
  if (body) return body;
};
exports.googleTranslate = googleTranslate;
//googleTranslate("I'm a cat","en").then(_res => {console.log(_res.text)}).catch(console.log)

const searchWikipedia = async (_params, _language = "ja") => {
  let url = `https://${_language}.wikipedia.org/w/api.php`;
  const body = await fetch("get", url, {
    params: { format: "json", ..._params },
  });
  if (body) return body;
};
exports.searchWikipedia = searchWikipedia;
