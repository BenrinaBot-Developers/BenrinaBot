'use strict';

const { MessageAttachment } = require("discord.js");

const fs = require("fs");
const https = require("https");

const util = require("../util.js");
const { API: { fetch } } = require("../system");

const parameter = {
  saveFileCount: 5,
  folder: "./data/musicFiles",
  musicFile(number) {
    return `${this.folder}/file_${number}.mp3`;
  },
  historyFile: "./data/musicFiles/history.json",
  tool: "https://chatter-deeply-shaker.glitch.me/",
};

module.exports = async () => {
  const filename = await composition();
  return {
    files: [
      new MessageAttachment(`./${filename}`, "MyMusic.mp3")
    ]
  };
}

async function composition() {
  //console.log("compose")
  const url = await fetch("get", parameter.tool, {
    timeout: 60 * 1000
  });
  if(!url) return;
  //console.log(url)
  //console.log(url);
  // 出力ファイル名を指定
  const fileNames = fs.readdirSync(parameter.folder);
  const fileNumbers = fileNames.map((name) => {
    if (!name.match(/file_|.mp3/gi)) return -1;
    return Number(name.replace(/file_|.mp3/gi, ""));
  });
  //console.log(fileNumbers);
  let lastFileNumber = fileNumbers
    .sort(function(a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    })
    .slice(-1)[0];
  //console.log(lastFileNumber);
  if (Number.isNaN(lastFileNumber)) {
    lastFileNumber = -1;
  }

  {
    let deletionFileNumbers = fileNumbers.filter((number) => {
      if (number == -1) {
        return false;
      }
      return number <= lastFileNumber - (parameter.saveFileCount - 1);
    });
    let deletionFileNames = deletionFileNumbers.map((number) => {
      return parameter.musicFile(number);
    });
    //console.log(deletionFileNumbers);
    deletionFileNames.forEach(function(file) {
      fs.unlink(file, function(err) {
        if (err) {
          throw err;
        }
        //console.log(`deleted ${file}`);
      });
    });
  }
  const history = JSON.parse(await fs.promises.readFile(parameter.historyFile, 'utf8') || "{}");
  history[String(lastFileNumber + 1)] = {
    url: { alternate: url.replace(/Download|\&form=.*/gi, ""), self: url },
    date: util.getTime(),
  };
  fs.promises.writeFile(parameter.historyFile, JSON.stringify(history, null), (error) => {
    if (error) return console.log(error);
  });
  const fileName = parameter.musicFile(lastFileNumber + 1);
  //console.log(fileName);
  let outFile = fs.createWriteStream(fileName);

  await (() => {
    return new Promise((resolve, reject) => {
      let request = https.get(url, function(response) {
        response.pipe(outFile);
        response.on("end", function() {
          outFile.close();
          /*fs.unlink(`./musicFiles/file_${lastFileNumber + 1}.mp3`, function (err) {
            if (err) throw err;
            console.log("file deleted");
          });*/
          resolve();
        });
      });
      // エラーがあれば扱う。
      request.on("error", function(error) {
        console.log("Error: ", error);
        reject(error);
      });
    })
  })();

  return fileName;
};