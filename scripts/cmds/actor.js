const OWNER_NAME = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"; // নাম পরিবর্তন করলে ফাইল নষ্ট হতে পারে⚠️
const ANTI_TAMPER = "𝆠፝";
const hiddenOwner = ANTI_TAMPER + OWNER_NAME;

if (hiddenOwner !== "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") { // নাম পরিবর্তন করলে ফাইল নষ্ট হতে পারে⚠️
  process.exit(0);
}

const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "actor",
    aliases: ["actorgame"],
    version: "2.0",
    author: hiddenOwner,
    countDown: 10,
    role: 0,
    category: "game",

    guide: {
      en: "{pn}"
    }
  },

  onReply: async function ({
    api,
    event,
    Reply,
    usersData
  }) {

    const { actorNames, author } = Reply;

    const getCoin = 500;
    const getExp = 121;

    if (event.senderID !== author) {
      return api.sendMessage(
        "❌ | This is not your question!",
        event.threadID,
        event.messageID
      );
    }

    const userData = await usersData.get(event.senderID);

    const reply = event.body.toLowerCase();

    try {
      await api.unsendMessage(Reply.messageID);
    } catch {}

    const isCorrect = actorNames.some(name =>
      reply.includes(name.toLowerCase())
    );

    if (isCorrect) {

      userData.money += getCoin;
      userData.exp += getExp;

      await usersData.set(
        event.senderID,
        userData
      );

      return api.sendMessage(
        `💲 | Correct Answer!\n💰 ${getCoin} coins earned\n✨ ${getExp} exp earned`,
        event.threadID,
        event.messageID
      );

    } else {

      return api.sendMessage(
        `❌ | Wrong Answer!\n🎭 Correct Actor: ${actorNames.join(", ")}`,
        event.threadID,
        event.messageID
      );

    }
  },

  onStart: async function ({
    api,
    event
  }) {

    try {

      const apiUrl = await baseApiUrl();

      const response = await axios.get(
        `${apiUrl}/api/actor`
      );

      const { name, imgurLink } = response.data.actor;

      const actorNames = Array.isArray(name)
        ? name
        : [name];

      const imageStream = await axios({
        url: imgurLink,
        method: "GET",
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      api.sendMessage(
        {
          body:
            "🎭 | Random Actor Appeared!\n\nReply with the actor name.",
          attachment: imageStream.data
        },

        event.threadID,

        (err, info) => {

          if (err) {
            return api.sendMessage(
              "❌ | Failed to send actor image.",
              event.threadID
            );
          }

          global.GoatBot.onReply.set(
            info.messageID,
            {
              commandName:
                module.exports.config.name,

              messageID: info.messageID,

              author: event.senderID,

              actorNames
            }
          );

          setTimeout(async () => {
            try {
              await api.unsendMessage(info.messageID);
            } catch {}
          }, 40000);
        },

        event.messageID
      );

    } catch (err) {

      console.error(
        "Actor Command Error:",
        err.message
      );

      return api.sendMessage(
        "❌ | API failed, contact admin.",
        event.threadID,
        event.messageID
      );
    }
  }
};
