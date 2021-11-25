'use strict';

const { Collection } = require("discord.js");
const { client, slashguild, isAdmin } = require("../util.js")

const functions = require("../functions.js");
const {
  errors, API,
  SlashCommand, MessageCommand,
  CommandController, PageController
} = require("../system");

console.log();
const os = require('os');
console.log(os.cpus());
console.log(process.memoryUsage());

const users = new Collection();
users.set("uni", { exp: 810 });
users.set("akane", { exp: 114514 });

users.sort((a, b) => b.exp - a.exp);

console.log(users);

/*
client.on("messageCreate", message => {
  if (message.channel.id != "879671366444515340") return;
  if(message.author.bot) return;
  console.log(message.attachments);
});
*/

require("../commands/compose.js")

client.on("messageCreate", message => {
  //message.channel.send(`ghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh`);
  if (message.channel.id != "874639550515937385") return;
  if (message.author.bot) return;
  //console.log(message.content, message.author.id, client.user.id);
  API.connectSunaba(message).then((body) => {
    message.channel.send(body.systemText.expression);
  }).catch(console.log);
});

client.on("messageCreate", message => {
  if (message.author.id == client.user.id) return;
  if (message.content != "/bt!db_test") return;
  console.log("ping: ", client.ws.ping);
  const ping_test = new Date();
  API.fetch("post", "https://script.google.com/macros/s/AKfycbzqU2cXUrPsgFhD4JBxj92Nj5af8i8xO72AzJ33FcOaEBPyA8I1j91LgUznmQt6zhmd/exec",
    {
      data: {
        action: "ping"
        /*action:"set",
        type:"normal",
        key:"test",
        data:{
          hello1:"WorldA",
          hello2:0,
          hello3: {inner1:"aa", inner2:4},
          hello4: {inner1:"bb", inner2: {innner1:"aaa", innner2:8}},
          hello5:"WorldE",
        }*/
      }
    }).then(_res => {
      const ping_test2 = new Date();
      console.log(_res, "time:", ping_test2 - ping_test)
    }).catch(console.log);;
});

const resend = new SlashCommand({
  name: "resend_dev", description: "parroting your words", type: SlashCommand.Type.GUILD, guildIDs: ["878512058088423454"],
  defaultPermission: false,
  options: [{ type: 3, name: "content", description: "The channel to send", required: true }],
  execute: (_txt) => {
    return {
      embeds: [{ title: "にゃー", color: 0x00ffff, description: _txt }]
    }
  }
})

const evalCommand = new MessageCommand({
  prefix: "/bt!", name: "eval", type: SlashCommand.Type.GUILD, guildIDs: ["878512058088423454"], options: { split: false },
  execute: function(_arguments) {
    let code = _arguments.replace(/^```js\n/, "").replace(/```$/, "");
    let response = (() => {
      if (isAdmin(this.author.id)) {
        if (code.match(/process|eval/)) {
          return errors.accessError(this);
        }
        let _res;
        try {
          eval(code);
          this.react("\u{2705}");
          _res = functions.getEmbed(0x00ff00, "Ran Eval", "Status:`success`");
        } catch (e) {
          _res = errors.runtimeError(this, e);
        }
        return _res;
      } else {
        return errors.permissionError(this);
      }
    })();
    return { embeds: [response] };
  }
});

const pageCmd = new SlashCommand({
  name: "page_test", description: "Show you my helps", type: SlashCommand.Type.GUILD, guildIDs: slashguild,
  execute: function() {  //アロー関数は不可
    const pageController = new PageController({
      title: "page_test", pageLoop: true, pageNumber: true, endMessage: { content: "thanks" },
      authors: [this.from ?.user.id]
    })
    pageController.addPages(
      { embeds: [functions.getEmbed(0x00ffff, "0ページ目の内容")] },
      { embeds: [functions.getEmbed(0x00ffff, "1ページ目の内容")] },
      { embeds: [functions.getEmbed(0x00ffff, "2ページ目の内容")] },
    );
    return pageController.begin(this.from) //起動
  }
})


const test_commands = new CommandController([resend, evalCommand,/*translate, pageCmd*/]); //Managerに登録

test_commands.addCommand(
  new SlashCommand({
    name: "cmds-test", description: "Get commandlist.", type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    execute() {
      const pageController = new PageController({
        title: "page_test", pageLoop: true, pageNumber: true, endMessage: { content: "thanks" },
        authors: [this.from ?.user.id]
      })
      test_commands.generateHelpEmbed({ split: 1 }).forEach(_embed => {
        pageController.addPages({ embeds: [_embed] });
      })
      return pageController.begin(this.from) //起動
    }
  })
);

(async () => {
  const _returns = await test_commands.Slash.register()
  console.log(_returns);
  //test_commands.Slash.remove().then(console.log);
  {  //update
    resend.permissions = async (_guildID) => {
      (await functions.filterUsersByPermissions(await client.guilds.fetch(_guildID), "MANAGE_CHANNELS"))
        .map(_user => ({ type: "user", id: _user.id, permission: true })),
        resend.editCommand().catch(console.log);
    }
  }
})();