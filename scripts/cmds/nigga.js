const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "nigga",
    aliases: [],
    version: "1.3",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 2,
    role: 0,
    description: "Send a roast image using UID (mention / reply / self)",
    category: "fun",
    guide: {
      en: "{pn} @mention\n{pn} (by reply)\n{pn} (for yourself)"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      let targetUID;

      // If user replied to a message
      if (event.type === "message_reply") {
        targetUID = event.messageReply.senderID;
      }
      // If user mentioned someone
      else if (event.mentions && Object.keys(event.mentions).length > 0) {
        targetUID = Object.keys(event.mentions)[0];
      }
      // Otherwise use self
      else {
        targetUID = event.senderID;
      }

      const url = `https://betadash-api-swordslush-production.up.railway.app/nigga?userid=${targetUID}`;
      const response = await axios.get(url, { responseType: "arraybuffer" });

      const filePath = path.join(__dirname, "cache", `roast_${targetUID}.jpg`);
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      api.sendMessage(
        {
          body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 😂 𝗟𝗼𝗼𝗸 𝗜 𝗳𝗼𝘂𝗻𝗱 𝗮 𝗻𝗶𝗴𝗴𝗮!
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );

    } catch (e) {
      console.error("Error:", e.message);
      api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝗔𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗖𝗼𝘂𝗹𝗱𝗻'𝘁 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲 𝗶𝗺𝗮𝗴𝗲.
» ⚠️ 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        event.messageID
      );
    }
  },
};
