const exec = require("child_process").exec;

const { client } = require("../src/util.js");

exec("sh replit/reboot.sh", (error, stdout, stderr) => {
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
