module.exports = {
  config: {
    name: "number",
    version: "1.2.0",
    author: "SIYAM-HASAN",
    countDown: 2,
    role: 0,
    shortDescription: {
      en: "Fake girls number list simulator"
    },
    description: {
      en: "Provides dynamic responses based on words or full command execution"
    },
    category: "Fun",
    guide: {
      en: "{p}number"
    }
  },

  onChat: async function ({ message, event }) {
    if (!event.body) return;
    const msg = event.body.toLowerCase();
    
    const keywords = ["নাম্বার দাও", "নাম্বার দেও", "নাম্বার", "নাম্বার দে", "নাম্বার আছে", "আছে নাম্বার"];
    
    if (keywords.some(keyword => msg === keyword || msg.includes(keyword))) {
      const shortMessage = 
        `👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n` +
        `───────────────────────\n` +
        `» 🫣 আপনি যদি ফুল নাম্বার লিস্ট 
         » 🙂দেখতে চান তাহলে কমান্ড করুন 
         » 🙈 number\n` +
        `───────────────────────\n` +
        `» 🧚 ─꯭─⃝‌‌🧚𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁─⃝‌‌🧚`;

      return message.reply(shortMessage);
    }
  },
  
  onStart: async function ({ message }) {
    const fullListMessage = 
      `👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n` +
      `───────────────────────\n` +
      `🪄 𝗥𝗢𝗬𝗔𝗟 𝗡𝗨𝗠𝗕𝗘𝗥 𝗟𝗜𝗦𝗧 🎩\n` +
      `───────────────────────\n` +
      `1 » 🌸 প্রিয়া - 01712345678\n` +
      `2 » 🥀 নিঝুম - 01911234567\n` +
      `3 » 🎀 মিম - 01812345678\n` +
      `4 » 💫 তানিশা - 01623456789\n` +
      `5 » 💖 আনিকা - 01511223344\n` +
      `6 » 🌸 সাদিয়া - 01799887766\n` +
      `7 » 🥀 ফারিহা - 01988776655\n` +
      `8 » 🎀 নুসরাত - 01877665544\n` +
      `9 » 💫 রাইসা - 01666554433\n` +
      `10» 💖 ইশিতা - 01555443322\n` +
      `11 » 🌸 আচল - 01744332211\n` +
      `12 » 🥀 মেহজাবিন - 01933221100\n` +
      `13 » 🎀 সুমাইয়া - 01822110099\n` +
      `14 » 💫 তিশা - 01611009988\n` +
      `15 » 💖 রিয়া - 01500998877\n` +
      `16 » 🌸 সায়মা - 01711223344\n` +
      `17 » 🥀 লিজা - 01922334455\n` +
      `18 » 🎀 জান্নাত - 01833445566\n` +
      `19 » 💫 কবিতা - 01644556677\n` +
      `20 » 💖 আয়েশা - 01555667788\n\n` +
      `» 🫣 তোরা প্রেম কর🐸
       » 🌝 ছ্যাকা খাইলে ডাক দিস😹 
বিড়ির   » 🙈 দোকান দিমু☺️\n` +
      `───────────────────────\n` +
      `» 🪄 ─꯭─⃝‌‌🧚𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁─⃝‌‌🧚`;

    return message.reply(fullListMessage);
  }
};
