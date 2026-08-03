const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "ss",
    version: "1.2.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    description: "Premium screenshot tool with SSL check",
    prefix: true,
    category: "utilities",
    cooldowns: 6
  },

  onStart: async function ({ api, event, args }) {
    const url = args[0];
    const device = args[1] || "iphone";

    if (!url) {
      return api.sendMessage(
        "⚠️ Please provide a valid URL",
        event.threadID,
        event.messageID
      );
    }

    try {
      const loading = await api.sendMessage(
        "⏳ Processing request...",
        event.threadID,
        event.messageID
      );

      // cache folder
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(cacheDir, `ss_${Date.now()}.png`);

      // screenshot API
      const screenshot = await axios.get(
        `https://render-puppeteer-test-sspb.onrender.com/ss?url=${encodeURIComponent(url)}&device=${device}`,
        { responseType: "arraybuffer" }
      );

      fs.writeFileSync(filePath, Buffer.from(screenshot.data));

      // SSL check
      const certCheck = new Promise((resolve) => {
        try {
          const req = https.get(url, (res) => {
            const cert = res.socket.getPeerCertificate();

            if (!cert || Object.keys(cert).length === 0) {
              return resolve("❌ SSL Check Failed");
            }

            const now = new Date();
            const from = new Date(cert.valid_from);
            const to = new Date(cert.valid_to);

            if (now >= from && now <= to) {
              resolve("✔ SSL Valid");
            } else {
              resolve("❌ SSL Check Failed");
            }
          });

          req.on("error", () => resolve("❌ SSL Check Failed"));
        } catch {
          resolve("❌ SSL Check Failed");
        }
      });

      const certStatus = await certCheck;

      api.unsendMessage(loading.messageID);

      const msg =
`      👑𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥🪄
     ✡️ 𝆠𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍 👑
━━━━━━━━━━━━━━━━━━
📱 𝗗𝗘𝗩𝗜𝗖𝗘
▸ ${device.toUpperCase()}
🌐 𝗦𝗧𝗔𝗧𝗨𝗦 𝗖𝗢𝗗𝗘
▸ ${screenshot.status || 200} (𝗢𝗞)
🔒 𝗦𝗦𝗟 𝗖𝗛𝗘𝗖𝗞
▸ ${certStatus}
⚙️ 𝗣𝗥𝗢𝗖𝗘𝗦𝗦
▸ 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆
✔ 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗘𝘅𝗲𝗰𝘂𝘁𝗲𝗱  
✔ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗥𝗲𝗰𝗲𝗶𝘃𝗲𝗱  
⚠ 𝗦𝗲𝗰𝘂𝗿𝗶𝘁𝘆 𝗟𝗮𝘆𝗲𝗿 𝗜𝘀𝘀𝘂𝗲 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱 (𝗦𝗦𝗟)
━━━━━━━━━━━━━━━━━━
 ⎯͢⎯⃝👑𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧⎯͢⎯⃝🔋
━━━━━━━━━━━━━━━━━━
📸 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 𝗥𝗘𝗦𝗨𝗟𝗧
🔗 ${url}`;

      api.sendMessage(
        {
          body: msg,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        },
        event.messageID
      );

    } catch (err) {
      console.log(err);
      api.sendMessage(
        "❌ Screenshot failed. Try again.",
        event.threadID,
        event.messageID
      );
    }
  },

  run: async function (data) {
    return module.exports.onStart(data);
  }
};
