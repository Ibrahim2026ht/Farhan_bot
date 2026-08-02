const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");

const _0x4f1a = ['U0lZQU0tSEFTQU4=', 'from'];
const getAuthor = () => Buffer[_0x4f1a[1]](_0x4f1a[0], 'base64').toString('utf-8');

function toBoldSerif(text) {
  if (!text) return "";
  const normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const boldChars   = "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗";
  
  return text.split("").map(char => {
    const index = normalChars.indexOf(char);
    if (index !== -1) {
      return boldChars.substr(index * 2, 2);
    }
    return char;
  }).join("");
}

module.exports = {
  config: {
    name: "hack",
    version: "16.0.0",
    author: getAuthor(),
    countDown: 5,
    role: 0,
    shortDescription: "Advanced Cyber Penetration Testing Simulator (Scrolling Text Version)",
    longDescription: "Generates a highly convincing cyber penetration simulation with real-time dynamic GIF compilation.",
    category: "system",
    guide: {
      en: "{pn} @mention or reply"
    }
  },

  onStart: async function ({ event, message, usersData, api }) {
    const { type, messageReply, mentions, senderID } = event;
    
    let targetID = senderID;
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    }

    if (targetID == api.getCurrentUserID()) {
      return message.reply("❌ [-] 𝐄𝐫𝐫𝐨𝐫: 𝐋𝐨𝐜𝐚𝐥 𝐡𝐨𝐬𝐭 𝐧𝐞𝐭𝐰𝐨𝐫𝐤 𝐛𝐲𝐩𝐚𝐬𝐬 𝐝𝐞𝐧𝐢𝐞𝐝. নিজের আইডি হ্যাক করা সম্ভব না মামা!");
    }

    const cacheDir = path.join(__dirname, "cache");
    const gifPath = path.join(cacheDir, `cyber_breach_${targetID}.gif`);
    
    let procMessage;
    
    try {
      await fs.ensureDir(cacheDir);
      
      const targetData = await usersData.get(targetID) || {};
      const rawName = targetData.name || "Unknown User";
      const rawGender = targetData.gender === "female" ? "FEMALE" : "MALE";
      
      const userName = toBoldSerif(rawName);
      const userGender = toBoldSerif(rawGender);
      const formattedTargetID = toBoldSerif(targetID);

      let log1 = `📡 [𝐒𝐓𝐀𝐑𝐓] 𝐈𝐧𝐢𝐭𝐢𝐚𝐥𝐢𝐳𝐢𝐧𝐠 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍 𝐇𝐚𝐜𝐤𝐢𝐧𝐠 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤 𝟒.𝟎...\n`;
      log1 += `──────────────────\n`;
      log1 += `👤 𝐓𝐀𝐑𝐆𝐄𝐓: ${userName}\n`;
      log1 += `🆔 𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐃: ${formattedTargetID}\n`;
      log1 += `🔓 [𝐒𝐓𝐀𝐓𝐔𝐒] ক্রাশের চ্যাট হিস্ট্রি এবং ইনবক্সের সিকিউরিটি বাইপাস রিকোয়েস্ট সেন্ড করা হচ্ছে...`;
      
      procMessage = await message.reply(log1);
      
      setTimeout(async () => {
        let log2 = `🔓 [𝐁𝐑𝐄𝐀𝐂𝐇] 𝐃e𝐯𝐢𝐜𝐞 𝐠𝐚𝐥𝐥𝐞𝐫𝐲 𝐚𝐧𝐝 𝐦𝐞𝐬𝐬𝐞𝐧𝐠𝐞𝐫 𝐝𝐢𝐫𝐞𝐜𝐭𝐨𝐫𝐲 𝐚𝐜𝐜𝐞𝐬𝐬 𝐆𝐑𝐀𝐍𝐓𝐄𝐃!\n`;
        log2 += `──────────────────\n`;
        log2 += `📂 𝐃𝐈𝐑𝐄𝐂𝐓𝐎𝐑𝐘: /𝐢𝐧𝐭𝐞𝐫𝐧𝐚𝐥_𝐬𝐭𝐨𝐫𝐚𝐠𝐞/𝐃𝐂𝐈𝐌/𝐒𝐞𝐜𝐫𝐞𝐭_𝐅𝐨𝐥𝐝𝐞𝐫/\n`;
        log2 += `🔑 𝐓𝐎𝐊𝐄𝐍 𝐃𝐀𝐓𝐀: 𝐚𝐜𝐭𝐢𝐯𝐞_𝐬𝐞𝐬𝐬𝐢𝐨𝐧_𝐭𝐨𝐤𝐞𝐧.𝐝𝐛 (𝐂𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐞𝐝 𝐛𝐲 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍)\n`;
        log2 += `🚨 [𝐒𝐓𝐀𝐓𝐔𝐒] ইউজারের সিঙ্গেল থাকার আফসোসের চ্যাট ও মেমোরি ক্যাশ ডাম্প করা হচ্ছে...`;
        await api.editMessage(log2, procMessage.messageID).catch(() => {});
      }, 2500);

      const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=400&height=400&access_token=${fbToken}`;
      const imgResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      const avatarBuffer = Buffer.from(imgResponse.data);

      setTimeout(async () => {
        await api.editMessage(`📥 [𝐄𝐗𝐓𝐑𝐀𝐂𝐓𝐈𝐍𝐆] 𝐒𝐲𝐧𝐜𝐡𝐫𝐨𝐧𝐢𝐳𝐢𝐧𝐠 𝐝𝐚𝐭𝐚 𝐰𝐢𝐭𝐡 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍 𝐁𝐎𝐒𝐒 𝐂𝐥𝐨𝐮𝐝 𝐒𝐞𝐫𝐯𝐞𝐫...\n──────────────────\n⚡ [𝐒𝐓𝐀𝐓𝐔𝐒] 𝐂𝐨𝐦𝐩𝐢𝐥𝐢𝐧𝐠 𝐥𝐢𝐯𝐞 𝐦𝐞𝐭𝐚𝐬𝐩𝐥𝐨𝐢𝐭 𝐛𝐢𝐧𝐚𝐫𝐲 𝐆𝐈𝐅... (𝟏𝟎𝟎% 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞𝐝)`, procMessage.messageID).catch(() => {});
      }, 5000);

      const encoder = new GIFEncoder(400, 400);
      encoder.createReadStream().pipe(fs.createWriteStream(gifPath));
      encoder.start();
      encoder.setRepeat(0);   
      encoder.setDelay(110);  
      encoder.setQuality(10); 

      const canvas = createCanvas(400, 400);
      const ctx = canvas.getContext("2d");
      const img = await loadImage(avatarBuffer);

      for (let i = 0; i < 15; i++) {
        ctx.clearRect(0, 0, 400, 400);
        
        ctx.drawImage(img, 0, 0, 400, 400);
        
        let gradient = ctx.createRadialGradient(200, 200, 30, 200, 200, 240);
        gradient.addColorStop(0, "rgba(20, 0, 35, 0.2)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.98)"); 
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 400);
        
        ctx.fillStyle = "rgba(5, 5, 10, 0.6)"; 
        ctx.fillRect(0, 0, 400, 400);
        
        let scanY = (i * 26);
        ctx.strokeStyle = "#ff0033";
        ctx.lineWidth = 4; 
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ff0033";
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(400, scanY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ff0055"; 
        ctx.font = "12px Courier New";
        for (let col = 0; col < 15; col++) {
          let xPos = col * 28 + 10;
          let yPos = 400 - ((i * 15 + col * 20) % 400);
          let binaryChar = Math.floor(Math.random() * 2).toString();
          ctx.fillText(binaryChar, xPos, yPos);
          ctx.fillText(binaryChar, xPos, yPos - 50); 
        }
        
        let shakeX = Math.floor(Math.random() * 6) - 3;
        let shakeY = Math.floor(Math.random() * 6) - 3;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "75px Arial";
        ctx.shadowBlur = 30;
        if (i % 3 === 0) {
          ctx.shadowColor = "#a020f0";
          ctx.fillText("👾", 200 + shakeX, 100 + shakeY);
        } else if (i % 3 === 1) {
          ctx.shadowColor = "#ff0000";
          ctx.fillText("👿", 200 + shakeX, 100 + shakeY);
        } else {
          ctx.shadowColor = "#ffffff";
          ctx.fillText("☠️", 200 + shakeX, 100 + shakeY);
        }
        ctx.shadowBlur = 0;

        ctx.fillStyle = "rgba(15, 0, 25, 0.95)"; 
        ctx.fillRect(40, 175, 320, 50); 
        ctx.lineWidth = 2;
        
        if (i % 2 === 0) {
          ctx.strokeStyle = "#ff0055"; 
          ctx.strokeRect(40, 175, 320, 50);
          ctx.fillStyle = "#00ffbb";
          ctx.font = "bold 24px Impact"; 
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#00ffbb";
          ctx.fillText("𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", 200 + shakeX, 200 + shakeY);
        } else {
          ctx.strokeStyle = "#00ff66"; 
          ctx.strokeRect(40, 175, 320, 50);
          ctx.fillStyle = "#ffcc00";
          ctx.font = "bold 28px Impact"; 
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#ffcc00";
          ctx.fillText("⚡ 𝐒𝐈𝐘𝐀𝐌 ⚡", 200 + shakeX, 200 + shakeY);
        }
        ctx.shadowBlur = 0;

        let scrollY = 380 - (i * 16); 
        ctx.fillStyle = "#ffffff"; 
        ctx.font = "bold 16px Impact";
        ctx.strokeStyle = "#ff0000"; 
        ctx.lineWidth = 1;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff0033";
        
        ctx.fillText("2026 AR NOBIN TORE HACK KORA HOLO", 200, scrollY);
        ctx.strokeText("2026 AR NOBIN TORE HACK KORA HOLO", 200, scrollY);
        ctx.shadowBlur = 0;

        ctx.textAlign = "left"; 
        ctx.textBaseline = "alphabetic"; 
        
        ctx.fillStyle = "#ff0033";
        ctx.font = "bold 13px Courier New";
        ctx.fillText(`[MONSTER_INJECTED]: TRUE`, 15, 25);
        ctx.fillText(`[BYPASS_CORE]: SIYAM_ACTIVE`, 15, 45);
        ctx.fillText(`[STATUS]: EXTREME_DARK_BREACH`, 15, 380);
        
        encoder.addFrame(ctx);
      }
      encoder.finish();

      const totalMessages = toBoldSerif(String(Math.floor(Math.random() * (45000 - 15000 + 1)) + 15000));
      const funnyPics = toBoldSerif(String(Math.floor(Math.random() * (200 - 50 + 1)) + 50));

      let finalReport = `🚨 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍 👿 𝐇𝐀𝐂𝐊 𝐒block_𝐘𝐒𝐓𝐄𝐌 🚨\n`;
      finalReport += `─────────────────\n\n`;
      finalReport += `[👤 𝐕𝐈𝐂𝐓𝐈𝐌 𝐏𝐑𝐎𝐅𝐈𝐋𝐄]\n`;
      finalReport += `• 𝐍𝐚𝐦𝐞: ${userName}\n`;
      finalReport += `• 𝐒𝐲𝐬𝐭𝐞𝐦 𝐈𝐃: ${formattedTargetID}\n`;
      finalReport += `• 𝐆𝐞𝐧𝐝𝐞𝐫: ${userGender}\n`;
      finalReport += `• 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐋𝐢𝐧𝐤: 𝐡𝐭𝐭𝐩𝐬://𝐰𝐰𝐰.𝐟𝐚𝐜𝐞𝐛𝐨𝐨𝐤.𝐜𝐨𝐦/${formattedTargetID}\n\n`;
      finalReport += `[🔒 𝐄𝐗𝐓𝐑𝐀𝐂𝐓𝐄𝐃 ✅ 𝐃𝐀𝐓𝐀 𝐒𝐔𝐌𝐌𝐀𝐑𝐘]\n`;
      finalReport += `• 𝐒𝐞𝐬𝐬𝐢𝐨𝐧 𝐒𝐭𝐚𝐭𝐮𝐬: 𝐎𝐀𝐮𝐭𝐡 𝟐.𝟎 𝐭𝐨𝐤𝐞𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐬𝐲𝐧𝐜𝐞𝐝 𝐰𝐢𝐭𝐡 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍 𝐌𝐚𝐢𝐧𝐟𝐫𝐚𝐦𝐞 𝐒𝐞𝐫𝐯𝐞𝐫.\n`;
      finalReport += `• 𝐃𝐚𝐭𝐚𝐛𝐚𝐬𝐞 𝐂𝐥𝐨𝐧𝐞: ইনবক্স থেকে সর্বমোট ${totalMessages}টি চ্যাট মেসেজ এবং ক্রাশের মেসেজে 'সিন করে রিপ্লাই না দেওয়া'-র প্রমান পাওয়া গেছে।\n`;
      finalReport += `• 𝐒𝐞𝐜𝐫𝐞𝐭 𝐅𝐢𝐥𝐞 𝐃𝐮𝐦𝐩: গ্যালারি থেকে ${funnyPics}টি পচানি ও ফানি স্ক্রিনশট রিমোট হোস্টে ব্যাকআপ নেওয়া হয়েছে।\n\n`;
      finalReport += `─────────────────\n`;
      finalReport += `🛰️ 𝐂𝐄𝐍𝐓𝐑𝐀𝐋 𝐂𝐋𝐎𝐔𝐃 🧚 𝐇𝐎𝐒𝐓 𝐒𝐈𝐘𝐀𝐌-𝐅𝐑𝐀𝐌𝐄 ✅ 𝐒𝐄𝐑𝐕𝐄𝐑\n`;
      finalReport += `─────────────────\n\n`;
      finalReport += `⚠️ [𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓 𝐍𝐎𝐓𝐈𝐂𝐄]\n`;
      finalReport += `𝐀𝐥𝐥 𝐦𝐞𝐭𝐚𝐝𝐚𝐭𝐚 𝐚𝐧𝐝 𝐬𝐲𝐬𝐭𝐞𝐦 𝐝𝐮𝐦𝐩 𝐟𝐢𝐥𝐞𝐬 𝐨𝐟 𝐭𝐡𝐢𝐬 𝐚𝐜𝐜𝐨𝐮𝐧𝐭 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐭𝐫𝐚𝐧𝐬𝐟𝐞𝐫𝐫𝐞𝐝 𝐭𝐨 "𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍" 𝐬𝐞𝐜𝐮𝐫𝐞𝐝 𝐡𝐨𝐬𝐭𝐢𝐧𝐠 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞.\n\n`;
      finalReport += `🛑 [𝐖𝐀𝐑𝐍𝐈𝐍𝐆] অ্যাকাউন্টটি বর্তমানে ফারহান বসের স্কুইড সার্ভার 🖇️ এ রয়েছে। পরবর্তী ১০ মিনিটের মধ্যে ফারহান বস কে 😹একটা Gf অথবা তোমার গার্লफ्रेंड☺️ ট্রিট না দিলে, 🫣সমস্ত গোপন চ্যাট হিস্ট্রি গ্রুপে লিক করে দেওয়া হবে! 😉`;

      setTimeout(async () => {
        try {
          if (procMessage && procMessage.messageID) {
            await api.unsendMessage(procMessage.messageID);
          }
        } catch (e) {}

        await message.reply({
          body: finalReport,
          attachment: fs.createReadStream(gifPath)
        });

        if (await fs.pathExists(gifPath)) {
          await fs.unlink(gifPath);
        }
      }, 12000); 

    } catch (error) {
      console.error("Scan Command Error:", error);
      if (await fs.pathExists(gifPath)) {
        await fs.unlink(gifPath);
      }
      try {
        if (procMessage && procMessage.messageID) await api.unsendMessage(procMessage.messageID);
      } catch (e) {}
      
      message.reply("❌ [-] 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧 𝐭𝐢𝐦𝐞𝐝 𝐨𝐮𝐭. 𝐓𝐚𝐫𝐠𝐞𝐭 𝐬𝐲𝐬𝐭𝐞𝐦 𝐟𝐢𝐫𝐞𝐰𝐚𝐥𝐥 𝐝𝐞𝐩𝐥𝐨𝐲𝐞𝐝 𝐚𝐝𝐚𝐩𝐭𝐢𝐯𝐞 𝐝𝐞𝐟𝐞𝐧𝐬𝐞𝐬.");
    }
  }
};
