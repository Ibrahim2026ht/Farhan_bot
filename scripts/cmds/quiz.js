const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

/**
* @author 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
* @author: do not delete it
*/

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "1.7",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 10,
    role: 0,
    category: "game",
    guide: {
      en: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📌 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘\n» 𝗧𝘆𝗽𝗲 {pn} 𝗳𝗼𝗿 𝗯𝗮𝗻𝗴𝗹𝗮 𝗾𝘂𝗶𝘇\n» 𝗧𝘆𝗽𝗲 {pn} en 𝗳𝗼𝗿 𝗲𝗻𝗴𝗹𝗶𝘀𝗵 𝗾𝘂𝗶𝘇\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
    }
  },

  onStart: async function ({ api, event, usersData, args }) {
    try {
      const input = args.join("").toLowerCase() || "bn";
      const category = input === "en" || input === "english" ? "english" : "bangla";

      const apiUrl = await mahmud();
      const res = await axios.get(`${apiUrl}/api/quiz?category=${category}`);
      const quiz = res.data;

      if (!quiz) {
        return api.sendMessage("» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ 𝗘𝗥𝗥𝗢𝗥\n» 𝗡𝗼 𝗤𝘂𝗶𝘇 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗙𝗼𝗿 𝗧𝗵𝗶𝘀 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧", event.threadID, event.messageID);
      }

      const { question, correctAnswer, options } = quiz;
      const { a, b, c, d } = options;
      const quizMsg = {
        body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📌 𝗤𝗨𝗜𝗭\n» ${question}\n» 𝗔) ${a}\n» 𝗕) ${b}\n» 𝗖) ${c}\n» 𝗗) ${d}\n» 💬 𝗥𝗲𝗽𝗹𝘆 𝗪𝗶𝘁𝗵 𝗬𝗼𝘂𝗿 𝗔𝗻𝘀𝘄𝗲𝗿\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      };

      api.sendMessage(quizMsg, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "reply",
          commandName: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
          correctAnswer
        });

        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 40000);
      }, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ 𝗘𝗥𝗥𝗢𝗥\n» 𝗘𝗿𝗿𝗼𝗿, 𝗖𝗼𝗻𝘁𝗮𝗰𝘁 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧", event.threadID, event.messageID);
    }
  },

  onReply: async function ({ event, api, Reply, usersData }) {
    const { correctAnswer, author } = Reply;
    if (event.senderID !== author) return api.sendMessage("» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n» 𝗧𝗵𝗶𝘀 𝗜𝘀 𝗡𝗼𝘁 𝗬𝗼𝘂𝗿 𝗤𝘂𝗶𝘇 𝗕𝗮𝗯𝘆 >🐸\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧", event.threadID, event.messageID);

    await api.unsendMessage(Reply.messageID);
    const userReply = event.body.trim().toLowerCase();

    if (userReply === correctAnswer.toLowerCase()) {
      const rewardCoins = 500;
      const rewardExp = 121;
      const userData = await usersData.get(author);
      await usersData.set(author, {
        money: userData.money + rewardCoins,
        exp: userData.exp + rewardExp,
        data: userData.data
      });
      api.sendMessage(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦\n» 🎉 𝗖𝗼𝗿𝗿𝗲𝗰𝘁 𝗔𝗻𝘀𝘄𝗲𝗿 𝗕𝗮𝗯𝘆\n» 💰 𝗬𝗼𝘂 𝗘𝗮𝗿𝗻𝗲𝗱 ${rewardCoins}\n» 🧘 𝗖𝗼𝗶𝗻𝘀 & ${rewardExp} 𝗘𝘅𝗽\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, event.threadID, event.messageID);
    } else {
      api.sendMessage(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ 𝗘𝗥𝗥𝗢𝗥\n» 🏆 𝗪𝗿𝗼𝗻𝗴 𝗔𝗻𝘀𝘄𝗲𝗿 𝗕𝗮𝗯𝘆\n» 🎄 𝗧𝗵𝗲 𝗖𝗼𝗿𝗿𝗲𝗰𝘁 𝗔𝗻𝘀𝘄𝗲𝗿:\n» 👉 ${correctAnswer}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, event.threadID, event.messageID);
    }
  }
};
