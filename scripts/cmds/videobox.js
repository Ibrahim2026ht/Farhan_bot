const axios = require("axios");

module.exports = {
  config: {
    name: "videobox",
    version: "2.6.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    premium: false,
    description: "Video box management and protection system",
    category: "box-protection",
    guide: {
      en: ""
    }
  },

  onChat: async function ({ api, event }) {
    const targetGroupID = "1018073844423801";
    
    if (String(event.threadID) !== targetGroupID) return;
    if (String(event.senderID) === String(api.getCurrentUserID())) return;

    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const adminIDs = threadInfo.adminIDs.map(admin => String(admin.id));
      const senderID = String(event.senderID);

      if (adminIDs.includes(senderID)) return;

      const botID = String(api.getCurrentUserID());
      const isBotAdmin = adminIDs.includes(botID);

      const hasVideo = event.attachments && event.attachments.some(att => att.type === "video");
      const hasVoice = event.attachments && event.attachments.some(att => att.type === "audio" || att.type === "voice");

      if (hasVideo || hasVoice) {
        if (api.setMessageReaction) {
          const reacts = [
            "😀","😃","😄","😁","😆","😅","😂","🤣","🥲","🥹","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","😢","😭","😮‍💨","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🫣","🤗","🫡","🤔","🤫","🫠","🤥","😶","🫥","😐","😑","😬","🫨","😮","😯","😲","🥱","😴","🤤","😪","😵","😵‍💫","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿","👹","👺","🤡","💩","👻","💀","☠️","👽","👾","🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿","😾",
            "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🪯","🕉️","☸️","✡️","🔯","🕎","☯️","☦️","🛐","⛎","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","🆔","⚛️","✴️","☣️","☢️","💮","🉐","㊙️","㊗️","🈴","🈵","🈹","🈲","🅰️","🅱️","🆎","🆏","🆑","🅾️","🆘","❌","⭕","🛑","⛔","📛","🚫","💯","💢","♨️","🚷","🚯","🚳","🚱","🔞","📵","🚭",
            "👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🫀","🫁","🦷","🦴","👀","👁️","👅","👄","💋","🩸","👑","🎩","🎓","🧢","🪖","⛑️","📿","💄","💍","💎",
            "🎬","🎤","🎧","🎼","🎵","🎶","🎙️","🎚️","🎛️","🎞️","🎟️","🎫","🎭","🩰","🎨","📹","📸","📺","📻","📽️","🎸","🎹","🎺","🎻","🪕","🥁","🪘","🔮","🧿","🪬","🪄","🔔","🔕","💥","🔥","✨","🌟","⭐","💫","⚡","☄️","🌪️","🌈","☀️","🌤️","⛅","🌥️","☁️","🌦️","🌧️","⛈️","🌩️","🌨️","❄️","☃️","⛄","🌬️","💨","💧","💦","🫧","☔","☂️","🌊","🌫️",
            "🎮","🕹️","🎲","🧩","🍼","♟️","🎳","🎯","🎰","🏆","🥇","🥈","🥉","🏅","🎖️","⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🏓","🏸","🏒","🏑","🥍","🏏","🪃","🥅","⛳","🪁","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","🥌","🎿","⛷️","🏂","🪂",
            "🐵","🐒","🦍","🦧","🐶","🐕","🦮","🐕‍🦺","🐩","🐺","🦊","🦝","🐱","🦁","🐯","🐅","🐆","🐴","🫏","🦓","🦌","🦬","🐮","🐂","🐃","🐄","🐷","🐖","🐗","💮","🏵️","🌹","🥀","🌺","🌻","🌼","🌷","🌱","🪴","🌲","🌳","🌴","🌵","🌶️","🍄","🌰","🦀","🦞","🦐","🦑","🐙","🪼","🐟","🐠","🐡","🦈","🐬","🐳","🐋","🐊","🐪","🐫","🦙","🦒","🐘","🦣","🦏","🦛","🐭","🐁","🐀","🐹","🐰","🐇","🐿️","🦫","🦔","🦇","🐻","🐨","🐼","🦥","🦦","🦨","🦘","🦡","🦅","🦆","🐦","🐧","🕊️","🦉","🦤","🦩","🦚","Parrot"
          ];
          const randomReact = reacts[Math.floor(Math.random() * reacts.length)];
          await api.setMessageReaction(randomReact, event.messageID, () => {}, true);
        }
        return;
      }

      if (!isBotAdmin) return;

      if (!global.videoBoxWarns) {
        global.videoBoxWarns = {};
      }

      if (!global.videoBoxWarns[senderID]) {
        global.videoBoxWarns[senderID] = 1;

        const userInfo = await api.getUserInfo(senderID);
        const name = userInfo[senderID]?.name || "User";

        function toBold(text) {
          const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          const bold = "𝗔𝗕𝗖𝗗Ｅcontent𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧🇺𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";
          return text.split('').map(char => {
            const index = alphabet.indexOf(char);
            return index !== -1 ? bold.slice(index * 2, (index + 1) * 2) : char;
          }).join('');
        }

        const warningBody = 
`📢 『░⃟̎̎̎̎̐𝄞𝐅𝐑𝐈𝐄𝐍𝐃𝐒' 𝄟≛⃝𝐕𝐈𝐃𝐄𝐎≛⃝𝄟𝐁𝐎𝐗░⃟̎̎̎̎̐』\n\n` +
`🕌 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔 𝐀𝐋𝐀𝐈𝐊𝐔𝐌 🤲\n\n` +
`🚫 @Everyone ⚠️\n` +
`📢 এটি একটি 𝐕𝐈𝐃𝐄𝐎 𝐁𝐎𝐗।\n` +
`⛔ এখানে কোনো প্রকার Sticker, Emoji বা Text করা সম্পূর্ণ নিষিদ্ধ।\n` +
`❌ একবারও স্টিকার, ইমোজি বা টেক্সট করলে সাথে সাথেই Kick/Remove করা হবে।\n` +
`🎥 এখানে শুধুমাত্র ভিডিও পোস্ট করবেন।\n` +
`🤝 সবাই নিয়ম মেনে চলুন এবং সুন্দর পরিবেশ বজায় রাখুন।\n` +
`💖 ধন্যবাদ।\n` +
`━━━━━━━━━━━━━━━━━━\n` +
`${toBold("OWNER")} ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

        const finalMsg = {
          body: `───────────────\n\n» ⚠️ @${name} ${warningBody}\n\n───────────────\n» 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
          mentions: [{ tag: `@${name}`, id: senderID }]
        };

        if (api.unsendMessage && event.messageID) {
          try { await api.unsendMessage(event.messageID); } catch(e){}
        }

        return api.sendMessage(finalMsg, event.threadID);

      } else if (global.videoBoxWarns[senderID] === 1) {
        delete global.videoBoxWarns[senderID];

        if (api.unsendMessage && event.messageID) {
          try { await api.unsendMessage(event.messageID); } catch(e){}
        }

        return api.removeUserFromGroup(senderID, event.threadID);
      }

    } catch (error) {
      console.error(error);
    }
  }
};
