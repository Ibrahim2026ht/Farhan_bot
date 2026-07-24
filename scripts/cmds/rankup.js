const deltaNext = global.GoatBot.configCommands.envCommands.rank.deltaNext;
const expToLevel = exp => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
const { drive } = global.utils;

module.exports = {
	config: {
		name: "rankup",
		version: "1.4",
		author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 5,
		role: 0,
		description: {
			vi: "Bật/tắt thông báo level up",
			en: "Turn on/off level up notification"
		},
		category: "rank",
		guide: {
			en: "{pn} [on | off]"
		},
		envConfig: {
			deltaNext: 5
		}
	},

	langs: {
		vi: {
			syntaxError: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ 𝗦𝘆𝗻𝘁𝗮𝘅 𝗘𝗿𝗿𝗼𝗿!\n» 📖 শুধু ব্যবহার করুন:\n» ⚡ rankup 𝗼𝗻\n» ⚡ rankup 𝗼𝗳𝗳\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			turnedOn: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ 𝗗𝗮 𝗯𝗮𝘁 𝘁𝗵𝗼𝗻𝗴 𝗯𝗮𝗼 𝗹𝗲𝘃𝗲𝗹 𝘂𝗽\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			turnedOff: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ 𝗗𝗮 𝘁𝗮𝘁 𝘁𝗵𝗼𝗻𝗴 𝗯𝗮𝗼 𝗹𝗲𝘃𝗲𝗹 𝘂𝗽\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			notiMessage: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 👑👑 𝗖𝗼𝗻𝗴𝗿𝗮𝘁𝘂𝗹𝗮𝘁𝗶𝗼𝗻𝘀!\n» 🆙 𝗥𝗲𝗮𝗰𝗵𝗲𝗱 𝗹𝗲𝘃𝗲𝗹 %1\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
		},
		en: {
			syntaxError: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ 𝗦𝘆𝗻𝘁𝗮𝘅 𝗘𝗿𝗿𝗼𝗿!\n» 📖 শুধু ব্যবহার করুন:\n» ⚡ rankup 𝗼𝗻\n» ⚡ rankup 𝗼𝗳𝗳\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			turnedOn: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ Turn on level up notification\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			turnedOff: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ Turn off level up notification\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			notiMessage: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🎉🎉 Congratulations on reaching level %1\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
		}
	},

	onStart: async function ({ message, event, threadsData, args, getLang }) {
		if (!["on", "off"].includes(args[0]))
			return message.reply(getLang("syntaxError"));
		await threadsData.set(event.threadID, args[0] == "on", "settings.sendRankupMessage");
		return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
	},

	onChat: async function ({ threadsData, usersData, event, message, getLang }) {
		const threadData = await threadsData.get(event.threadID);
		const sendRankupMessage = threadData.settings.sendRankupMessage;
		if (!sendRankupMessage)
			return;
		const { exp } = await usersData.get(event.senderID);
		const currentLevel = expToLevel(exp);
		if (currentLevel > expToLevel(exp - 1)) {
			let customMessage = await threadsData.get(event.threadID, "data.rankup.message");
			let isTag = false;
			let userData;
			const formMessage = {};

			if (customMessage) {
				userData = await usersData.get(event.senderID);
				customMessage = customMessage
					.replace(/{oldRank}/g, currentLevel - 1)
					.replace(/{currentRank}/g, currentLevel);
				if (customMessage.includes("{userNameTag}")) {
					isTag = true;
					customMessage = customMessage.replace(/{userNameTag}/g, `@${userData.name}`);
				}
				else {
					customMessage = customMessage.replace(/{userName}/g, userData.name);
				}

				formMessage.body = customMessage;
			}
			else {
				formMessage.body = getLang("notiMessage", currentLevel);
			}

			if (threadData.data.rankup?.attachments?.length > 0) {
				const files = threadData.data.rankup.attachments;
				const attachments = files.reduce((acc, file) => {
					acc.push(drive.getFile(file, "stream"));
					return acc;
				}, []);
				formMessage.attachment = (await Promise.allSettled(attachments))
					.filter(({ status }) => status == "fulfilled")
					.map(({ value }) => value);
			}

			if (isTag) {
				formMessage.mentions = [{
					tag: `@${userData.name}`,
					id: event.senderID
				}];
			}

			message.reply(formMessage);
		}
	}
};
