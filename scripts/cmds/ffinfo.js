const axios = require("axios");

  function toBold(text) {
  if (!text) return "";
  const str = String(text);
  const normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const boldChars   = "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";
  
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const idx = normalChars.indexOf(char);
    if (idx !== -1) {
      result += boldChars.substr(idx * 2, 2);
    } else {
      result += char;
    }
  }
  return result;
}

  function formatMessage(emoji, text) {
  return `───────────────\n\n» ${emoji} ${text}\n\n───────────────\n\n» 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;
}

module.exports = {
  config: {
    name: "ffinfo",
    aliases: ["freefireinfo", "ffstats"],
    version: "2.1.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    premium: false,
    description: "Show complete Free Fire player info with styled output",
    category: "game",
    guide: {
      en: "{p}ffinfo <uid>"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const uid = args[0];
      if (!uid) {
        const errorText = toBold("Please provide a Free Fire UID\n📌 Example: ffinfo 3060644273");
        return api.sendMessage(
          formatMessage("⚠️", errorText),
          event.threadID,
          event.messageID
        );
      }

      const waitText = toBold("Fetching Free Fire player info...");
      const wait = await api.sendMessage(
        formatMessage("⏳", waitText),
        event.threadID
      );

      const url = `https://ff.mlbbai.com/info/?uid=${encodeURIComponent(uid)}`;
      const res = await axios.get(url);
      const data = res.data;

      if (!data || !data.basicInfo) {
        const failText = toBold("Failed to fetch player data. UID may be invalid.");
        return api.editMessage(
          formatMessage("❌", failText),
          wait.messageID
        );
      }

      const b = data.basicInfo;
      const clan = data.clanBasicInfo || {};
      const pet = data.petInfo || {};
      const social = data.socialInfo || {};
      const credit = data.creditScoreInfo || {};
      const cap = data.captainBasicInfo || {};

      // এপিআই থেকে আসা ডেটা বোল্ড করা
      const name = toBold(b.nickname || "N/A");
      const accountId = toBold(b.accountId || uid);
      const region = toBold(b.region || "N/A");
      const level = toBold(b.level || "N/A");
      const likes = toBold(b.liked || 0);
      const exp = toBold(b.exp || 0);

      const rank = toBold(b.rank || "N/A");
      const rPoints = toBold(b.rankingPoints || 0);
      const csRank = toBold(b.csRank || "N/A");
      const csPoints = toBold(b.csRankingPoints || 0);

      const maxRank = toBold(b.maxRank || "N/A");
      const maxCsRank = toBold(b.csMaxRank || "N/A");
      const elitePass = toBold(b.hasElitePass ? "Yes" : "No");
      const badges = toBold(b.badgeCnt || 0);

      const season = toBold(b.seasonId || "N/A");
      const release = toBold(b.releaseVersion || "N/A");
      const brShow = toBold(b.showBrRank ? "Yes" : "No");
      const csShow = toBold(b.showCsRank ? "Yes" : "No");
      const createTime = toBold(b.createAt ? new Date(b.createAt * 1000).toLocaleDateString("en-GB") : "N/A");

      const gName = toBold(clan.clanName || "None");
      const gId = toBold(clan.clanId || "N/A");
      const gLevel = toBold(clan.clanLevel || "N/A");
      const gMembers = toBold(`${clan.memberNum || 0}/${clan.capacity || 0}`);
      const gLeader = toBold(`${cap.nickname || "N/A"} (Lv.${cap.level || "?"})`);

      const pName = toBold(pet.name || "None");
      const pLevel = toBold(pet.level || "N/A");
      const pExp = toBold(pet.exp || 0);
      const pSkin = toBold(pet.skinId || "N/A");

      const gender = toBold(social.gender?.replace("Gender_", "") || "N/A");
      const language = toBold(social.language?.replace("Language_", "") || "N/A");
      const signature = toBold(social.signature ? social.signature.replace(/\[B]|\[C]|\[ff[0-9a-f]+]/g, "") : "None");

      const cScore = toBold(credit.creditScore || "N/A");
      const cReward = toBold(credit.rewardState?.replace("REWARD_STATE_", "") || "N/A");
      const cPeriod = toBold(credit.periodicSummaryEndTime ? new Date(credit.periodicSummaryEndTime * 1000).toLocaleDateString("en-GB") : "N/A");

        const infoBody = `${toBold("𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄 𝐏𝐋𝐀𝐘𝐄𝐑 𝐈𝐍𝐅𝐎")}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${toBold("👤 𝐍𝐚𝐦𝐞:")} ${name}\n` +
        `${toBold("🆔 𝐔𝐢𝐝:")} ${accountId}\n` +
        `${toBold("🌍 𝐑𝐞𝐠𝐢𝐨𝐧:")} ${region}\n` +
        `${toBold("⭐ 𝐋𝐞𝐯𝐞𝐥:")} ${level}\n` +
        `${toBold("❤️ 𝐋𝐢𝐤𝐞𝐬:")} ${likes}\n` +
        `${toBold("📈 𝐄𝐱𝐩:")} ${exp}\n\n` +
        `${toBold("🏆 𝐑𝐚𝐧𝐤:")} ${rank}\n` +
        `${toBold("🎯 𝐑𝐚𝐧𝐤 𝐏oint𝐬:")} ${rPoints}\n` +
        `${toBold("⚔️ 𝐂𝐬 𝐑𝐚𝐧𝐤:")} ${csRank}\n` +
        `${toBold("🎮 𝐂𝐬 𝐏oint𝐬:")} ${csPoints}\n\n` +
        `${toBold("👑 𝐌𝐚𝐱 𝐑𝐚𝐧𝐤:")} ${maxRank}\n` +
        `${toBold("👑 𝐌𝐚𝐱 𝐂𝐬 𝐑𝐚𝐧𝐤:")} ${maxCsRank}\n` +
        `${toBold("🎟️ 𝐄𝐥𝐢𝐭𝐞 𝐏𝐚𝐬𝐬:")} ${elitePass}\n` +
        `${toBold("🏅 𝐁𝐚𝐝𝐠𝐞𝐬:")} ${badges}\n\n` +
        `${toBold("📅 𝐒𝐞𝐚𝐬𝐨𝐧:")} ${season}\n` +
        `${toBold("🛠️ 𝐑𝐞𝐥𝐞𝐚𝐬𝐞:")} ${release}\n` +
        `${toBold("👁️ 𝐁𝐫 𝐑𝐚𝐧𝐤 𝐒𝐡𝐨𝐰:")} ${brShow}\n` +
        `${toBold("👁️ 𝐂𝐬 𝐑𝐚𝐧𝐤 𝐒𝐡𝐨𝐰:")} ${csShow}\n` +
        `${toBold("⏳ 𝐀𝐜𝐜𝐨𝐮𝐧𝐭 𝐂𝐫𝐞𝐚𝐭𝐞:")} ${createTime}\n\n` +
        `${toBold("🛡️ 𝐆𝐮𝐢𝐥𝐝 𝐈𝐧𝐟𝐨")}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `${toBold("🏷️ 𝐆𝐮𝐢𝐥𝐝 𝐍𝐚𝐦𝐞:")} ${gName}\n` +
        `${toBold("🆔 𝐆𝐮𝐢𝐥𝐝 𝐈𝐝:")} ${gId}\n` +
        `${toBold("📊 𝐆𝐮𝐢𝐥𝐝 𝐋𝐞𝐯𝐞𝐥:")} ${gLevel}\n` +
        `${toBold("👥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬:")} ${gMembers}\n` +
        `${toBold("👑 𝐆𝐮𝐢𝐥𝐝 𝐋𝐞𝐚𝐝𝐞𝐫:")} ${gLeader}\n\n` +
        `${toBold("🐾 𝐏𝐞𝐭 𝐈𝐧𝐟𝐨")}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `${toBold("🐶 𝐍𝐚𝐦𝐞:")} ${pName}\n` +
        `${toBold("📈 𝐋𝐞𝐯𝐞𝐥:")} ${pLevel}\n` +
        `${toBold("⭐ 𝐄𝐱𝐩:")} ${pExp}\n` +
        `${toBold("🎨 𝐒𝐤𝐢𝐧 𝐈𝐝:")} ${pSkin}\n\n` +
        `${toBold("🌐 𝐒𝐨𝐜𝐢𝐚𝐥 𝐈𝐧𝐟𝐨")}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `${toBold("🚻 𝐆𝐞𝐧𝐝𝐞𝐫:")} ${gender}\n` +
        `${toBold("🗣️ 𝐋𝐚𝐧𝐠𝐮𝐚𝐠𝐞:")} ${language}\n` +
        `${toBold("✍️ 𝐒𝐢𝐠𝐧𝐚𝐭𝐮𝐫𝐞:")}\n${signature}\n\n` +
        `${toBold("🛡️ 𝐂𝐫𝐞𝐝𝐢𝐭 𝐒𝐜𝐨𝐫𝐞")}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `${toBold("💯 𝐒𝐜𝐨𝐫𝐞:")} ${cScore}\n` +
        `${toBold("🎁 𝐑𝐞𝐰𝐚𝐫𝐝:")} ${cReward}\n` +
        `${toBold("📆 𝐏𝐞𝐫𝐢𝐨𝐝 𝐄𝐧𝐝:")} ${cPeriod}`;

        await api.editMessage(
        formatMessage("🎮", infoBody),
        wait.messageID
      );

    } catch (err) {
      const errText = toBold(`Error: ${err.message}`);
      api.sendMessage(
        formatMessage("❌", errText),
        event.threadID,
        event.messageID
      );
    }
  }
};
