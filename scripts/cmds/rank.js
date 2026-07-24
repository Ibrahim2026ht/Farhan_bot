const Canvas = require("canvas");
const { uploadZippyshare } = global.utils;

const defaultFontName = "BeVietnamPro-SemiBold";
const defaultPathFontName = `${__dirname}/assets/font/BeVietnamPro-SemiBold.ttf`;
const { randomString } = global.utils;
const percentage = total => total / 100;

Canvas.registerFont(`${__dirname}/assets/font/BeVietnamPro-Bold.ttf`, {
	family: "BeVietnamPro-Bold"
});
Canvas.registerFont(defaultPathFontName, {
	family: defaultFontName
});

let deltaNext;
const expToLevel = (exp, deltaNextLevel = deltaNext) => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNextLevel)) / 2);
const levelToExp = (level, deltaNextLevel = deltaNext) => Math.floor(((Math.pow(level, 2) - level) * deltaNextLevel) / 2);
global.client.makeRankCard = makeRankCard;

module.exports = {
	config: {
		name: "rank",
		version: "1.8",
		author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 5,
		role: 0,
		description: {
			vi: "Xem level của bạn hoặc người được tag. Có thể tag nhiều người",
			en: "View your level or the level of the tagged person. You can tag many people"
		},
		category: "game",
		guide: {
			vi: "   {pn} [để trống | @tags]",
			en: "   {pn} [empty | @tags]"
		},
		envConfig: {
			deltaNext: 5
		}
	},

	onStart: async function ({ message, event, usersData, threadsData, commandName, envCommands, api }) {
		deltaNext = envCommands[commandName].deltaNext;
		let targetUsers;
		const arrayMentions = Object.keys(event.mentions);

		if (arrayMentions.length == 0)
			targetUsers = [event.senderID];
		else
			targetUsers = arrayMentions;

		const rankCards = await Promise.all(targetUsers.map(async userID => {
			const rankCard = await makeRankCard(userID, usersData, threadsData, event.threadID, deltaNext, api);
			rankCard.path = `${randomString(10)}.png`;
			return rankCard;
		}));

		return message.reply({
			body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📊 𝗥𝗔𝗡𝗞 𝗖𝗔𝗥𝗗\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
			attachment: rankCards
		});
	},

	onChat: async function ({ usersData, event }) {
		let { exp } = await usersData.get(event.senderID);
		if (isNaN(exp) || typeof exp != "number")
			exp = 0;
		try {
			await usersData.set(event.senderID, {
				exp: exp + 1
			});
		}
		catch (e) { }
	}
};

const defaultDesignCard = {
	widthCard: 2000,
	heightCard: 500,
	main_color: ["#FF0055", "#0055FF"], // Red & Blue gradient background
	sub_color: "rgba(0, 0, 0, 0.6)",
	alpha_subcard: 0.85,
	exp_color: "#00FFCC",
	expNextLevel_color: "#3f3f3f",
	text_color: "#FFFFFF"
};

async function makeRankCard(userID, usersData, threadsData, threadID, deltaNext, api = global.GoatBot.fcaApi) {
	const { exp } = await usersData.get(userID);
	const levelUser = expToLevel(exp, deltaNext);

	const expNextLevel = levelToExp(levelUser + 1, deltaNext) - levelToExp(levelUser, deltaNext);
	const currentExp = expNextLevel - (levelToExp(levelUser + 1, deltaNext) - exp);

	const allUser = await usersData.getAll();
	allUser.sort((a, b) => b.exp - a.exp);
	const rank = allUser.findIndex(user => user.userID == userID) + 1;

	const customRankCard = await threadsData.get(threadID, "data.customRankCard") || {};
	const dataLevel = {
		exp: currentExp,
		expNextLevel,
		name: allUser[rank - 1].name + " | SIYAM-HASAN",
		rank: `#${rank}/${allUser.length}`,
		level: levelUser,
		avatar: await usersData.getAvatarUrl(userID)
	};

	const configRankCard = {
		...defaultDesignCard,
		...customRankCard
	};

	const checkImagKey = [
		"main_color",
		"sub_color",
		"line_color",
		"exp_color",
		"expNextLevel_color"
	];

	for (const key of checkImagKey) {
		if (!isNaN(configRankCard[key]))
			configRankCard[key] = await api.resolvePhotoUrl(configRankCard[key]);
	}

	const image = new RankCard({
		...configRankCard,
		...dataLevel
	});
	return await image.buildCard();
}

class RankCard {
	constructor(options) {
		this.widthCard = 2000;
		this.heightCard = 500;
		this.main_color = ["#FF0055", "#0055FF"];
		this.sub_color = "rgba(0, 0, 0, 0.6)";
		this.alpha_subcard = 0.85;
		this.exp_color = "#00FFCC";
		this.expNextLevel_color = "#3f3f3f";
		this.text_color = "#FFFFFF";
		this.fontName = "BeVietnamPro-Bold";
		this.textSize = 0;

		for (const key in options)
			this[key] = options[key];
	}

	async buildCard() {
		let { widthCard, heightCard } = this;
		const {
			main_color,
			sub_color,
			alpha_subcard,
			exp_color,
			expNextLevel_color,
			text_color,
			name_color,
			level_color,
			rank_color,
			line_color,
			exp_text_color,
			exp,
			expNextLevel,
			name,
			level,
			rank,
			avatar
		} = this;

		widthCard = Number(widthCard);
		heightCard = Number(heightCard);

		const canvas = Canvas.createCanvas(widthCard, heightCard);
		const ctx = canvas.getContext("2d");

		// Draw Main Background (Red & Blue Gradient)
		if (Array.isArray(main_color)) {
			const gradient = ctx.createLinearGradient(0, 0, widthCard, heightCard);
			gradient.addColorStop(0, main_color[0]);
			gradient.addColorStop(1, main_color[1]);
			ctx.fillStyle = gradient;
		} else {
			ctx.fillStyle = main_color;
		}
		ctx.fillRect(0, 0, widthCard, heightCard);

		const alignRim = 3 * percentage(widthCard);
		const Alpha = parseFloat(alpha_subcard || 0);

		ctx.globalAlpha = Alpha;
		// Drawing sub card background
		ctx.fillStyle = sub_color;
		ctx.fillRect(alignRim, alignRim, widthCard - alignRim * 2, heightCard - alignRim * 2);
		ctx.globalAlpha = 1;

		// Draw Text Information (Name, Level, Rank)
		ctx.fillStyle = text_color || "#FFFFFF";
		ctx.font = `bold 60px "${this.fontName}"`;
		ctx.fillText(`Name: ${name}`, 550, 180);

		ctx.font = `bold 50px "${this.fontName}"`;
		ctx.fillText(`Level: ${level}`, 550, 270);
		ctx.fillText(`Rank: ${rank}`, 550, 350);

		// Draw Avatar if available
		if (avatar) {
			try {
				const avatarImg = await Canvas.loadImage(avatar);
				ctx.save();
				ctx.beginPath();
				ctx.arc(280, 250, 150, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(avatarImg, 130, 100, 300, 300);
				ctx.restore();
			} catch (e) {
				console.error(e);
			}
		}

		return canvas.toBuffer();
	}
}
