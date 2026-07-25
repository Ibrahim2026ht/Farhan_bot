const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pair2",
    aliases: ["couple2", "match2"],
    version: "1.1",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Get to know your partner",
      vi: "Tìm người ghép đôi"
    },
    longDescription: {
      en: "Know your destiny and know who you will complete your life with",
      vi: "Tìm nửa kia ngẫu nhiên trong nhóm"
    },
    category: "love",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, message, usersData }) {
    const { loadImage, createCanvas } = require("canvas");

    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    const pathImg = path.join(cacheDir, `pair_${event.senderID}_${Date.now()}.png`);
    const pathAvt1 = path.join(cacheDir, `avt1_${event.senderID}.png`);
    const pathAvt2 = path.join(cacheDir, `avt2_${event.senderID}.png`);

    try {
      const id1 = event.senderID;
      const name1 = await usersData.getName(id1);
      const ThreadInfo = await api.getThreadInfo(event.threadID);
      const all = ThreadInfo.userInfo || [];

      let gender1 = "UNKNOWN";
      for (let c of all) {
        if (c.id == id1) gender1 = c.gender;
      }

      const botID = api.getCurrentUserID();
      let ungvien = [];

      if (gender1 === "FEMALE") {
        for (let u of all) {
          if (u.gender === "MALE" && u.id !== id1 && u.id !== botID) {
            ungvien.push(u.id);
          }
        }
      } else if (gender1 === "MALE") {
        for (let u of all) {
          if (u.gender === "FEMALE" && u.id !== id1 && u.id !== botID) {
            ungvien.push(u.id);
          }
        }
      }

      // If no matching opposite gender, pick anyone
      if (ungvien.length === 0) {
        for (let u of all) {
          if (u.id !== id1 && u.id !== botID) ungvien.push(u.id);
        }
      }

      if (ungvien.length === 0) {
        return message.reply(
          "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ গ্রুপে কোনো উপযুক্ত পার্টনার পাওয়া যায়নি!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
        );
      }

      const id2 = ungvien[Math.floor(Math.random() * ungvien.length)];
      const name2 = await usersData.getName(id2);

      const rd1 = Math.floor(Math.random() * 100) + 1;
      const cc = ["0", "99.99", "100", "101", "88.88"];
      const rd2 = cc[Math.floor(Math.random() * cc.length)];
      const djtme = [rd1, rd1, rd1, rd1, rd1, rd2, rd1, rd1];
      const tile = djtme[Math.floor(Math.random() * djtme.length)];

      const backgroundUrl = "https://i.ibb.co/RBRLmRt/Pics-Art-05-14-10-47-00.jpg";
      const token = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

      const getAvtmot = (
        await axios.get(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=${token}`, {
          responseType: "arraybuffer"
        })
      ).data;
      fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot));

      const getAvthai = (
        await axios.get(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=${token}`, {
          responseType: "arraybuffer"
        })
      ).data;
      fs.writeFileSync(pathAvt2, Buffer.from(getAvthai));

      const getbackground = (
        await axios.get(backgroundUrl, { responseType: "arraybuffer" })
      ).data;
      fs.writeFileSync(pathImg, Buffer.from(getbackground));

      const baseImage = await loadImage(pathImg);
      const baseAvt1 = await loadImage(pathAvt1);
      const baseAvt2 = await loadImage(pathAvt2);

      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAvt1, 111, 175, 330, 330);
      ctx.drawImage(baseAvt2, 1018, 173, 330, 330);

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      fs.removeSync(pathAvt1);
      fs.removeSync(pathAvt2);

      const msgText = 
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n` +
        `» 💗 𝗠𝗔𝗧𝗖𝗛 𝗠𝗔𝗞𝗜𝗡𝗚 💗\n` +
        `» 🎉 অভিনন্দন ${name1}!\n` +
        `» ❤️ ভাগ্য আপনাকে ${name2}-এর সাথে মিলিয়ে দিয়েছে!\n` +
        `» 🔗 ভালোবাসার ম্যাচিং: ${tile}%\n───────────────\n` +
        `» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(
        {
          body: msgText,
          mentions: [
            { tag: name1, id: id1 },
            { tag: name2, id: id2 }
          ],
          attachment: fs.createReadStream(pathImg)
        },
        event.threadID,
        () => fs.removeSync(pathImg),
        event.messageID
      );
    } catch (err) {
      console.error("Pair2 Command Error:", err);
      if (fs.existsSync(pathAvt1)) fs.removeSync(pathAvt1);
      if (fs.existsSync(pathAvt2)) fs.removeSync(pathAvt2);
      if (fs.existsSync(pathImg)) fs.removeSync(pathImg);

      return message.reply(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ জোড়া তৈরি করতে সমস্যা হয়েছে! পরে আবার চেষ্টা করুন।\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
      );
    }
  }
};
