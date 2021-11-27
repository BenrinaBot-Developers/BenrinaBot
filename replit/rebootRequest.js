require("dotenv").config();

const fetch = require("node-fetch");

(async () => {
  try {
    const response = await fetch(`${process.env.REBOOT_URL}?token=${process.env.token}`);
    const text = await response.text();
    console.log(text);
  } catch (error) {
    console.log(error);
  }
})();
