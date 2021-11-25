'use strict';

const Discord = require("discord.js");
const { client } = require("../util.js");

const listenedEvents = [
  "guildCreate"
];

listenedEvents.forEach(_eventName => {
    client.on(_eventName, (...values)=> { //これこそ残余因数でいけoo
      callback(_eventName,values)
  })
})

function callback(_event,_values) {
	switch(_event){
		case "guildCreate":{
		  guildCreate(_values)
	  }
  }
}
//なにした？ああ コールバックそとにだした　こうしないと、いちいち新しく生成されるせいでメモリ食

function guildCreate(guild)
{






	return;
}