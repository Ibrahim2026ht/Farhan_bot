 function toBoldStyle(text) {
  if (!text) return "";
  const normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const boldChars   = "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗";
  
  return text.toString().split("").map(char => {
    const index = normalChars.indexOf(char);
    return index !== -1 ? boldChars.substring(index * 2, (index * 2) + 2) : char;
  }).join("");
}

module.exports = {
  config: {
    name: "autoreact",
    version: "𝟏.𝟎",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", // 🔒 LOCKED AUTHOR
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: "",
    category: "𝐝𝐨𝐧𝐭 𝐤𝐧𝐨𝐰",
  },
  
  onStart: async function (){},
  
  onChat: async function ({ event, api }) {

    if (module.exports.config.author !== "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") return;

    
    let bodyText = event.body.toLowerCase();
    const boldChars   = "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗";
    const normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    let decodedText = "";
    for (let i = 0; i < bodyText.length; i++) {
      let charPair = bodyText.substr(i, 2);
      let boldIndex = boldChars.indexOf(charPair);
      if (boldIndex !== -1 && boldIndex % 2 === 0) {
        decodedText += normalChars[boldIndex / 2];
        i++;
      } else {
        decodedText += bodyText[i];
      }
    }
    
    const hasWord = (word) => decodedText.indexOf(word) !== -1 || bodyText.indexOf(word) !== -1;

    if (hasWord("iloveyou")) return api.setMessageReaction("😙", event.messageID, event.threadID);
    if (hasWord("good night")) return api.setMessageReaction("💗", event.messageID, event.threadID);
    if (hasWord("good morning")) return api.setMessageReaction("💗", event.messageID, event.threadID);
    if (hasWord("pakyo")) return api.setMessageReaction("😠", event.messageID, event.threadID);
    if (hasWord("mahal")) return api.setMessageReaction("💗", event.messageID, event.threadID);
    if (hasWord("mwa")) return api.setMessageReaction("💗", event.messageID, event.threadID);
    if (hasWord("😢")) return api.setMessageReaction("😢", event.messageID, event.threadID);
    if (hasWord("😆")) return api.setMessageReaction("😆", event.messageID, event.threadID);
    if (hasWord("😂")) return api.setMessageReaction("😆", event.messageID, event.threadID);
    if (hasWord("🤣")) return api.setMessageReaction("😆", event.messageID, event.threadID);
    if (hasWord("tangina")) return api.setMessageReaction("😡", event.messageID, event.threadID);
    if (hasWord("good afternoon")) return api.setMessageReaction("❤", event.messageID, event.threadID);
    if (hasWord("good evening")) return api.setMessageReaction("❤", event.messageID, event.threadID);
    if (hasWord("gago")) return api.setMessageReaction("😡", event.messageID, event.threadID);
    if (hasWord("bastos")) return api.setMessageReaction("😳", event.messageID, event.threadID);
    if (hasWord("bas2s")) return api.setMessageReaction("😳", event.messageID, event.threadID);
    if (hasWord("bastog")) return api.setMessageReaction("😳", event.messageID, event.threadID);
    if (hasWord("hi")) return api.setMessageReaction("💗", event.messageID, event.threadID);
    if (hasWord("hello")) return api.setMessageReaction("💗", event.messageID, event.threadID);
    if (hasWord("zope")) return api.setMessageReaction("⏳", event.messageID, event.threadID);
    if (hasWord("pangit")) return api.setMessageReaction("😠", event.messageID, event.threadID);
    if (hasWord("redroom")) return api.setMessageReaction("😏", event.messageID, event.threadID);
    if (hasWord("😏")) return api.setMessageReaction("😏", event.messageID, event.threadID);
    if (hasWord("pakyu")) return api.setMessageReaction("🤬", event.messageID, event.threadID);
    if (hasWord("fuck you")) return api.setMessageReaction("🤬", event.messageID, event.threadID);
    if (hasWord("bata")) return api.setMessageReaction("👧", event.messageID, event.threadID);
    if (hasWord("kid")) return api.setMessageReaction("👧", event.messageID, event.threadID);
    if (hasWord("i hate you")) return api.setMessageReaction("😞", event.messageID, event.threadID);
    if (hasWord("useless")) return api.setMessageReaction("😓", event.messageID, event.threadID);
    if (hasWord("omg")) return api.setMessageReaction("😮", event.messageID, event.threadID);
    if (hasWord("shoti")) return api.setMessageReaction("😏", event.messageID, event.threadID);
    if (hasWord("pogi")) return api.setMessageReaction("😎", event.messageID, event.threadID);
    if (hasWord("ganda")) return api.setMessageReaction("💗", event.messageID, event.threadID);
    if (hasWord("i miss you")) return api.setMessageReaction("💗", event.messageID, event.threadID);
    if (hasWord("sad")) return api.setMessageReaction("😔", event.messageID, event.threadID);
  }
};
