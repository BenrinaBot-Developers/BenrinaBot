const Discord = require("discord.js");
const util = require("./util");
const client = util.client;

const { Logger, ProcessError, SystemError, Database } = require("./system");

var version = "1.5.0";

const db = require("./dbutil.js");

//実行 てかこの辺コード汚すぎる()
const Bot = new (class {
  Run() {
    console.log(util.startsAt);
    const bot = require("./command.js");
    client.on("messageCreate", (message) => {
      if (!message.author.bot) {
        db.db.set("msgcount", db.db.get("msgcount") + 1);
        bot.Run(message);
      }
    });
  }
})();
//ready

try {
  client.on("ready", () => {
    /*process.on('uncaughtException', (err, origin) => {
    new ProcessError(err, origin).log();
  });*/

    console.log(`${client.user.tag} でログインしています。`);
    Logger.log(Logger.Type.START_UP, { date: util.startsAt });
    Bot.Run();
    require("./test.js");

    (async () => {
      const db = new Database.CacheManager("normal");
      await db.begin();
      let initialLaunch = (await db.get("initialLaunchAt")).data.first();
      console.log(initialLaunch);
      if (!initialLaunch) {
        initialLaunch = util.startsAt.getTime();
        await db.set("initialLaunchAt", initialLaunch);
      }
      console.log(initialLaunch);
      let count = 0;
      setInterval(() => {
        let now = new Date();
        const srvkz = client.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c);
        const list = [
          `1.0.0-dev版のbeta機能を全鯖に配信中!!`, //notice
          `Node.js v17/Discord.js v13導入！！`,
          `起動後${now - util.startsAt}秒/通算${now - initialLaunch}秒...`,
          //`処理したメッセージの数...${db.db.get("msgcount")}個...`,
          `${client.guilds.cache.size}サーバーで稼働中/総計ユーザー数：${srvkz}人`,
        ];

        client.user.setActivity(list[count], { type: "PLAYING" });
        count++;

        if (count >= list.length) {
          count = 0;
        }
      }, 1000 * 5);
    })();

    return;
  });

  try {
    require("dotenv").config();
  } catch (e) {
    console.error(e);
  }
  if (process.env.EXECUTION_LOCATION === "replit") {
    client.login(process.env.TOKEN).catch(console.error);
  } else if (process.env.EXECUTION_LOCATION === "local") {
    client.login(process.env.TEST_TOKEN).catch(console.error);
  }
} catch (e) {
  new SystemError(e).log();
}
