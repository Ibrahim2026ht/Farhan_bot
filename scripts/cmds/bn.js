const axios = require("axios");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"; // 🔒 locked author

/**
 * 🌐 গুগল ট্রান্সলেটর ফাংশন (বাংলা ও অফিশিয়াল ইংরেজির জন্য)
 */
async function translateText(text, targetLang) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      timeout: 10000
    });

    let translated = "";
    if (response.data && response.data[0]) {
      response.data[0].forEach(item => {
        if (item[0]) translated += item[0];
      });
    }
    return translated;
  } catch (error) {
    return null;
  }
}

/**
 * 🧹 বটের আগের হেডার, ফুটার ও নোটিফিকেশন পুরোপুরি বাদ দেওয়ার কাস্টম ফাংশন
 */
function cleanInputText(rawText) {
  if (!rawText) return "";

  const lines = rawText.split("\n");
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim();
    if (
      trimmed.includes("OWNER") ||
      trimmed.includes("মালিক") ||
      trimmed.includes("👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") ||
      trimmed.includes("সিয়াম-হাসান") ||
      trimmed.includes("🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧🧚‍♀️") ||
      trimmed.includes("নিঝুম চ্যাটবট") ||
      trimmed.includes("────────────────") ||
      trimmed.includes("───────────────") ||
      trimmed.includes("TRANSLATOR GUIDE") ||
      trimmed.includes("ইনস্টল করা হয়েছে") ||
      trimmed.includes("কমান্ড সফলভাবে") ||
      trimmed.startsWith("»") ||
      trimmed.startsWith("✅")
    ) {
      return false;
    }
    return true;
  });

  const cleanText = filteredLines.join(" ").trim();
  return cleanText || rawText;
}

/**
 * 🔤 বাংলা লেখা ➔ বাংলা উচ্চারণে ইংরেজি অক্ষর (Banglish)
 */
function convertToBanglish(text) {
  if (!text) return "";

  // কমন ব্যবহৃত শব্দের সঠিক উচ্চারণ ডিকশনারি
  const wordMap = {
    "আমি": "ami", "তুমি": "tumi", "আপনি": "apni", "সে": "se", "তারা": "tara",
    "কেমন": "kemon", "আছো": "acho", "আছেন": "achen", "ভালো": "valo", "ভালোবাসি": "valobashi",
    "কী": "ki", "কি": "ki", "করো": "koro", "করছেন": "korchen", "খাবো": "khabo",
    "যাবো": "jabo", "কোথায়": "kothay", "কোথায়": "kothay", "কেন": "keno", "কথা": "kotha", "আজ": "aj",
    "কাল": "kal", "সবাই": "sobai", "ধন্যবাদ": "dhonnobad", "শুভ": "shuvo", "সকাল": "sokal",
    "রাত": "rat", "বন্ধু": "bondhu", "তোমাকে": "tomake", "তোমারে": "tomare", "ছাড়া": "chara", "ছাড়াই": "charai",
    "বাঁচবো": "banchbo", "বাঁচমু": "banchmu", "না": "na", "হবে": "hobe", "পাখি": "pakhi", "সুখের": "sukher",
    "হাই": "hi", "কেমনে": "kemne"
  };

  let str = text;
  for (const [key, val] of Object.entries(wordMap)) {
    const reg = new RegExp(`\\b${key}\\b`, 'g');
    str = str.replace(reg, val);
  }

  // ইউনিকোড ফিল্টারিং
  str = str
    .replace(/\u09CD/g, '') // হসন্ত মুছে ফেলা
    .replace(/\u09BC/g, '') // নুকতা মুছে ফেলা
    .replace(/ক্ষ/g, 'kkho').replace(/জ্ঞ/g, 'ggo').replace(/ঙ্ক/g, 'nk').replace(/ঙ্গ/g, 'ng')
    .replace(/চ্ছ/g, 'cch').replace(/জ্জ/g, 'jj').replace(/ড়/g, 'r').replace(/ঢ়/g, 'rh')
    .replace(/য়/g, 'y').replace(/ৎ/g, 't');

  const charMap = {
    'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
    'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng', 'চ': 'ch', 'ছ': 'ch', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
    'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n', 'ত': 't', 'থ': 'th', 'দ': 'd', 'ध': 'dh', 'ন': 'n',
    'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'v', 'ম': 'm', 'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh',
    'স': 's', 'হ': 'h', 'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
    'ং': 'ng', 'ঃ': 'h', 'ঁ': 'n'
  };

  let result = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    result += charMap[char] !== undefined ? charMap[char] : char;
  }

  return result;
}

module.exports = {
  config: {
    name: "bn",
    aliases: ["tr", "translate"],
    version: "8.0",
    author: AUTHOR,
    role: 0,
    category: "utility",
    guide: "মেসেজে Reply দিয়ে: bn e (ইংরেজি অক্ষরের বাংলা) / bn b (বাংলা ভাষা) / bn en (অফিশিয়াল ইংরেজি)",
    countDown: 2
  },

  onStart: async function ({ api, event, args }) {
    try {
      // 🔒 AUTHOR LOCK SYSTEM
      if (module.exports.config.author !== AUTHOR) {
        return api.sendMessage("⛔ File modification detected! Author is locked.", event.threadID, event.messageID);
      }

      const commandType = args[0] ? args[0].toLowerCase().trim() : "";

      // 📖 গাইডলাইন
      if (!commandType || event.type !== "message_reply") {
        const guideMsg = `»👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
───────────────
🌐 TRANSLATOR GUIDE 🌐
───────────────
📌 ব্যবহারের নিয়মাবলী:

১️⃣ বাংলা ➔ ইংরেজি অক্ষরে বাংলা (Banglish):
• যেকোনো বাংলা মেসেজে Reply দিয়ে লিখুন: bn e

২️⃣ যেকোনো ভাষা ➔ বাংলা ভাষা:
• যেকোনো মেসেজে Reply দিয়ে লিখুন: bn b

৩️⃣ যেকোনো ভাষা ➔ অফিশিয়াল ইংরেজি ভাষা:
• যেকোনো মেসেজে Reply দিয়ে লিখুন: bn en
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧🧚‍♀️`;

        return api.sendMessage(guideMsg, event.threadID, event.messageID);
      }

      const rawText = event.messageReply?.body;
      if (!rawText) {
        return api.sendMessage("❌ আপনি যে মেসেজে রিপ্লাই দিয়েছেন তাতে কোনো লেখা পাওয়া যায়নি!", event.threadID, event.messageID);
      }

      // 🧼 মূল টেক্সট ফিল্টার
      const textToTranslate = cleanInputText(rawText);

      let resultText = "";

      // 🔄 মোড সিলেকশন
      if (commandType === "e" || commandType === "eb" || commandType === "banglish") {
        // ১. বাংলা ➔ ইংরেজি অক্ষরে বাংলা (Banglish)
        resultText = convertToBanglish(textToTranslate);
      } else if (commandType === "b" || commandType === "bangla") {
        // ২. যেকোনো ভাষা ➔ বাংলা ভাষা
        resultText = await translateText(textToTranslate, "bn");
      } else if (commandType === "en" || commandType === "english") {
        // ৩. যেকোনো ভাষা ➔ অফিশিয়াল ইংরেজি
        resultText = await translateText(textToTranslate, "en");
      } else {
        return api.sendMessage("❌ ভুল কমান্ড! ব্যবহার করুন: bn e (বাংলিশ), bn b (বাংলা), অথবা bn en (ইংরেজি)।", event.threadID, event.messageID);
      }

      if (!resultText) {
        return api.sendMessage("❌ প্রসেস করতে সমস্যা হয়েছে, দয়া করে আবার চেষ্টা করুন!", event.threadID, event.messageID);
      }

      // 🎯 ফাইনাল আউটপুট
      const replyMsg = `» 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 
───────────────
${resultText}
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧🧚‍♀️`;

      return api.sendMessage(replyMsg, event.threadID, event.messageID);

    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ ইন্টারনাল এরর! প্রসেস করা সম্ভব হয়নি।", event.threadID, event.messageID);
    }
  }
};
