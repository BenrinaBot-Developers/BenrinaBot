"use strict";
const express = require("express");

const app = express();

app.get("/reboot", (req, res) => {
  if (req.query.token !== process.env.TOKEN) {
    res.send("Invalid token\n");
    return;
  }
  res.send("Rebooting\n");
  require("../replit/reboot.js");
});

app.listen("3000", () => {
  console.log("Application started");
});

//BOT
require("./bot.js");

// リクエストの処理
/*
function doRequest(req, res) {
  let url = req.url;
  if ("/" == url) {
    fs.readFile(`${__dirname}/web/index.html`, "UTF-8", function (err, data) {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(data);
      res.end();
    });
  } else if(url.startsWith("/")) {
    console.log(url);
    if (url.match(/\.js$/)) {
      //console.log(url)
      fs.readFile(`${__dirname}/web${url}`, "UTF-8", function (err, data) {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        res.write(data);
        res.end();
      });
      } else if (url.match(/\.png$/)) {
        res.writeHead(200, {'Content-Type': `image/png; charset=utf-8`});
        var image = fs.readFileSync(`${__dirname}/web${url}`, "binary");
        res.end(image, "binary");
    }
  }
}*/
