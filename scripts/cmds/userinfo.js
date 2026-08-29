const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "userinfo",
    version: "1.1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "info",
    shortDescription: "User Information",
    longDescription: "Show stylish user information with avatar",
    guide: "{pn} [reply/tag/uid]",
    countDown: 5,
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    try {
      const { threadID, senderID, messageID, mentions } = event;

      let targetID;

      if (mentions && Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
      } else if (event.messageReply) {
        targetID = event.messageReply.senderID;
      } else if (args[0]) {
        targetID = args[0];
      } else {
        targetID = senderID;
      }

      const userInfo = await api.getUserInfo(targetID);

      if (!userInfo || !userInfo[targetID]) {
        return api.sendMessage(
          `❌ 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗\n───────────────\n» 👤 𝗨𝘀𝗲𝗿 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.\n───────────────\n» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍`,
          threadID,
          messageID
        );
      }

      const info = userInfo[targetID];

      const cacheDir = path.join(__dirname, "cache");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const imgPath = path.join(cacheDir, `avatar_${targetID}.png`);

      try {
        const avatarURL =
          `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        const avatar = await axios.get(avatarURL, {
          responseType: "arraybuffer"
        });

        fs.writeFileSync(imgPath, Buffer.from(avatar.data));
      } catch (e) {
        console.log("Avatar fetch error:", e.message);
      }

      const gender =
        info.gender == 2
          ? "👨 𝗠𝗮𝗹𝗲"
          : info.gender == 1
          ? "👩 𝗙𝗲𝗺𝗮𝗹𝗲"
          : "❓ 𝗨𝗻𝗸𝗻𝗼𝘄𝗻";

      let userClass = "👤 𝗡𝗼𝗿𝗺𝗮𝗹 𝗨𝘀𝗲𝗿";

      try {
        if (
          global.GoatBot &&
          global.GoatBot.config &&
          Array.isArray(global.GoatBot.config.adminBot) &&
          global.GoatBot.config.adminBot.includes(String(targetID))
        ) {
          userClass = "⚡ 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻";
        }
      } catch (e) {}

      const msg = 
`👤 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
───────────────
» 🙍 𝗡𝗔𝗠𝗘 : ${info.name || "N/A"}
» 🏷️ 𝗙𝗜𝗥𝗦𝗧 𝗡𝗔𝗠𝗘 : ${info.firstName || "N/A"}
» 🆔 𝗨𝗜𝗗 : ${targetID}
» 🏫 𝗖𝗟𝗔𝗦𝗦 : ${userClass}
» 🚻 𝗚𝗘𝗡𝗗𝗘𝗥 : ${gender}
» 🎂 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬 : ${info.birthday || "Not Set"}
» 🤝 𝗙𝗥𝗜𝗘𝗡𝗗 : ${info.isFriend ? "✅ Yes" : "❌ No"}
» 🔗 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 : https://facebook.com/${targetID}
───────────────
» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

      if (fs.existsSync(imgPath)) {
        api.sendMessage(
          {
            body: msg,
            attachment: fs.createReadStream(imgPath)
          },
          threadID,
          () => {
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          },
          messageID
        );
      } else {
        api.sendMessage(msg, threadID, messageID);
      }

    } catch (err) {
      console.error(err);
      api.sendMessage(
        `❌ 𝗘𝗥𝗥𝗢𝗥\n───────────────\n» ⚠️ 𝗖𝗼𝘂𝗹𝗱𝗻’𝘁 𝗳𝗲𝘁𝗰𝗵 𝘂𝘀𝗲𝗿 𝗶𝗻𝗳𝗼.\n───────────────\n» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍`,
        event.threadID,
        event.messageID
      );
    }
  }
};
