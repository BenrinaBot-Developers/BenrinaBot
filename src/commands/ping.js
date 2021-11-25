'use strict';

const { Discord, Collection } = require("discord.js");
const { client } = require("../util.js")

const fs = require("fs").promises;
const parse = require('csv-parse/lib/sync');

const { API } = require("../system")
const { BaseDatabaseAccessor } = require("../database/accessor.js")
const functions = require("../functions.js");

module.exports = async function*(_details) {
  const results = new Collection();
  results.set("GENERAL", new Collection()
    .set("Discord_GatewayAPI [WebSocket]", client.ws.ping)
    .set("CommandReceiving", new Date() - this.from.createdAt)
  );

  if(_details) {
    results.set("API").set("DATABASE");
    {
      const values = new Collection();
      const startsAt = new Date();
      await Promise.all([
        API.connectSunaba({content:"init"}).then(() => values.set("Sunaba", new Date() - startsAt)).catch(console.log),
        API.connectWolframAlpha().then(() => values.set("WolframAlpha", new Date() - startsAt)).catch(console.log),
        API.googleTranslate().then(() => values.set("GoogleTranslate", new Date() - startsAt)).catch(console.log),
        API.searchWikipedia().then(() => values.set("Wikipedia", new Date() - startsAt)).catch(console.log),
        db_ping()
      ]);
      results.set("API", values);
    }

    async function db_ping() {
      const values = new Collection();
      const startsAt = new Date();
      const body = await BaseDatabaseAccessor.ping()//.catch(console.log);
      const endsAt = new Date();
      console.log(body)
      values
        .set("Upstream", body?.result?.timestamp - startsAt)
        .set("Downstream", endsAt - body?.response_timestamp)
      results.set("DATABASE", values);
    }
  }

  const output = functions.getEmbed(0x00ffff, "Latencies", "Unit: milliseconds");
  output.addFields(
    results.map((_values, _type) => {
      let valuesStr = "";
      _values?.forEach((_value, _tag) => {
        if(_tag?.description === "$") valuesStr += "\n";
        else valuesStr += `${_tag}: \`${_value}\n\``;
      })
      return {name:_type, value:valuesStr};
    })
  );
  yield {content:"Pong!", embeds:[output]};

  output.fields[0].value += `MessageSending: \`Now measuring...\`\n`;
  const editedAt = new Date();
  const edited = yield {edit:true, message:{embeds:[output]}};

  output.fields[0].value = output.fields[0].value.replace("Now measuring...", edited?.editedAt - editedAt);
  return {edit:true, message:{embeds:[output]}}
}