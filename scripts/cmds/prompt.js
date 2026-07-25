const axios = require("axios");

const configUrl = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  config: {
    name: "prompt",
    aliases: ["p"],
    version: "0.0.1",
    role: 0,
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    category: "AI",
    cooldowns: 5,
    guide: { en: "Reply to an image to generate Midjourney prompt" }
  },

  onStart: async ({ api, event }) => {
    const { threadID, messageID, messageReply } = event;

    let baseApi;
    try {
      const configRes = await axios.get(configUrl);
      baseApi = configRes.data && configRes.data.api;
      if (!baseApi) throw new Error("Configuration Error: Missing API in GitHub JSON.");
    } catch (error) {
      return api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ এপিআই কনফিগারেশন লোড করতে ব্যর্থ হয়েছে!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        threadID,
        messageID
      );
    }

    if (
      !messageReply ||
      !messageReply.attachments ||
      messageReply.attachments.length === 0 ||
      !messageReply.attachments[0].url
    ) {
      return api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗨𝗦𝗔𝗚𝗘\n» 🖼️ যেকোনো একটি ছবির ওপর\n» 📌 রিপ্লাই দিয়ে কমান্ডটি ব্যবহার করুন!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        threadID,
        messageID
      );
    }

    try {
      api.setMessageReaction("⏰", messageID, () => {}, true);

      const imageUrl = messageReply.attachments[0].url;
      const apiUrl = `${baseApi}/promptv2`;

      const apiResponse = await axios.get(apiUrl, {
        params: { imageUrl }
      });

      const result = apiResponse.data;

      if (!result.success) {
        throw new Error(result.message || "Prompt API failed.");
      }

      const promptText = result.prompt || "No prompt returned.";

      await api.sendMessage(
        {
          body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🎨 𝗜𝗠𝗔𝗚𝗘 𝗣𝗥𝗢𝗠𝗣𝗧\n» 📝 ${promptText}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        },
        threadID,
        messageID
      );

      api.setMessageReaction("✅", messageID, () => {}, true);
    } catch (e) {
      api.setMessageReaction("❌", messageID, () => {}, true);

      let msg = "প্রম্পট জেনারেট করতে সমস্যা হয়েছে।";
      if (e.response?.data?.error) msg = e.response.data.error;
      else if (e.message) msg = e.message;

      api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ ${msg}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID,
        messageID
      );
    }
  }
};
