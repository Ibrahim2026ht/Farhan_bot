const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

if (!global.resendMsgMap) global.resendMsgMap = new Map();

module.exports = {
  config: {
    name: "resend",
    version: "3.2.0",
    role: 0,
    author: "SIYAM-HASAN",
    countDown: 0,
    shortDescription: "Auto resend un-sent messages",
    category: "system"
  },

  onLoad: function () {
    if (!global.resendMsgMap) global.resendMsgMap = new Map();
  },

  handleEvent: async function ({ event, api, usersData, threadsData }) {
    const { threadID, messageID, senderID, body, attachments, type } = event;

    try {
      if (threadsData) {
        const gData = await threadsData.get("global_resend_status").catch(() => null);
        if (gData && gData.status === false) return;

        const tData = await threadsData.get(threadID).catch(() => null);
        if (tData && tData.resend === false) return;
      }

      if (type !== "message_unsend") {
        global.resendMsgMap.set(messageID, {
          body: body || "",
          attachments: attachments || [],
          senderID: senderID
        });
        return;
      }

      if (type === "message_unsend") {
        const msg = global.resendMsgMap.get(messageID);
        if (!msg) return;

        if (msg.senderID === api.getCurrentUserID()) {
          global.resendMsgMap.delete(messageID);
          return;
        }

        let name = "Member";
        if (usersData && typeof usersData.getName === "function") {
          try { name = await usersData.getName(msg.senderID) || "Member"; } catch (e) {}
        } else if (usersData && typeof usersData.get === "function") {
          try {
            const u = await usersData.get(msg.senderID);
            name = u?.name || "Member";
          } catch (e) {}
        }

        if (!msg.attachments || msg.attachments.length === 0) {
          const content = msg.body ? msg.body : "[Emoji/Sticker]";
          api.sendMessage(`${name} deleted a message:\n${content}`, threadID);
          global.resendMsgMap.delete(messageID);
          return;
        }

        const fileStreams = [];
        const filePaths = [];
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

        for (let i = 0; i < msg.attachments.length; i++) {
          const att = msg.attachments[i];
          const url = att.url || att.previewUrl || att.playableUrl;
          if (!url) continue;

          try {
            const head = await axios.head(url).catch(() => null);
            if (head && head.headers["content-length"]) {
              if (parseInt(head.headers["content-length"]) / (1024 * 1024) > 25) continue;
            }

            let ext = "jpg";
            if (att.type === "photo") ext = "jpg";
            else if (att.type === "video") ext = "mp4";
            else if (att.type === "audio") ext = "mp3";
            else if (att.type === "animated_image") ext = "gif";

            const fPath = path.join(cacheDir, `resend_${Date.now()}_${i}.${ext}`);
            const res = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });

            fs.writeFileSync(fPath, Buffer.from(res.data));
            fileStreams.push(fs.createReadStream(fPath));
            filePaths.push(fPath);
          } catch (e) {}
        }

        const cleanUp = () => {
          filePaths.forEach(p => { try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch (e) {} });
          global.resendMsgMap.delete(messageID);
        };

        if (fileStreams.length === 0) {
          const textOnly = msg.body ? `\nMessage: ${msg.body}` : "";
          api.sendMessage(`${name} deleted a media message.${textOnly}`, threadID);
          global.resendMsgMap.delete(messageID);
          return;
        }

        const msgText = msg.body ? `${name} deleted a message:\n${msg.body}` : `${name} deleted attachments:`;
        api.sendMessage({ body: msgText, attachment: fileStreams }, threadID, cleanUp);
      }
    } catch (err) {
      console.error(err);
    }
  },

  onStart: async function ({ api, event, args, threadsData }) {
    const { threadID, messageID, senderID } = event;
    const action = args[0]?.toLowerCase();
    const subAction = args[1]?.toLowerCase();

    if (action === "resendall") {
      const adminList = global.config.ADMINBOT || global.config.NDH || [];
      if (!adminList.includes(senderID)) {
        return api.sendMessage("Only bot admin can use this.", threadID, messageID);
      }
      if (subAction !== "on" && subAction !== "off") {
        return api.sendMessage("Use: resendall on / resendall off", threadID, messageID);
      }
      const turnOn = subAction === "on";
      await threadsData.set("global_resend_status", { status: turnOn }).catch(() => {});
      return api.sendMessage(`Global resend: ${turnOn ? "ON" : "OFF"}`, threadID, messageID);
    }

    if (action === "on" || action === "off") {
      const turnOn = action === "on";
      const tData = (await threadsData.get(threadID).catch(() => {})) || {};
      tData.resend = turnOn;
      await threadsData.set(threadID, tData).catch(() => {});
      return api.sendMessage(`Resend for this group: ${turnOn ? "ON" : "OFF"}`, threadID, messageID);
    }

    const tData = (await threadsData.get(threadID).catch(() => {})) || {};
    const status = tData.resend !== false ? "ON" : "OFF";
    return api.sendMessage(`Resend Status: ${status}\nCommands:\nresend on/off\nresendall on/off`, threadID, messageID);
  }
};
