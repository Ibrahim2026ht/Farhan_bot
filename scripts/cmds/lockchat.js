module.exports = {
  config: {
    name: "lockchat",
    aliases: ["lock"],
    version: "1.0.0",
    author: "𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍",
    countDown: 3,
    role: 1,
    description: {
      en: "Lock the group chat"
    },
    category: "box chat",
    guide: {
      en: "{p}lockchat"
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      // Check current thread information
      const threadInfo = await api.getThreadInfo(event.threadID);

      if (!threadInfo.isGroup) {
        return message.reply(
          "❌ এই কমান্ড শুধু Group Chat-এ ব্যবহার করা যাবে।"
        );
      }

      // Try to lock the Messenger group
      if (typeof api.changeThreadSettings === "function") {

        await api.changeThreadSettings(
          {
            threadID: event.threadID,
            setting: "RECEIVE_MESSAGE",
            value: false
          }
        );

        return message.reply(
          "🔒 𝐆𝐑𝐎𝐔𝐏 𝐂𝐇𝐀𝐓 𝐋𝐎𝐂𝐊𝐄𝐃\n\n" +
          "👑 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍\n\n" +
          "⚠️ সাধারণ সদস্যরা এখন মেসেজ পাঠাতে পারবে না।"
        );
      }

      // Alternative API method
      if (typeof api.setThreadSettings === "function") {

        await api.setThreadSettings(
          event.threadID,
          {
            receiveMessage: false
          }
        );

        return message.reply(
          "🔒 𝐆𝐑𝐎𝐔𝐏 𝐂𝐇𝐀𝐓 𝐋𝐎𝐂𝐊𝐄𝐃\n\n" +
          "👑 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍"
        );
      }

      return message.reply(
        "❌ তোমার Bot API-তে Group Chat Lock করার method পাওয়া যায়নি।"
      );

    } catch (error) {

      console.error("LOCKCHAT ERROR:", error);

      return message.reply(
        "❌ Group Chat Lock করা যায়নি।\n\n" +
        "🔹 বটকে Group Admin করো।\n" +
        "🔹 তারপর আবার চেষ্টা করো।\n\n" +
        "Error: " + (error.message || "Unknown error")
      );
    }
  }
};
