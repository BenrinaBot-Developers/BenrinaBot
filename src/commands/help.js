'use strict';

const Discord = require("discord.js");
const util = require("../util.js");
const client = util.client
const { PageController } = require("../system")

const help = function(_from) {
  const pages = require("./pages/helpEmbeds")
  //console.log(pages)
	const pageController = new PageController({title:"ヘルプぅ！！！", pageLoop:true, pageNumber: true, endMessage:{content: "おしまい！"},
    authors:[_from?.user.id]})
  pageController.addPages(...pages);
  //console.log(_from)
  return pageController.begin(_from)
}
exports.help = help;