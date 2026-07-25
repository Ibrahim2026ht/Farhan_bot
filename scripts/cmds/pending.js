const axios = require("axios");
const fs = require("fs");

const getStreamFromURL = global.utils.getStreamFromURL;

// ✅ Image list for random selection
const imageList = [
  "https://i.imgur.com/3fBvpps.jpeg",
  "https://i.imgur.com/586Aq55.jpeg"
];

// Function to pick a random image stream
const getRandomImage = async () => {
  const randomUrl = imageList[Math.floor(Math.random() * imageList.length)];
  return await getStreamFromURL(randomUrl);
};

module.exports = {
  config: {
    name: "pending",
    aliases: ["pen", "pend", "pe"],
    version: "2.0.4",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 1,
    shortDescription: "Handle pending requests",
    longDescription: "Approve or reject pending user or group requests",
    category: "utility",
    guide: {
      en: "{pn} [user/thread/all]\nReply with group number(s) to approve\nType 'c' to cancel"
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { author, pending, messageID } = Reply;
    if (String(event.senderID) !== String(author)) return;

    const { body, threadID } = event;

    // Cancel operation
    if (body.trim().toLowerCase() === "c") {
      try {
        await api.unsendMessage(messageID);
        return api.sendMessage(
          "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗖𝗔𝗡𝗖𝗘𝗟𝗟𝗘𝗗\n» ❌ অপারেশনটি বাতিল করা হয়েছে!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
          threadID
        );
      } catch {
        return;
      }
    }

    const indexes = body.split(/\s+/)
      .map(s => Number(s.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= pending.length);

    if (indexes.length === 0) {
      return api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗\n» ❌ সঠিক সংখ্যা নির্বাচন করুন!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        threadID
      );
    }

    let count = 0;
    for (const idx of indexes.sort((a, b) => a - b)) {
      const group = pending[idx - 1];

      try {
        // Fetch random image for the approved thread welcome message
        const welcomeMedia = await getRandomImage();

        await api.sendMessage(
          {
            body: `「 𝐆𝐫𝐨𝐮𝐩 𝐀𝐩𝐩𝐫𝐨𝐯𝐞𝐝 」\n[🤖] 𝐆𝐥𝐨𝐛𝐚𝐥 𝐏𝐫𝐞𝐟𝐢𝐱: {${global.GoatBot.config.prefix}}\n______________[🤖]______________\n\n⎯͢⎯⃝🩷🐰 *গা্ঁই্ঁস্ঁ* *মু্ঁই্ঁ* *পি্ঁচ্ছি্ঁ* *সি্ঁয়া্ঁম্ঁ* *এ্ঁরৃঁ* *বৃঁটৃঁ* *আ্ঁই্ঁয়া্ঁ* *পৃঁরৃঁছি্ঁ* *মো্ঁরে্ঁ* *কি্ঁ* *দে্ঁহা্ঁ* *যা্ঁয়্ঁ* ⎯͢⎯⃝🩷🐰\n______________[🤖]______________`,
            attachment: welcomeMedia
          },
          group.threadID
        );

        const botNickname = global.GoatBot?.config?.nickNameBot || "[ , ] 𝘽𝙤𝙩 - 𝐀𝐩𝐡𝐞𝐥𝐢𝐨𝐧🌊🪶";
        
        await api.changeNickname(
          botNickname,
          group.threadID,
          api.getCurrentUserID()
        );
        
        count++;
      } catch (err) {
        console.error(`Failed to approve thread ${group.threadID}:`, err.message);
      }
    }

    for (const idx of indexes.sort((a, b) => b - a)) {
      pending.splice(idx - 1, 1);
    }

    await api.unsendMessage(messageID);
    return api.sendMessage(
      `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦\n» 🎉 সফলভাবে ${count} টি গ্রুপ/ইউজার এপ্রুভ করা হয়েছে!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, 
      threadID
    );
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID } = event;
    const adminBot = global.GoatBot?.config?.adminBot;

    if (!Array.isArray(adminBot) || !adminBot.includes(senderID)) {
      return api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡 𝗗𝗘𝗡𝗜𝗘𝗗\n» ⛔ আপনার এই কমান্ড ব্যবহার করার অনুমতি নেই!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        threadID
      );
    }

    const type = args[0]?.toLowerCase();
    if (!type || !["user", "thread", "all"].includes(type)) {
      return api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗨𝗦𝗔𝗚𝗘\n» 📌 ব্যবহারবিধি: pending [user/thread/all]\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        threadID
      );
    }

    try {
      const spam = (await api.getThreadList(100, null, ["OTHER"])) || [];
      const pending = (await api.getThreadList(100, null, ["PENDING"])) || [];
      const list = [...spam, ...pending];
      let filteredList = [];

      if (type.startsWith("u")) filteredList = list.filter((t) => !t.isGroup);
      else if (type.startsWith("t")) filteredList = list.filter((t) => t.isGroup);
      else if (type === "all") filteredList = list;

      if (filteredList.length === 0) {
        return api.sendMessage(
          "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📑 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 𝗟𝗜𝗦𝗧\n» ✅ কোনো পেন্ডিং রিকোয়েস্ট পাওয়া যায়নি!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
          threadID
        );
      }

      let msg = "";
      let index = 1;

      for (const single of filteredList) {
        const name = single.isGroup ? single.name : (await usersData.getName(single.threadID)) || "Unknown";
        msg += `» [ ${index} ] ${name} (${single.threadID})\n`; 
        index++;
      }

      const finalMessage = 
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📑 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 ${type.toUpperCase()} 𝗟𝗜𝗦𝗧\n\n${msg}\n───────────────\n» 📌 এপ্রুভ করতে নম্বর লিখে রিপ্লাই দিন!\n» ❌ বাতিল করতে "c" লিখে রিপ্লাই দিন।\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      const randomMedia = await getRandomImage();

      return api.sendMessage(
        {
          body: finalMessage,
          attachment: randomMedia
        },
        threadID,
        (error, info) => {
          if (error) return console.error(error);
          
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            messageID: info.messageID,
            author: senderID,
            pending: filteredList
          });
        },
        messageID
      );
    } catch (error) {
      console.error("Pending fetch error:", error);
      return api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ পেন্ডিং লিস্ট আনতে সমস্যা হয়েছে!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        threadID
      );
    }
  }
};
