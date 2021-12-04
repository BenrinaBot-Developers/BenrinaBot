require("dotenv").config();

const fetch = require("node-fetch");

if (process.argv[2] !== "run") return;

(async () => {
  try {
    const response = await fetch(`${process.env.REBOOT_URL}?token=${process.env.TOKEN}`);
    const text = await response.text();
    console.log(text);
  } catch (error) {
    console.log(error);
  }
})();
