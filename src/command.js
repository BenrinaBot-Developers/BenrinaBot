'use strict';

const Discord = require("discord.js");
const { client, slashguild } = require("./util.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

const { SlashCommand, MessageCommand, CommandController } = require("./system");

const functions = require("./functions.js");
const dbutil = require("./dbutil.js");
const db = dbutil.db;

const commands = new CommandController();

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    execute: ["aaa", "bbb", "ccc"]
  }).setName("test")
    .setDescription("Command for developers.")
);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    argumentTypes: SlashCommand.ArgumentType.OBJECT,
    options: [
      {
        type: "STRING", name: "output", description: "Whether to output as a text file or as a message (Default:message)",
        choices: [
          { name: "as a message", value: "message" },
          { name: "as a text file", value: "file" }
        ]
      },
      { type: "BOOLEAN", name: "accessible", description: "Whether to narrow down the displayed channels by permissions (Default:false)" },
      { type: "BOOLEAN", name: "voice", description: "Whether to show voice channels (Default:true)" },
      {
        type: "STRING", name: "thread", description: "Whether to show thread channels (Default:none)",
        choices: [
          { name: "None", value: "none" },
          { name: "Active", value: "active" },
          { name: "All", value: "all" }
        ]
      },
    ],
    execute: require("./commands/serverMap.js")
  }).setName("map")
    .setDescription("Generate a map of your server.")
);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    timeout: 1.5 * 60 * 1000,
    execute: require("./commands/compose.js")
  }).setName("compose")
    .setDescription("Give you music made by AI (Wolfram Tones)")
);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    options: [{ type: "BOOLEAN", name: "details", description: "Whether to measure detailed information" }],
    execute: require("./commands/ping.js")
  }).setName("ping")
    .setDescription("Measure the latency to and from each service.")
);

const rnd = new SlashCommand({
  type: SlashCommand.Type.GUILD,
  guildIDs: slashguild,
  options: [{ type: "STRING", name: "length", description: "nannketa", required: true },{ type: "BOOLEAN", name: "isNum", description: "Number only?" }],
  execute: require("./commands/rnd.js")
}).setName("rnd")
    .setDescription("Rannsu")
commands.addCommand(rnd);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    execute: () => {
      const { slashinvite } = require("./commands/invite.js");
      return {
        embeds: [slashinvite()]
      };
    }
  }).setName("invite")
    .setDescription("Send an invite link.")
);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    execute: () => {
      const { support } = require("./commands/support.js");
      return {
        embeds: [support()]
      };
    }
  }).setName("support")
    .setDescription("Send an support server link.")
);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    execute: function() {
      const { help } = require("./commands/help.js")
      return help(this.from)
    }
  }).setName("help")
    .setDescription("Show you my helps.")
);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    execute: function() {
      const { cmdlist } = require("./commands/cmd.js")
      return cmdlist(this.from)
    }
  }).setName("cmd")
    .setDescription("Get commandlist.")
);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    options: [{
      type: "STRING", name: "choices", description: "Kind of things you want to contact us.", required: true,
      choices: [
        { name: "バグ報告", value: "bug" },
        { name: "新機能", value: "enchantment" },
        { name: "その他申請", value: "other" }
      ]
    },
    { type: "STRING", name: "contents", description: "Content of you want to tell us.", required: true }],
    execute: require("./commands/contact.js")
  }).setName("contact")
    .setDescription("Contact to Bot Devs.")
);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    options: [{
      type: "STRING", name: "choices", description: "Kind of thing you want to report us", required: true,
      choices: [
        { name: "荒らし", value: "arashi" },
        { name: "規約違反", value: "legal" },
        { name: "その他", value: "other" }
      ]
    },
    { type: "STRING", name: "userid", description: "Bad user ID", required: true },
    { type: "STRING", name: "contents", description: "Content you want to tell us", required: true }],
    execute: require("./commands/report.js")
  }).setName("report")
    .setDescription("Report bad user.")
);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    timeout: 30 * 1000,
    options: [{ type: "STRING", name: "formula", description: "What you want me to solve", required: true }],
    execute: require("./commands/mathSolver.js")
  }).setName("math")
    .setDescription("Solve some math problems.")
);

const translate = require("./commands/translate.js")
const translation = new SlashCommand({
  type: SlashCommand.Type.GUILD, guildIDs: slashguild,
  execute: translate.execute
}).setName("translate")
    .setDescription("Translate your sentence.")
commands.addCommand(translation);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    execute: require("./commands/first.js")
  }).setName("first")
    .setDescription("Generate a link to the top of this channel.")
);

const wikipedia = new SlashCommand({
  type: SlashCommand.Type.GUILD,
  guildIDs: slashguild, argumentTypes: SlashCommand.ArgumentType.OBJECT,
  execute: require("./commands/wikipedia.js").search
}).setName("wikipedia")
    .setDescription("Search on Wikipedia.")
commands.addCommand(wikipedia);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    options: [
      { type: "INTEGER", name: "seconds", description: "ratelimits seconds", required: true },
      { type: "STRING", name: "reason", description: "reasons", required: false }
    ],
    execute: require("./commands/rate.js")
  }).setName("setrate")
    .setDescription("Set ratelimit in channel.")
);

const devtest = new SlashCommand({
  type: SlashCommand.Type.GUILD,
  guildIDs: slashguild,
  options: [{ type: "STRING", name: "arg1", description: "args1", required: true }],
  execute: require("./commands/devcmd.js")
}).setName("devtest")
    .setDescription("The command for developers")
commands.addCommand(devtest);

commands.addCommand(
  new SlashCommand({
    type: SlashCommand.Type.GUILD, guildIDs: slashguild,
    options: [{
      type: "STRING", name: "command", description: "What kind of thing do you want to report us.", required: true,
    }],
    execute: require("./commands/detailcmd.js")
  }).setName("cmdinfo")
    .setDescription("detail of commands")
);

//console.log(commands.createInfomationList().split(3));
//ここにあったコードはarcive channel

(async () => {
  await commands.Slash.register().then(console.log)
  //await commands.Slash.remove().then(console.log)
  //updateTranslation();
  {//update
    const languages = await translate.getLanguages(25);
    translation.options = [{ type: "STRING", name: "sentenc", description: "What you want me to translate", required: true },
    { type: "STRING", name: "to", description: "Target language", required: true, choices: languages },
    { type: "STRING", name: "from", description: "Source language", choices: languages }
    ]
    translation.editCommand().catch(console.log);

    wikipedia.options = [
      { type: "STRING", name: "word", description: "Word which you want to research", required: true },
      { type: "INTEGER", name: "limit", description: "Total number of pages to return [1－500] (Default:10)" },
      { type: "STRING", name: "language", description: "Language of the output (default:Japanese)", choices: languages }
    ],
      wikipedia.editCommand().catch(console.log);
  }
})();


/*
commands.addCommand(
  new SlashCommand({name:"cmdinfo", description:"Contact to Bot Devs", type:SlashCommand.Type.GUILD, guildIDs:slashguild, 
  options:[{type:"STRING", name:"command", description:"ypaaaaaaaaaaaa", required:true, 
    choices:[
      {name:"help", value:"help"}, 
	{name:"help", value:"help"}, 
    ]
  }, 
], 
	  execute: require("./commands/detailcmd.js")
  })
]);*/
/*
client.on("messageCreate", message => {
  if(message.content !== "/bt!test_ddd") return;
  slashCommands.Slash.removeAllCommands().then(console.log)
});
*/
module.exports.Run = async function Run(message) {

}
