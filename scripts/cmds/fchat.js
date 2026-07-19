const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

const TOP_BAR_URL = "https://i.ibb.co/5bqFx6C/2d96e52b17d7.jpg";
const BOTTOM_BAR_URL = "https://i.ibb.co/ccnk9pMq/81194654b06f.jpg";

module.exports = {
  config: {
    name: "fakechat",
    aliases: ["fchat"],
    version: "2.2.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    description: {
      en: "Fake Messenger chat screenshot",
      bn: "ফেক মেসেঞ্জার চ্যাট স্ক্রিনশট"
    },
    category: "fun",
    guide: { en: "Reply to a message with {pn} <your reply>" }
  },

  langs: {
    en: {
      noReply: "───────────────\n\n» ❌ 𝗠𝗢𝗗𝗘: 𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀!\n\n───────────────\n\n» 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
      error: "───────────────\n\n» ❌ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆: 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻.\n\n───────────────\n\n» 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"
    },
    bn: {
      noReply: "───────────────\n\n» ❌ একটা মেসেজে 𝗿𝗲𝗽𝗹𝘆 করে কমান্ড দিন!\n\n───────────────\n\n» 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
      error: "───────────────\n\n» ❌ তৈরি করতে সমস্যা হয়েছে।\n\n───────────────\n\n» 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"
    }
  },

  onStart: async function ({ event, message, getLang, usersData, args, role }) {
    try {
      // ডায়নামিক এডমিন পারমিশন চেক (config.json ফাইল থেকে সরাসরি পারমিশন ভ্যালিডেশন)
      const configPath = process.cwd() + "/config.json";
      let adminIDs = [];
      if (fs.existsSync(configPath)) {
        const configJson = fs.readJsonSync(configPath);
        adminIDs = configJson.ADMINBOT || configJson.adminIDs || [];
      }
      
      const isSenderAdmin = adminIDs.includes(event.senderID);
      
      if (!isSenderAdmin && role < 1) {
        return message.reply("───────────────\n\n» ⚠️ 𝗔𝗱𝗺𝗶𝗻 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝗥𝗲𝗾𝘂𝗶𝗿𝗲𝗱.\n\n───────────────\n\n» 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍");
      }

      if (!event.messageReply) return message.reply(getLang("noReply"));

      const friendID = event.messageReply.senderID;
      const friendText = event.messageReply.body;
      const myText = args.join(" ");

      if (!friendText || !myText) return message.reply(getLang("noReply"));

      const friendName = await usersData.getName(friendID).catch(() => "Friend");

      const ts = Date.now();
      const topBarPath = __dirname + "/cache/fc_top_" + ts + ".jpg";
      const bottomBarPath = __dirname + "/cache/fc_bottom_" + ts + ".jpg";
      const friendAvtPath = __dirname + "/cache/fc_friend_" + ts + ".jpg";
      const outputPath = __dirname + "/cache/fc_out_" + ts + ".jpg";

      const [topRes, bottomRes, friendRes] = await Promise.all([
        axios.get(TOP_BAR_URL, { responseType: "arraybuffer" }),
        axios.get(BOTTOM_BAR_URL, { responseType: "arraybuffer" }),
        axios.get("https://graph.facebook.com/" + friendID + "/picture?height=200&width=200&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", { responseType: "arraybuffer" })
      ]);

      fs.writeFileSync(topBarPath, Buffer.from(topRes.data));
      fs.writeFileSync(bottomBarPath, Buffer.from(bottomRes.data));
      fs.writeFileSync(friendAvtPath, Buffer.from(friendRes.data));

      const topBarImg = await loadImage(topBarPath);
      const bottomBarImg = await loadImage(bottomBarPath);
      const friendImg = await loadImage(friendAvtPath);

      const W = 720;
      const topBarH = Math.round(topBarImg.height * (W / topBarImg.width));
      const bottomBarH = Math.round(bottomBarImg.height * (W / bottomBarImg.width));

      const bubblePadX = 22;
      const bubblePadY = 16;
      const maxBubbleWidth = 460;
      const avatarSize = 44;
      const fontSize = 26;
      const lineHeight = 34;

      const measureCanvas = createCanvas(10, 10);
      const mctx = measureCanvas.getContext("2d");
      mctx.font = fontSize + "px Sans";

      const friendLines = wrapTextByWidth(mctx, friendText, maxBubbleWidth - bubblePadX * 2);
      const myLines = wrapTextByWidth(mctx, myText, maxBubbleWidth - bubblePadX * 2);

      const friendBubbleW = Math.min(maxBubbleWidth, Math.max(...friendLines.map(l => mctx.measureText(l).width)) + bubblePadX * 2);
      const myBubbleW = Math.min(maxBubbleWidth, Math.max(...myLines.map(l => mctx.measureText(l).width)) + bubblePadX * 2);

      const friendBubbleH = friendLines.length * lineHeight + bubblePadY * 2;
      const myBubbleH = myLines.length * lineHeight + bubblePadY * 2;

      const chatPaddingTop = 40;
      const gapBetween = 30;
      const chatAreaH = friendBubbleH + gapBetween + myBubbleH + 50;
      const H = topBarH + chatPaddingTop + chatAreaH + bottomBarH;

      const canvas = createCanvas(W, H);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      ctx.drawImage(topBarImg, 0, 0, W, topBarH);

      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Dhaka" });
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Sans";
      ctx.textAlign = "left";
      ctx.fillText(timeStr, 24, 44);

      const headerAvtSize = 56;
      const headerAvtX = 86;
      const headerAvtY = topBarH - 45;
      ctx.save();
      ctx.beginPath();
      ctx.arc(headerAvtX + headerAvtSize / 2, headerAvtY, headerAvtSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      drawCoverImage(ctx, friendImg, headerAvtX, headerAvtY - headerAvtSize / 2, headerAvtSize, headerAvtSize);
      ctx.restore();

      const dotRadius = 9;
      const dotX = headerAvtX + headerAvtSize - 4;
      const dotY = headerAvtY + headerAvtSize / 2 - 4;
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotRadius + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#31a24c";
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      const nameX = headerAvtX + headerAvtSize + 14;
      const nameMaxWidth = 290;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      const fittedName = fitTextToWidth(ctx, friendName, nameMaxWidth, "bold 28px Sans");
      ctx.font = "bold 28px Sans";
      ctx.fillText(fittedName, nameX, headerAvtY + 8);

      let curY = topBarH + chatPaddingTop;

      const friendBubbleX = 40 + avatarSize + 12;
      drawBubble(ctx, friendBubbleX, curY, friendBubbleW, friendBubbleH, "#3a3b3c");
      ctx.fillStyle = "#ffffff";
      ctx.font = fontSize + "px Sans";
      friendLines.forEach((line, i) => {
        ctx.fillText(line, friendBubbleX + bubblePadX, curY + bubblePadY + (i + 1) * lineHeight - 8);
      });

      ctx.save();
      ctx.beginPath();
      ctx.arc(40 + avatarSize / 2, curY + friendBubbleH / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      drawCoverImage(ctx, friendImg, 40, curY + friendBubbleH / 2 - avatarSize / 2, avatarSize, avatarSize);
      ctx.restore();

      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(40 + avatarSize / 2, curY + friendBubbleH / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.stroke();

      curY += friendBubbleH + gapBetween;

      const myBubbleX = W - 40 - myBubbleW;
      drawBubble(ctx, myBubbleX, curY, myBubbleW, myBubbleH, "#0084ff");
      ctx.fillStyle = "#ffffff";
      ctx.font = fontSize + "px Sans";
      myLines.forEach((line, i) => {
        ctx.fillText(line, myBubbleX + bubblePadX, curY + bubblePadY + (i + 1) * lineHeight - 8);
      });

      ctx.drawImage(bottomBarImg, 0, H - bottomBarH, W, bottomBarH);

      fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg", { quality: 0.92 }));

      await message.reply({ attachment: fs.createReadStream(outputPath) });

      [topBarPath, bottomBarPath, friendAvtPath, outputPath].forEach(p => { try { fs.unlinkSync(p); } catch (_) {} });

    } catch (err) {
      console.error("Fakechat Error:", err);
      message.reply(getLang("error"));
    }
  }
};

function drawBubble(ctx, x, y, w, h, color) {
  const r = 20;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

function wrapTextByWidth(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const test = (current + " " + word).trim();
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = test;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines.length ? lines : [""];
}

function fitTextToWidth(ctx, text, maxWidth, font) {
  ctx.font = font;
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 1 && ctx.measureText(truncated + "...").width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + "...";
}

function drawCoverImage(ctx, img, x, y, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}
