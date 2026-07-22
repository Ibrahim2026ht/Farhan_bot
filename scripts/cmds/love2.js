const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒َان"; // 🔒 locked author

module.exports = {
  config: {
    name: "love2",
    aliases: ["match", "pair", "প্রেম"],
    version: "3.0",
    author: AUTHOR,
    role: 0,
    category: "fun",
    guide: "love @mention1 @mention2 (অথবা ১ জনকে মেনশন করুন)",
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    try {
      // 🔒 AUTHOR LOCK SYSTEM
      if (module.exports.config.author !== AUTHOR) {
        return api.sendMessage(
          "⛔ This file is locked!\nAuthor change detected.",
          event.threadID
        );
      }

      const mentions = Object.keys(event.mentions);

      if (mentions.length === 0) {
        return api.sendMessage(
          "⚠️ ভালোবাসার ফিউচারিস্টিক কার্ড তৈরি করতে অন্তত ১ বা ২ জনকে মেনশন (@mention) করুন!",
          event.threadID
        );
      }

      let id1, id2, name1, name2;

      if (mentions.length === 1) {
        id1 = event.senderID;
        name1 = "আপনি";
        id2 = mentions[0];
        name2 = event.mentions[id2].replace("@", "");
      } else {
        id1 = mentions[0];
        name1 = event.mentions[id1].replace("@", "");
        id2 = mentions[1];
        name2 = event.mentions[id2].replace("@", "");
      }

      // ১. লাভ পার্সেন্টেজ হিসাব
      const combined = (id1 + id2).toString();
      let sum = 0;
      for (let i = 0; i < combined.length; i++) {
        sum += parseInt(combined[i]) || 7;
      }
      const percentage = (sum % 56) + 45; // ৪৫% থেকে ১০০%

      // প্রোগ্রেস বার
      const totalBlocks = 10;
      const filledBlocks = Math.round((percentage / 100) * totalBlocks);
      const progressBar = "█".repeat(filledBlocks) + "░".repeat(totalBlocks - filledBlocks);

      // স্পেশাল ব্যাজ ও মন্তব্য
      let matchBadge = "";
      let comment = "";

      if (percentage >= 90) {
        matchBadge = "✨ DESTINED SOULMATES ✨";
        comment = "💞 সেরা জুটি! এদের আত্মায় আত্মায় মিলন।";
      } else if (percentage >= 78) {
        matchBadge = "🔥 PERFECT MATCH 🔥";
        comment = "💖 চরম রোমান্টিক একজোড়া পাখি!";
      } else if (percentage >= 60) {
        matchBadge = "⚡ SWEET BOND ⚡";
        comment = "💗 একটু ঝগড়া হলেও প্রেম কানায় কানায় ভরা।";
      } else {
        matchBadge = "💫 CRAZY DUO 💫";
        comment = "❤️‍🩹 টক-মিষ্টি অদ্ভুত সুন্দর এক সম্পর্ক!";
      }

      // ২. প্রোফাইল পিকচার সংগ্রাহক
      const avatarUrl1 = `https://graph.facebook.com/${id1}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatarUrl2 = `https://graph.facebook.com/${id2}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // 🎨 3. MASTERPIECE ULTRA-NEON CANVAS (900x520 HD Canvas)
      const width = 900;
      const height = 520;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // ব্যাকগ্রাউন্ড - ডিপ সাইবার পারপল ব্যাকড্রপ
      const bg = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 500);
      bg.addColorStop(0, "#2d001e");
      bg.addColorStop(0.6, "#0f000b");
      bg.addColorStop(1, "#030005");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // ব্যাকগ্রাউন্ডে নিওন লাইট পার্টিকেল গ্লো
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255, 0, 128, 0.3)" : "rgba(0, 240, 255, 0.3)";
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // গ্লাস-মরফিজম সেন্টার কার্ড (Frosted Glass Container)
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.strokeStyle = "rgba(255, 0, 128, 0.4)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#ff0080";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.roundRect(40, 40, width - 80, height - 80, 25);
      ctx.fill();
      ctx.stroke();

      // ছবি লোড করা
      let img1, img2;
      try {
        const res1 = await axios.get(avatarUrl1, { responseType: "arraybuffer" });
        img1 = await loadImage(Buffer.from(res1.data));
      } catch (e) {
        img1 = await loadImage("https://i.imgur.com/2dfL88M.png");
      }

      try {
        const res2 = await axios.get(avatarUrl2, { responseType: "arraybuffer" });
        img2 = await loadImage(Buffer.from(res2.data));
      } catch (e) {
        img2 = await loadImage("https://i.imgur.com/2dfL88M.png");
      }

      // লেজার ইলেকট্রিক হার্টবিট ওয়েভ (ECG Energy Line connecting both photos)
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 15;
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(200, 240);
      ctx.lineTo(340, 240);
      ctx.lineTo(360, 200);
      ctx.lineTo(380, 280);
      ctx.lineTo(400, 210);
      ctx.lineTo(420, 250);
      ctx.lineTo(450, 240);
      ctx.lineTo(480, 230);
      ctx.lineTo(500, 270);
      ctx.lineTo(520, 190);
      ctx.lineTo(540, 250);
      ctx.lineTo(560, 240);
      ctx.lineTo(700, 240);
      ctx.stroke();

      // ১ নম্বর ইউজার অবতার (Left Profile)
      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 35;
      ctx.save();
      ctx.beginPath();
      ctx.arc(200, 240, 95, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img1, 105, 145, 190, 190);
      ctx.restore();

      // ১ নম্বর ছবির নিওন পিংক বর্ডার
      ctx.strokeStyle = "#ff007f";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(200, 240, 97, 0, Math.PI * 2, true);
      ctx.stroke();

      // ২ নম্বর ইউজার অবতার (Right Profile)
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 35;
      ctx.save();
      ctx.beginPath();
      ctx.arc(700, 240, 95, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img2, 605, 145, 190, 190);
      ctx.restore();

      // ২ নম্বর ছবির নিওন সাইয়ান বর্ডার
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(700, 240, 97, 0, Math.PI * 2, true);
      ctx.stroke();

      // সেন্ট্রাল লাভ ক্রিস্টাল ডায়মন্ড প্লেট (Center Percentage Box)
      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 25;
      ctx.fillStyle = "#12000e";
      ctx.strokeStyle = "#ff007f";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 80, 175, 160, 130, 18);
      ctx.fill();
      ctx.stroke();

      // মাঝখানের পার্সেন্টেজ স্কোর
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 46px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${percentage}%`, width / 2, 235);

      ctx.fillStyle = "#ff007f";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("MATCH RATE", width / 2, 275);

      // হেডার টাইটেল (Cyberpunk Neon Header)
      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("💞 CYBER LOVE COMPATIBILITY 💞", width / 2, 90);

      // ম্যাচ স্ট্যাটাস ব্যাজ (Dynamic Neon Pill Button)
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "rgba(0, 240, 255, 0.15)";
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 180, 345, 360, 45, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#00f0ff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(matchBadge, width / 2, 374);

      // ফুটার
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#888888";
      ctx.font = "16px sans-serif";
      ctx.fillText("─── 👑 OWNER: SIYAM-HASAN  |  🧚‍♀️ NIJHUM CHATBOT ───", width / 2, 455);

      // ফাইল সেভ ও সেন্ড
      const imgPath = path.join(__dirname, "cache", `love_hd_${id1}_${id2}.png`);
      fs.ensureDirSync(path.join(__dirname, "cache"));
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(imgPath, buffer);

      const msgText = `» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
───────────────
💘 𝗖𝗬𝗕𝗘𝗥 𝗟𝗢𝗩𝗘 𝗠𝗔𝗧𝗖𝗛 
───────────────
👤 ${name1}  ✕  👤 ${name2}

🔥 মিলের পরিমাণ: ${percentage}%
📊 [${progressBar}]
🏷️ স্ট্যাটাস: ${matchBadge}

» ${comment}
───────────────
» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(
        {
          body: msgText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath)
      );

    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ আল্ট্রা লাভ কার্ড তৈরি করতে সমস্যা হয়েছে!", event.threadID);
    }
  }
};
