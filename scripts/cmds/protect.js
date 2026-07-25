module.exports = {
  config: {
    name: "protect",
    version: "3.1",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 1,
    shortDescription: "Lock group name, nickname, theme, emoji with warning and anti-rename kick",
    category: "group",
    guide: "{pn} on/off"
  },

  onStart: async ({ api, event, message, threadsData, args }) => {
    const { threadID } = event;

    if (!args[0]) {
      return message.reply(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗨𝗦𝗔𝗚𝗘\n» 📌 /protect on\n» 📌 /protect off\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
      );
    }

    if (args[0] === "on") {
      const info = await api.getThreadInfo(threadID);

      const protectData = {
        enable: true,
        name: info.threadName || "",
        emoji: info.emoji || "",
        color: info.color || "",
        warning: {},
        nickname: {}
      };

      const members = info.members || [];
      members.forEach(u => {
        protectData.nickname[u.userID] = u.nickname || "";
      });

      await threadsData.set(threadID, protectData, "data.protect");

      return message.reply(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🛡️ 𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗘𝗡𝗔𝗕𝗟𝗘𝗗\n» ✨ 𝗡𝗮𝗺𝗲, 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲\n» 🎨 𝗧𝗵𝗲𝗺𝗲 & 𝗘𝗺𝗼𝗷𝗶\n» 🔒 𝗔𝗿𝗲 𝗡𝗼𝘄 𝗟𝗼𝗰𝗸𝗲𝗱!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
      );
    }

    if (args[0] === "off") {
      await threadsData.set(threadID, {}, "data.protect");
      return message.reply(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🔓 𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗\n» 💥 𝗚𝗿𝗼𝘂𝗽 𝗟𝗼𝗰𝗸𝘀\n» 🚫 𝗔𝗿𝗲 𝗡𝗼𝘄 𝗢𝗙𝗙!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
      );
    }
  },

  onEvent: async ({ api, event, threadsData, usersData }) => {
    const { threadID, author, logMessageType } = event;
    const protectData = await threadsData.get(threadID, "data.protect");
    if (!protectData?.enable) return;

    const info = await api.getThreadInfo(threadID);
    const isAdmin = info.adminIDs.some(e => e.id === author);
    const isBot = api.getCurrentUserID() === author;
    const botID = api.getCurrentUserID();
    const botIsAdmin = info.adminIDs.some(e => e.id === botID);

    if (!isAdmin && !isBot && author) {
      const userName = await usersData.getName(author) || "User";

      // NAME CHANGE PROTECTION & WARNING
      if (logMessageType === "log:thread-name") {
        api.setTitle(protectData.name, threadID);

        if (!protectData.warning) protectData.warning = {};

        if (!protectData.warning[author]) {
          protectData.warning[author] = true;
          await threadsData.set(threadID, protectData, "data.protect");

          try {
            await api.sendMessage({
              body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 👤 𝗨𝘀𝗲𝗿: ${userName}\n» ⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n» 🚫 এটি শেষ ওয়ার্নিং।\n» 📛 নাম বা ইমোজি চেঞ্জ করলে\n» 👢 গ্রুপ থেকে\n» 🚪 কিক দেওয়া হবে।\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
              mentions: [{ tag: userName, id: author }]
            }, threadID);
          } catch (err) {
            console.error("[Protect Warning Error]:", err);
          }
        } else {
          if (botIsAdmin) {
            try {
              await api.sendMessage({
                body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 👤 𝗨𝘀𝗲𝗿: ${userName}\n» 🤦‍♂️ গ্রুপের নাম বা ইমোজি পরিবর্তন করে\n» 😤 বেশি বালপাকনামি\n» 🐸 করার কারণে\n» 👞 সম্মানের সহিত\n» 🚪 গ্রুপ থেকে লাথি মেরে\n» 🙄 বের করে দেওয়া হলো!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
                mentions: [{ tag: userName, id: author }]
              }, threadID);
              await api.removeUserFromGroup(author, threadID);
            } catch (err) {
              console.error("[Protect Kick Error]:", err);
            }
          }
        }
      }

      // EMOJI CHANGE PROTECTION & WARNING
      if (logMessageType === "log:thread-icon") {
        if (protectData.emoji) {
          api.changeThreadEmoji(protectData.emoji, threadID);
        }

        if (!protectData.warning) protectData.warning = {};

        if (!protectData.warning[author]) {
          protectData.warning[author] = true;
          await threadsData.set(threadID, protectData, "data.protect");

          try {
            await api.sendMessage({
              body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 👤 𝗨𝘀𝗲𝗿: ${userName}\n» ⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n» 🚫 এটি শেষ ওয়ার্নিং।\n» 📛 নাম চেঞ্জ করলে\n» 👢 গ্রুপ থেকে\n» 🚪 কিক দেওয়া হবে।\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
              mentions: [{ tag: userName, id: author }]
            }, threadID);
          } catch (err) {
            console.error("[Protect Warning Error]:", err);
          }
        } else {
          if (botIsAdmin) {
            try {
              await api.sendMessage({
                body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 👤 𝗨𝘀𝗲𝗿: ${userName}\n» 🤦‍♂️ গ্রুপের নাম পরিবর্তন করে\n» 😤 বেশি বালপাকনামি\n» 🐸 করার কারণে\n» 👞 সম্মানের সহিত\n» 🚪 গ্রুপ থেকে লাথি মেরে\n» 🙄 বের করে দেওয়া হলো!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
                mentions: [{ tag: userName, id: author }]
              }, threadID);
              await api.removeUserFromGroup(author, threadID);
            } catch (err) {
              console.error("[Protect Kick Error]:", err);
            }
          }
        }
      }

      // COLOR & NICKNAME PROTECTION
      if (logMessageType === "log:thread-color") {
        api.changeThreadColor(protectData.color, threadID);
      }

      if (logMessageType === "log:user-nickname") {
        const { participant_id } = event.logMessageData;
        api.changeNickname(
          protectData.nickname[participant_id] || "",
          threadID,
          participant_id
        );
      }
    }

    // ADMIN UPDATES SAVED DATA
    if (isAdmin) {
      if (logMessageType === "log:thread-name") {
        await threadsData.set(threadID, event.logMessageData.name || "", "data.protect.name");
      }
      if (logMessageType === "log:thread-icon") {
        const newEmoji = event.logMessageData.thread_icon || info.emoji || "";
        await threadsData.set(threadID, newEmoji, "data.protect.emoji");
      }
      if (logMessageType === "log:thread-color") {
        await threadsData.set(threadID, event.logMessageData.theme_id || "", "data.protect.color");
      }
      if (logMessageType === "log:user-nickname") {
        const { participant_id, nickname } = event.logMessageData;
        await threadsData.set(
          threadID,
          nickname || "",
          `data.protect.nickname.${participant_id}`
        );
      }
    }
  }
};
