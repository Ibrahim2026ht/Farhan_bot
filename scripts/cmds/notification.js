const { getStreamsFromAttachment } = global.utils;

module.exports = {
	config: {
		name: "notification",
		aliases: ["notify", "noti"],
		version: "1.7",
		author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 5,
		role: 2,
		description: {
			vi: "Gửi thông báo từ admin đến all box",
			en: "Send notification from admin to all box"
		},
		category: "owner",
		guide: {
			en: "{pn} <tin nhắn>"
		},
		envConfig: {
			delayPerGroup: 250
		}
	},

	langs: {
		vi: {
			missingMessage: "𝗩𝘂𝗶 𝗹ò𝗻𝗴 𝗻𝗵ậ𝗽 𝘁𝗶𝗻 𝗻𝗵ắ𝗻 𝗯ạ𝗻 𝗺𝘂ố𝗻 𝗴ử𝗶 đế𝗻 𝘁ấ𝘁 cả 𝗰á𝗰 𝗻𝗵ó𝗺",
			notification: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📢 𝗧𝗵ô𝗻𝗴 𝗯á𝗼 𝘁ừ 𝗮𝗱𝗺𝗶𝗻\n» 🔕 𝗞𝗵ô𝗻𝗴 𝗽𝗵ả𝗻 𝗵ồ𝗶",
			sendingNotification: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🚀 𝗔𝗿𝗮𝗺𝗯𝗵𝗼 𝗵𝗼𝗰𝗰𝗵𝗲: %1 𝘁𝗶\n» ⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗻𝗼𝘄",
			sentNotification: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✨ 𝗦𝗮𝗳𝗼𝗹𝘆𝗼: %1 𝘁𝗶\n» 🎯 𝗦𝗲𝗻𝗱 𝗰𝗼𝗺𝗽𝗹𝗲𝘁𝗲",
			errorSendingNotification: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗩𝘂𝗹: %1 𝗴𝗿𝗼𝘂𝗽𝘀\n%2"
		},
		en: {
			missingMessage: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✍️ 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗻𝗲𝗲𝗱𝗲𝗱\n» ⚠️ 𝗧𝘆𝗽𝗲 𝘁𝗲𝘅𝘁 𝗽𝗹𝘇",
			notification: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📢 𝗔𝗱𝗺𝗶𝗻 𝗯𝗿𝗼𝗮𝗱𝗰𝗮𝘀𝘁\n» 🔕 𝗗𝗼 𝗻𝗼𝘁 𝗿𝗲𝗽𝗹𝘆",
			sendingNotification: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🚀 𝗦𝘁𝗮𝗿𝘁𝗶𝗻𝗴: %1 𝗯𝗼𝘅\n» ⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁",
			sentNotification: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✨ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀: %1 𝗯𝗼𝘅\n» 🎯 𝗗𝗲𝗹𝗶𝘃𝗲𝗿𝗲𝗱",
			errorSendingNotification: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗙𝗮𝗶𝗹𝗲𝗱: %1 𝗯𝗼𝘅\n%2"
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang }) {
		const { delayPerGroup } = envCommands[commandName];
		if (!args[0])
			return message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✍️ 𝗡𝗼 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗳𝗼𝘂𝗻𝗱
» ⚠️ 𝗧𝘆𝗽𝗲 𝘀𝗼𝗺𝗲𝘁𝗵𝗶𝗻𝗴
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);

		const formSend = {
			body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📢 𝗔𝗱𝗺𝗶𝗻 𝗡𝗼𝘁𝗶𝗰𝗲
───────────────
${args.join(" ")}
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
			attachment: await getStreamsFromAttachment(
				[
					...event.attachments,
					...(event.messageReply?.attachments || [])
				].filter(item => ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
			)
		};

		const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);
		message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚀 𝗧𝗮𝗿𝗴𝗲𝘁: ${allThreadID.length} 𝗯𝗼𝘅
» ⏳ 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𝗻𝗼𝘄...
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);

		let sendSucces = 0;
		const sendError = [];
		const wattingSend = [];

		for (const thread of allThreadID) {
			const tid = thread.threadID;
			try {
				wattingSend.push({
					threadID: tid,
					pending: api.sendMessage(formSend, tid)
				});
				await new Promise(resolve => setTimeout(resolve, delayPerGroup));
			}
			catch (e) {
				sendError.push(tid);
			}
		}

		for (const sended of wattingSend) {
			try {
				await sended.pending;
				sendSucces++;
			}
			catch (e) {
				const { errorDescription } = e;
				if (!sendError.some(item => item.errorDescription == errorDescription))
					sendError.push({
						threadIDs: [sended.threadID],
						errorDescription
					});
				else
					sendError.find(item => item.errorDescription == errorDescription).threadIDs.push(sended.threadID);
			}
		}

		let msg = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n`;
		if (sendSucces > 0)
			msg += `» ✨ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀: ${sendSucces} 𝗯𝗼𝘅\n`;
		if (sendError.length > 0)
			msg += `» ⚠️ 𝗙𝗮𝗶𝗹𝗲𝗱: ${sendError.reduce((a, b) => a + b.threadIDs.length, 0)} 𝗯𝗼𝘅\n`;
		msg += `───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
		
		message.reply(msg);
	}
};
