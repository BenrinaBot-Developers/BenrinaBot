const exec = require("child_process").exec;
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

require("../src/bot.js");
