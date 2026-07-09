const axios = require("axios");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"; // নাম পরিবর্তন করলে ফাইল বন্ধ হয়ে যাবে ⚠️
let designToggle = 0;

module.exports = {
  config: {
    name: "activemember",
    aliases: ["am"],
    version: "2.1",
    author: AUTHOR,
    countDown: 5,
    role: 0,
    shortDescription: "Top active members",
    longDescription: "Show top active members with auto design switch",
    category: "box chat",
    guide: ""
  },

  onStart: async function ({ api, event }) {

    if (module.exports.config.author !== AUTHOR) {
      return api.sendMessage(
        "⛔ AUTHOR NAME CHANGED!\n🔒 THIS FILE IS NOW LOCKED.",
        event.threadID
      );
    }

    const threadID = event.threadID;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs || threadInfo.userInfo.map(u => u.id);
      const messageCounts = {};

      participantIDs.forEach(uid => {
        messageCounts[uid] = 0;
      });

      const history = await api.getThreadHistory(1000, threadID, undefined).catch(() => []);

      history.forEach(msg => {
        const sender = msg.senderID;
        if (messageCounts[sender] !== undefined) {
          messageCounts[sender]++;
        }
      });

      const topUsers = Object.entries(messageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const medals = ["🥇", "🥈", "🥉", "✨", "🌙"];
      let userText = "";

      for (let i = 0; i < topUsers.length; i++) {
        const [uid, count] = topUsers[i];
        const userInfo = await api.getUserInfo(uid);
        const name = userInfo[uid]?.name || "Unknown";

        if (designToggle === 0) {
          userText += `✦ ${medals[i]} ${name}\n➥ 💬 ${count} Messages\n\n`;
        } else {
          userText += `┃ ${medals[i]} ${name}\n┃ 💬 ${count} Messages\n\n`;
        }
      }

      let finalMessage = "";

      if (designToggle === 0) {
        finalMessage = `╔═〔 👑 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧 〕═╗\n\n${userText}╚═〔 💎 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 〕═╝`;
        designToggle = 1;
      } else {
        finalMessage = `╭〔 👑 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧 〕╮\n\n${userText}╰〔 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 〕╯`;
        designToggle = 0;
      }

      return api.sendMessage(finalMessage, threadID);

    } catch (err) {
      console.log(err);
      return api.sendMessage(
        `╭〔 ❌ 𝗘𝗥𝗥𝗢𝗥 〕╮\n┃ ⚠️ 𝗔𝗰𝘁𝗶𝘃𝗲 𝗠𝗲𝗺𝗯𝗲𝗿 𝗟𝗼𝗮𝗱 𝗙𝗮𝗶𝗹𝗲𝗱\n╰━━━━━━━━━━━━╯`,
        threadID
      );
    }
  }
};
