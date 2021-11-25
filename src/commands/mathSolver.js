'use strict';

const Discord = require("discord.js");
const { client, slashguild } = require("../util.js")

const functions = require("../functions.js");
const { API, PageController } = require("../system")

module.exports = async function(formula){
  const pageController = new PageController({title:formula, pageLoop:true, pageNumber: true, authors:[this.from?.user.id]})
  function* toEmbed(_response) {
    for(const _pod of _response?.queryresult?.pods) {
       yield ({
        embeds:_pod.subpods.map(_subpods => functions.getEmbed(0x00ffff, _pod.title, _subpods.img.title)
          .setImage(_subpods.img.src))
      });
    }
  }
  const response = await API.connectWolframAlpha(formula, {reinterpret:true, translation:true})
    .catch(res => {pageController.addPages({embeds: [functions.getEmbed(0x00ff00, "Math","Status:`Rejected`")]})});
    if(response?.queryresult?.success){
      pageController.addPages(...toEmbed(response));
    } else {
      pageController.addPages({embeds:[functions.getEmbed(0x00ffff, "The Too Difficult Problem", "I couldn't solve the problem")]});
    }
  //console.log(this.from)
   return pageController.begin(this.from)
}