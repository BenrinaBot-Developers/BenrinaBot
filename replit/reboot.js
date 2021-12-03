const exec = require("child_process").exec;

const { client } = require("../src/util.js");

exports.reboot = () => {
  exec("sh git pull origin develop", (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });

  for (var key in require.cache) {
    delete require.cache[key];
  }

  (async () => {
    await client.destroy();
    require("../src/bot.js");
  })();
};
