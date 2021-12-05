"use strict";

/*
<注意>
ここを迂闊にいじってしまうとbotのシステムすべてに支障が出る可能性があります。
このコードの意味を完全に理解していて、かつこのコードを書き換えることでコード作成者のケツをけり上げる以外の明確な書き換えの理由がない場合は書き換えないようにお願いします。
注意提示者:緋音
コード作成者:みどりむし
*/
const { Collection, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const client = require("../util.js").client;

const Logger = require("./Logger.js");
const { CommandError } = require("./ApplicationError.js");

class BaseCommand extends SlashCommandBuilder {
  constructor(_definition) {
    super();
    Object.defineProperty(this, "name", { value: _definition.name });
    this.description = _definition.description ?? true;
    this.execute = _definition.execute;
    this.type = _definition.type; // global or guild
    if (this.type === BaseCommand.Type.GUILD) {
      this.guildIds =
        _definition.guildIds?.filter((_guildId) => client.guilds.cache.has(_guildId)) ?? new Array(1).fill();
    } else if (this.type === BaseCommand.Type.GLOBAL) {
      this.guildIds = [null];
    } else {
      throw new Error("Invalid command's type: " + this.type);
    }
    Object.assign(this.options, _definition.options);
  }

  static Type = {
    GUILD: Symbol("Guild"),
    GLOBAL: Symbol("Global"),
  };
}

class SlashCommand extends BaseCommand {
  constructor(_definition = {}) {
    super(_definition);
    this.id = {};
    this.timeout = _definition.timeout ?? 15 * 1000;
    this.defaultPermission = _definition.defaultPermission ?? true;
    this.permissions = _definition.permissions;
    //console.log(this.permissions)
    this.argumentTypes = _definition.argumentTypes;
  }
  async *run(_arguments, _message) {
    let execute = this.execute;
    if (typeof execute === "function") execute = await execute.bind(_message)(..._arguments);
    execute ??= "_Command Not Found_";
    if (typeof execute === "string") execute = [execute];
    if (typeof (execute[Symbol.iterator] ?? execute[Symbol.asyncIterator]) === "function") {
      return yield* execute;
    } else {
      return execute;
    }
  }

  static async #getApplicationCommandManager(_type, _commandId, _guildId = null) {
    if (!_commandId) throw new Error("Invalid command's Id");
    switch (_type) {
      case SlashCommand.Type.GUILD:
        return client.guilds.cache.get(_guildId).commands;
        break;
      case SlashCommand.Type.GLOBAL:
        return client.application.commands;
        break;
      default:
        throw new Error("Invalid command's type");
    }
  }

  static async postCommandId(_guildId, _definition) {
    let guildId;
    switch (_definition.type) {
      case SlashCommand.Type.GUILD:
        guildId = _guildId;
        break;
      case SlashCommand.Type.GLOBAL:
        guildId = null;
        break;
      default:
        throw new Error("Invalid command's type");
    }
    //console.log(_definition.type, guildId)
    const response = await client.application.commands.create(_definition, guildId).catch((_response) => {
      throw _response;
    });
    //console.log(_definition.permissions)
    if (_definition.permissions) {
      response.permissions.set({
        permissions: _definition.permissions(guildId),
      });
    }
    return response;
  }

  static async deleteCommandId(_type, _commandId, _guildId = null) {
    const commands = await this.#getApplicationCommandManager(_type, _commandId, _guildId).catch((_response) => {
      throw _response;
    });
    //console.log(_type, _commandId, _guildId)
    let command = await commands.fetch(_commandId).catch((_response) => {
      throw _response;
    });
    //console.log(command)
    await command.delete().catch((_response) => {
      throw _response;
    });
    //console.log(response)
    return command;
  }

  static async editCommandId(_type, _commandId, _guildId = null, _definition) {
    const commands = await this.#getApplicationCommandManager(_type, _commandId, _guildId).catch((_response) => {
      throw _response;
    });
    //console.log(_type, _commandId, _guildId)
    let command = await commands.fetch(_commandId).catch((_response) => {
      throw _response;
    });
    //console.log(command)
    await command.edit(_definition).catch((_response) => {
      throw _response;
    });
    //console.log(response)
    return command;
  }

  postCommand(_guildIds = this.guildIds) {
    //console.log(this._createEndpost(_guildIds))
    const postCommands_promise = _guildIds.map((_guildId) => {
      return new Promise((resolve, reject) => {
        SlashCommand.postCommandId(_guildId, this)
          .then(async (response) => {
            this.id[_guildId] = response.id;
            return resolve(response);
          })
          .catch((_error) => {
            return reject(_error);
          });
      });
    });
    //console.log(Promise.all(postCommands_promise))
    return Promise.all(postCommands_promise);
  }

  deleteCommand(_guildIds = this.guildIds) {
    const deleteCommands_promise = _guildIds.map((_guildId) => {
      return new Promise(async (resolve, reject) => {
        await SlashCommand.deleteCommandId(this.type, this.id[_guildId], _guildId)
          .then((_response) => {
            return resolve(_response);
          })
          .catch((_error) => {
            return reject(_error);
          });
      });
    });
    return Promise.all(deleteCommands_promise);
  }

  editCommand(_guildIds = this.guildIds) {
    const deleteCommands_promise = _guildIds.map((_guildId) => {
      return new Promise(async (resolve, reject) => {
        await SlashCommand.editCommandId(this.type, this.id[_guildId], _guildId, this)
          .then((_response) => {
            return resolve(_response);
          })
          .catch((_error) => {
            return reject(_error);
          });
      });
    });
    return Promise.all(deleteCommands_promise);
  }

  static ArgumentType = {
    ARRAY: Symbol("Array"),
    OBJECT: Symbol("Object"),
  };
}
//Object.assign(SlashCommand.prototype, SlashCommandBuilder);

class MessageCommand extends BaseCommand {
  constructor(_definition) {
    super(_definition);
    this.prefix = _definition.prefix;
    if (this.options?.split !== false) this.options = { split: true };
  }
  async run(_arguments, _message) {
    return await this.execute.bind(_message)(..._arguments);
  }
}

class BaseCommandManager {
  constructor() {
    this.commands = new Collection();
  }
  generateHelp() {
    return new CommandHelp(this.commands.map((_command, _name) => new CommandInfomation(_name, _command.data)));
  }
}

class SlashCommandManager extends BaseCommandManager {
  constructor(_commands = []) {
    super(_commands);
    this.addCommands(_commands);
    //実行&応答
    client.on("interactionCreate", async (_interaction) => {
      if (!_interaction.isCommand()) return;
      const options = _interaction.options.data ?? [];
      //console.log(options)
      let interactionArguments,
        subCommandName = "";
      switch (options[0]?.type) {
        case "SUB_COMMAND":
          {
            //console.log(options)
            subCommandName = options[0].name;
            interactionArguments = options[0].options ?? [];
          }
          break;
        case "SUB_COMMAND_GROUP":
          {
            //Develop on demand.
          }
          break;
        default: {
          interactionArguments = options;
        }
      }
      const calledCommand = this.commands.get(_interaction.commandName);
      if (!calledCommand) return;
      //console.log(interactionArguments)
      let argumentsData;
      if (calledCommand.data.argumentTypes === SlashCommand.ArgumentType.OBJECT) {
        argumentsData = {};
        interactionArguments.forEach((_argument) => {
          argumentsData[_argument.name] = _argument.value;
        });
        argumentsData = [argumentsData];
      } else {
        argumentsData = interactionArguments.map((_argument) => _argument.value);
      }
      //console.log(this.argumentTypes, _interaction.commandName)
      //console.log(_interaction)
      console.log(calledCommand.data.name, argumentsData);

      let firstResponse = true,
        deferred = false;
      let timeout = false;
      const deferTimer = setTimeout(() => {
        _interaction.deferReply();
        deferred = true;
      }, 1000);
      //console.log(calledCommand.data.timeout);
      const timeLimiter = setTimeout(() => {
        if (deferred) {
          clearTimeout(deferTimer);
          _interaction.followUp(`_Timeout_`);
          deferred = false;
        } else {
          _interaction.reply(`_Timeout_`);
        }
        timeout = true;
      }, calledCommand.data.timeout);

      const run = calledCommand.run(argumentsData, _interaction, subCommandName);
      /*try {
        run =
      } catch(error) {
        console.log("Error:", error);
      }*/
      //let results = await run.next();
      let results, message;
      do {
        try {
          results = await run.next(message);
        } catch (_e) {
          clearTimeout(timeLimiter);
          clearTimeout(deferTimer);
          const errorId = (await new CommandError("Unexpected Error", _e, calledCommand).log())[0].id;
          console.log(errorId);
          if (deferred) {
            clearTimeout(deferTimer);
            _interaction.followUp(`予期せぬエラーが発生しました。\nエラーId：${errorId}`);
          } else {
            _interaction.reply(`予期せぬエラーが発生しました。\nエラーId：${errorId}`);
          }
          return;
        }

        if (timeout) return;

        let value = results.value;
        if (typeof value === "string") value = { content: value };
        //console.log("done:", results)
        if (firstResponse) {
          clearTimeout(timeLimiter);
          if (deferred) {
            message = await _interaction.followUp(value);
          } else {
            clearTimeout(deferTimer);
            message = await _interaction.reply({ ...value, fetchReply: true });
          }
          firstResponse = false;
        } else {
          if (value?.edit) {
            message = await _interaction.editReply(value?.message);
          } else {
            if (value) message = await _interaction.followUp(value);
          }
        }
      } while (!results.done && !timeout);
      console.log("Command Success");
    });
  }

  addCommands(_commands) {
    _commands.forEach((_command) => {
      let _commandName = _command.name;
      this.commands.set(_commandName, {
        data: _command,
        run(_arguments, _from, _subCommand) {
          let commandName = _from.commandName;
          if (_subCommand) commandName += "." + _subCommand;

          const argumentsString =
            _command.argumentTypes === SlashCommand.ArgumentType.OBJECT
              ? JSON.stringify(_arguments)
              : _arguments.map((_arg) => `"${String(_arg)}"`).join(",");
          Logger.log(Logger.Type.COMMAND, {
            command: _command.name,
            message: {
              content: `SlashCommand[${commandName}(${argumentsString})]`,
              author: _from.member.user,
              channel: client.channels.cache.get(_from.channelId),
              guild: _from.guild,
              id: _from.id,
            },
          });
          return _command.run(_arguments, { from: _from, subCommand: _subCommand });
        },
      });
    });
  }

  register() {
    const postCommands_promise = this.commands.map((_command) => {
      //console.log(_command.slashCommands.data);
      return _command.data.postCommand();
    });
    return Promise.allSettled(postCommands_promise);
  }
  remove() {
    const deleteCommands_promise = this.commands.map((_command) => {
      //console.log(_command.data);
      return _command.data.deleteCommand();
    });
    return Promise.allSettled(deleteCommands_promise);
  }
}

class MessageCommandManager extends BaseCommandManager {
  constructor(_commands = []) {
    super(_commands);
    this.addCommands(_commands);

    //実行&応答
    client.on("messageCreate", (_message) => {
      //console.log(this.commands)
      this.commands.forEach(async (_command) => {
        //console.log(_command)
        if (_message.content.match(_command.regExp) && _command.data.guildIds.indexOf(_message.guild.id) != -1) {
          let _arguments = _message.content.replace(_command.regExp, "");
          //console.log(_command.data.options)
          if (_command.data.options.split) {
            _arguments = String(_arguments).trim().split(/\s+/);
          } else {
            _arguments = [_arguments];
          }
          //console.log(_arguments)
          const return_value = await _command.run(_arguments, _message);
          //console.log(return_value);
          _message.channel.send(return_value);
        }
      });
    });
  }

  addCommands(_commands) {
    _commands.forEach((_command) => {
      let _commandName = _command.name;
      let _commandRegExpText = _commandName;
      if (_command.prefix) _commandRegExpText = _command.prefix + _commandName;
      this.commands.set(_commandName, {
        regExp: RegExp("^" + _commandRegExpText + " "),
        data: _command,
        run: (_arguments, _from) => {
          Logger.log(Logger.Type.COMMAND, { command: _command.name, message: _from });
          return _command.run(_arguments, _from);
        },
      });
    });
  }
}

class CommandArgument extends Collection {
  constructor(_options) {
    super();
    Object.defineProperty(this, "name", { value: _options.name });
    ["type", "description", "choices", "default"].forEach((_key) => {
      this.set(_key, _options[_key]);
    });
    this.set("comment", _options.comment ?? _options.description).set("required", _options.required ?? false);
  }

  toString({ _comment = false } = {}) {
    let string = `${this.name}`;
    if (!this.get("required")) string = `_${string}_`;

    string += ` [${this.get("type")}]`;
    const defaultValue = this.get("default");
    if (defaultValue) string += ` (${defaultValue})`;

    if (_comment) string += `\n> ${this.get("comment")}`;

    return string;
  }
}

class CommandInfomation extends Collection {
  constructor(_name, _data) {
    super();
    Object.defineProperty(this, "name", { value: _name });
    ["description", "comment"].forEach((_key) => {
      this.set(_key, _data[_key]);
    });
    this.set("comment", _data.comment ?? _data.description).set(
      "options",
      _data.options?.map((_option) => new CommandArgument(_option))
    );
    //console.log(this.toString());
  }

  toString() {
    let string = "";
    string += this.get("comment") + "\n";
    const options = this.get("options");
    if (options) options.forEach((_option) => (string += `・${_option.toString()}\n`));
    return string;
  }
}

class CommandHelp extends Collection {
  constructor(_commands) {
    super();
    console.log(_commands);
    _commands.forEach((_command) => {
      //console.log(_command)
      this.set(_command.name, _command);
    });
    this.sort((a, b) => (a.name > b.name ? 1 : -1));
    //console.log(this.toEmbed());
  }
  static get [Symbol.species]() {
    return Collection;
  }

  toEmbeds({ split = 25 } = {}) {
    return this.split(split).map((_page) => {
      return new MessageEmbed().addFields(
        _page.map((_command) => {
          return {
            name: _command.name,
            value: _command.toString(),
            inline: true,
          };
        })
      );
    });
  }
}

class IntegratedCommandManager {
  constructor(_commands = []) {
    let slashCommands = [],
      messageCommands = [];
    _commands.forEach((_command) => {
      this.#pushByClass(_command, slashCommands, messageCommands);
    });
    this.Slash = new SlashCommandManager(slashCommands);
    this.Message = new MessageCommandManager(messageCommands);
  }

  addCommands(_commands = []) {
    let slashCommands = [],
      messageCommands = [];
    _commands.forEach((_command) => {
      this.#pushByClass(_command, slashCommands, messageCommands);
    });
    this.Slash.addCommands(slashCommands);
    this.Message.addCommands(messageCommands);
  }
  addCommand(_command) {
    this.addCommands([_command]);
  }

  #pushByClass(_command, _slashCommands, _messageCommands) {
    switch (_command.constructor) {
      case SlashCommand:
        _slashCommands.push(_command);
        break;
      case MessageCommand:
        _messageCommands.push(_command);
        break;
      default:
        throw new Error("Invalid class:" + String(_command.constructor));
    }
  }
}

class CommandController extends IntegratedCommandManager {
  createInfomationList() {
    return this.Slash.generateHelp().concat(this.Message.generateHelp());
  }
  generateHelpEmbed(_options) {
    //console.log(this.Slash.generateHelp())
    return this.Slash.generateHelp().toEmbeds(_options);
  }
}

module.exports = {
  BaseCommand,
  SlashCommand,
  MessageCommand,
  BaseCommandManager,
  SlashCommandManager,
  MessageCommandManager,
  IntegratedCommandManager,
  CommandController,
};
