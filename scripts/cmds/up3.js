module.exports = {
  config: {
    name: "up3",
    aliases: ["upt3"],
    version: "1.7",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "general",
    guide: {
      en: "Use {p}uptime to display bot's uptime and user stats."
    }
  },

  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const uptime = process.uptime();

      const days = Math.floor(uptime / (60 * 60 * 24));
      const hours = Math.floor((uptime % (60 * 60 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);

      const uptimeString = `${days}𝗗 ${hours}𝗛 ${minutes}𝗠`;

      const msg = 
`🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧👑
───────────────
» 🎀 𝗨𝗣𝗧𝗜𝗠𝗘 𝗦𝗧𝗔𝗧𝗦:
» 🐤 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeString}
» 👥 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀: ${allUsers.length.toLocaleString()}
» 💬 𝗧𝗼𝘁𝗮𝗹 𝗚𝗿𝗼𝘂𝗽𝘀: ${allThreads.length.toLocaleString()}
───────────────
» 👑𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍𝆠`;

      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(
        `───────────────\n» ❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱.\n───────────────\n» 👑𝆠፝𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍`,
        event.threadID,
        event.messageID
      );
    }
  }
};
