const axios = require("axios");

function toBold(text) {
  if (text === undefined || text === null) return "";

  const normal =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const bold =
    "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭" +
    "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇" +
    "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";

  const str = String(text);
  let result = "";

  for (const char of str) {
    const index = normal.indexOf(char);

    if (index !== -1) {
      result += Array.from(bold)[index];
    } else {
      result += char;
    }
  }

  return result;
}

function formatMessage(emoji, text) {
  return (
    `───────────────\n\n` +
    `» ${emoji} ${text}\n\n` +
    `───────────────\n\n` +
    `» 👑 𝆠𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍`
  );
}

function get(obj, path, fallback = "N/A") {
  try {
    const value = path.split(".").reduce((o, k) => o?.[k], obj);

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return fallback;
    }

    return value;
  } catch {
    return fallback;
  }
}

module.exports = {
  config: {
    name: "ffinfo",
    aliases: ["freefireinfo", "ffstats"],
    version: "3.0.0",
    author: "𝆠፝𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍",
    role: 0,
    premium: false,
    description: "Show Free Fire player information",
    category: "game",

    guide: {
      en: "{p}ffinfo <uid>"
    }
  },

  onStart: async function ({ api, event, args }) {
    let wait;

    try {
      const uid = args[0];

      if (!uid) {
        return api.sendMessage(
          formatMessage(
            "⚠️",
            toBold(
              "Please provide a Free Fire UID\n\n" +
              "📌 Example: ffinfo 11083503512"
            )
          ),
          event.threadID,
          event.messageID
        );
      }

      // Loading message
      wait = await api.sendMessage(
        formatMessage(
          "⏳",
          toBold("Fetching Free Fire player info...")
        ),
        event.threadID
      );

      /*
       * Games Kinbo API
       * Endpoint:
       * https://api.gameskinbo.com/ff-info/get
       */

      const API_KEY =
        "0UL6tjcwm8N-bC6HUVQbxO8QDyWqEwCO2Gtf-q7qlJ4";

      const url =
        "https://api.gameskinbo.com/ff-info/get";

      const response = await axios.get(url, {
        params: {
          uid: uid,
          region: "BD"
        },

        headers: {
          "x-api-key": API_KEY,
          "Accept": "application/json"
        },

        timeout: 20000
      });

      const data = response.data;

      // API error check
      if (!data || data.error) {
        const errorMessage = get(
          data,
          "error",
          "Failed to fetch player information."
        );

        return api.editMessage(
          formatMessage(
            "❌",
            toBold(String(errorMessage))
          ),
          wait.messageID
        );
      }

      /*
       * Account Information
       */
      const account = data.AccountInfo || {};

      const name = get(
        account,
        "AccountName"
      );

      const accountId = get(
        account,
        "AccountId",
        uid
      );

      const level = get(
        account,
        "AccountLevel"
      );

      const exp = get(
        account,
        "AccountEXP",
        0
      );

      const region = get(
        account,
        "AccountRegion",
        "BD"
      );

      const likes = get(
        account,
        "AccountLikes",
        0
      );

      const createTime = get(
        account,
        "AccountCreateTime",
        null
      );

      const lastLogin = get(
        account,
        "AccountLastLogin",
        null
      );

      const season = get(
        account,
        "AccountSeasonId"
      );

      /*
       * Profile / Rank
       */
      const profile =
        data.AccountProfileInfo || {};

      const brMaxRank = get(
        profile,
        "BrMaxRank"
      );

      const brRankPoint = get(
        profile,
        "BrRankPoint",
        0
      );

      const csMaxRank = get(
        profile,
        "CsMaxRank"
      );

      const csRankPoint = get(
        profile,
        "CsRankPoint",
        0
      );

      /*
       * Guild
       */
      const guild =
        data.GuildInfo ||
        data.ClanInfo ||
        data.AccountGuildInfo ||
        {};

      const guildName =
        get(guild, "GuildName",
        get(guild, "ClanName", "None"));

      const guildId =
        get(guild, "GuildId",
        get(guild, "ClanId", "N/A"));

      const guildLevel =
        get(guild, "GuildLevel",
        get(guild, "ClanLevel", "N/A"));

      const guildMembers =
        get(guild, "GuildMemberCount",
        get(guild, "MemberCount", "N/A"));

      /*
       * Captain / Guild Leader
       */
      const captain =
        data.CaptainBasicInfo ||
        data.GuildLeaderInfo ||
        {};

      const leaderName =
        get(captain, "AccountName",
        get(captain, "Nickname", "N/A"));

      const leaderLevel =
        get(captain, "AccountLevel",
        get(captain, "Level", "N/A"));

      /*
       * Other information
       */
      const pet =
        data.PetInfo ||
        data.AccountPetInfo ||
        {};

      const petName =
        get(pet, "PetName",
        get(pet, "Name", "None"));

      const petLevel =
        get(pet, "PetLevel",
        get(pet, "Level", "N/A"));

      /*
       * Format dates
       */
      function formatDate(timestamp) {
        if (!timestamp) return "N/A";

        const num = Number(timestamp);

        if (Number.isNaN(num)) {
          return String(timestamp);
        }

        const date = new Date(num * 1000);

        if (Number.isNaN(date.getTime())) {
          return "N/A";
        }

        return date.toLocaleDateString("en-GB");
      }

      /*
       * Final message
       */
      const infoBody =
        `${toBold("𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄 𝐏𝐋𝐀𝐘𝐄𝐑 𝐈𝐍𝐅𝐎")}\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +

        `${toBold("👤 𝐍𝐚𝐦𝐞:")} ${toBold(name)}\n` +
        `${toBold("🆔 𝐔𝐈𝐃:")} ${toBold(accountId)}\n` +
        `${toBold("🌍 𝐑𝐞𝐠𝐢𝐨𝐧:")} ${toBold(region)}\n` +
        `${toBold("⭐ 𝐋𝐞𝐯𝐞𝐥:")} ${toBold(level)}\n` +
        `${toBold("❤️ 𝐋𝐢𝐤𝐞𝐬:")} ${toBold(likes)}\n` +
        `${toBold("📈 𝐄𝐱𝐩:")} ${toBold(exp)}\n\n` +

        `${toBold("🏆 𝐁𝐑 𝐑𝐚𝐧𝐤:")} ${toBold(brMaxRank)}\n` +
        `${toBold("🎯 𝐁𝐑 𝐑𝐚𝐧𝐤 𝐏𝐨𝐢𝐧𝐭𝐬:")} ${toBold(brRankPoint)}\n` +
        `${toBold("⚔️ 𝐂𝐒 𝐑𝐚𝐧𝐤:")} ${toBold(csMaxRank)}\n` +
        `${toBold("🎮 𝐂𝐒 𝐑𝐚𝐧𝐤 𝐏𝐨𝐢𝐧𝐭𝐬:")} ${toBold(csRankPoint)}\n\n` +

        `${toBold("📅 𝐒𝐞𝐚𝐬𝐨𝐧:")} ${toBold(season)}\n` +
        `${toBold("🕐 𝐀𝐜𝐜𝐨𝐮𝐧𝐭 𝐂𝐫𝐞𝐚𝐭𝐞:")} ${toBold(formatDate(createTime))}\n` +
        `${toBold("🟢 𝐋𝐚𝐬𝐭 𝐋𝐨𝐠𝐢𝐧:")} ${toBold(formatDate(lastLogin))}\n\n` +

        `${toBold("🛡️ 𝐆𝐔𝐈𝐋𝐃 𝐈𝐍𝐅𝐎")}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +

        `${toBold("🏷️ 𝐆𝐮𝐢𝐥𝐝 𝐍𝐚𝐦𝐞:")} ${toBold(guildName)}\n` +
        `${toBold("🆔 𝐆𝐮𝐢𝐥𝐝 𝐈𝐃:")} ${toBold(guildId)}\n` +
        `${toBold("📊 𝐆𝐮𝐢𝐥𝐝 𝐋𝐞𝐯𝐞𝐥:")} ${toBold(guildLevel)}\n` +
        `${toBold("👥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬:")} ${toBold(guildMembers)}\n` +
        `${toBold("👑 𝐋𝐞𝐚𝐝𝐞𝐫:")} ${toBold(leaderName)}\n` +
        `${toBold("⭐ 𝐋𝐞𝐚𝐝𝐞𝐫 𝐋𝐞𝐯𝐞𝐥:")} ${toBold(leaderLevel)}\n\n` +

        `${toBold("🐾 𝐏𝐄𝐓 𝐈𝐍𝐅𝐎")}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +

        `${toBold("🐶 𝐏𝐞𝐭 𝐍𝐚𝐦𝐞:")} ${toBold(petName)}\n` +
        `${toBold("📈 𝐏𝐞𝐭 𝐋𝐞𝐯𝐞𝐥:")} ${toBold(petLevel)}\n\n` +

        `${toBold("━━━━━━━━━━━━━━━━━━")}\n` +
        `${toBold("🎮 Games Kinbo API")}`;

      await api.editMessage(
        formatMessage("🎮", infoBody),
        wait.messageID
      );

    } catch (err) {

      let errorText = "Something went wrong.";

      if (err.response) {

        const status = err.response.status;
        const apiError =
          err.response.data?.error ||
          err.response.data?.message;

        if (status === 401) {
          errorText =
            "Invalid API key or API key missing.";
        }

        else if (status === 402) {
          errorText =
            "Invalid Free Fire UID or server error.";
        }

        else if (status === 429) {
          errorText =
            "API limit/rate limit exceeded. Please try again later.";
        }

        else {
          errorText =
            apiError ||
            `API Error: ${status}`;
        }

      } else if (err.code === "ECONNABORTED") {

        errorText =
          "API request timed out. Please try again.";

      } else {

        errorText =
          err.message || "Unknown error.";
      }

      if (wait?.messageID) {
        return api.editMessage(
          formatMessage(
            "❌",
            toBold(errorText)
          ),
          wait.messageID
        );
      }

      return api.sendMessage(
        formatMessage(
          "❌",
          toBold(errorText)
        ),
        event.threadID,
        event.messageID
      );
    }
  }
};
