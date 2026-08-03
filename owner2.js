const fs = require("fs-extra");
const moment = require("moment-timezone");
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");

module.exports = {
  config: {
    name: "owner2",
    version: "8.0.0",
    author: "SIYAM",
    role: 0,
    shortDescription: "Premium Neon owner",
    longDescription: "Premium Animated Info Card",
    category: "owner",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {

    try {

      const width = 820;
      const height = 1280;

      const encoder = new GIFEncoder(width, height);

      const cachePath = __dirname + "/cache/premiuminfo.gif";

      if (!fs.existsSync(__dirname + "/cache")) {
        fs.mkdirSync(__dirname + "/cache");
      }

      const stream = encoder
        .createReadStream()
        .pipe(fs.createWriteStream(cachePath));

      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(70);
      encoder.setQuality(10);

      // PROFILE IMAGE
      const profile = await loadImage("https://i.imgur.com/3j6kz0F.jpeg");

      // COLORS
      const ledColors = [
        "#ff0000",
        "#00ffff",
        "#00ff00",
        "#ffff00",
        "#ff00ff",
        "#ff8800",
        "#0088ff",
        "#ffffff"
      ];

      // BOT UPTIME
      const uptime = process.uptime();

      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      // COMMAND COUNT
      const commandCount = global.GoatBot?.commands?.size || 6;

      // PREFIX
      const prefix = global.GoatBot?.config?.prefix || ",";

      for (let frame = 0; frame < 45; frame++) {

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // BACKGROUND
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        // EAGLE WATERMARK
        ctx.save();
        ctx.globalAlpha = 0.07;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 250px Sans";
        ctx.fillText("🦅", 170, 420);
        ctx.restore();

        // MAIN CARD
        ctx.fillStyle = "#050505";
        roundRect(ctx, 25, 25, 770, 1220, 30, true);

        // BORDER LIGHTS
        const borderLights = [
          { x: 90, y: 18, w: 140, h: 10 },
          { x: 320, y: 18, w: 140, h: 10 },
          { x: 550, y: 18, w: 140, h: 10 },

          { x: 18, y: 180, w: 10, h: 140 },
          { x: 18, y: 470, w: 10, h: 140 },
          { x: 18, y: 760, w: 10, h: 140 },

          { x: 792, y: 180, w: 10, h: 140 },
          { x: 792, y: 470, w: 10, h: 140 },
          { x: 792, y: 760, w: 10, h: 140 },

          { x: 90, y: 1250, w: 140, h: 10 },
          { x: 320, y: 1250, w: 140, h: 10 },
          { x: 550, y: 1250, w: 140, h: 10 }
        ];

        borderLights.forEach((light, i) => {

          ctx.shadowBlur = 20;
          ctx.shadowColor = ledColors[(frame + i) % ledColors.length];

          ctx.fillStyle = ledColors[(frame + i) % ledColors.length];

          roundRect(
            ctx,
            light.x,
            light.y,
            light.w,
            light.h,
            20,
            true
          );
        });

        ctx.shadowBlur = 0;

        // TITLE
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 30px Sans";
        ctx.fillText("👑 UDAY 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍🪯", 55, 100);

        // INFO BOX
        ctx.fillStyle = "#0d0d0d";
        roundRect(ctx, 45, 140, 320, 560, 22, true);

        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 3;
        roundRect(ctx, 45, 140, 320, 560, 22, false);

        // INFO TEXT
        const info = [
          ["🕌 RELIGION", "ISLAM", "#00ff88"],
          ["🎂 AGE", "17+", "#ff66cc"],
          ["🚹 GENDER", "MALE", "#00bfff"],
          ["🏠 ADDRESS", "Mymensingh", "#ffaa00"],
          ["🌍 COUNTRY", "BANGLADESH", "#00ffff"],
          ["💔 STATUS", "SINGLE", "#ff3333"],
          ["🧑‍🎓 WORK", "STUDENT", "#bb66ff"]
        ];

        let y = 190;

        info.forEach((item) => {

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 21px Sans";
          ctx.fillText(item[0], 65, y);

          ctx.fillStyle = item[2];
          ctx.font = "bold 24px Sans";
          ctx.fillText(item[1], 95, y + 28);

          ctx.strokeStyle = item[2];
          ctx.lineWidth = 2;

          ctx.beginPath();
          ctx.moveTo(60, y + 45);
          ctx.lineTo(320, y + 45);
          ctx.stroke();

          y += 72;
        });

        // PROFILE
        const px = 590;
        const py = 290;
        const radius = 125;

        ctx.save();

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          profile,
          px - radius,
          py - radius,
          radius * 2,
          radius * 2
        );

        ctx.restore();

        // PROFILE LED RING
        for (let i = 0; i < 8; i++) {

          ctx.strokeStyle = ledColors[(frame + i) % ledColors.length];
          ctx.lineWidth = 12;

          ctx.beginPath();

          ctx.arc(
            px,
            py,
            radius + 16,
            ((Math.PI * 2) / 8) * i + frame * 0.14,
            ((Math.PI * 2) / 8) * i + 0.42 + frame * 0.14
          );

          ctx.stroke();
        }

        // EAGLE DESIGN
        ctx.save();

        ctx.globalAlpha = 0.22;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 150px Sans";

        ctx.fillText("🦅", 480, 620);

        ctx.restore();

        // BOT NAME
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 38px Sans";
        ctx.fillText("👑𝆠፝ HT-FARHAN 👑", 390, 660);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 30px Sans";
        ctx.fillText("👑 HT-FARHAN 👑", 430, 715);

        // SMALL STATUS BOXES
        const boxY = 790;

        const smallBoxes = [
          {
            title: "BOT UPTIME",
            value: `${hours}H ${minutes}M`,
            color: "#00ffff",
            x: 45
          },
          {
            title: "COMMANDS",
            value: `${commandCount}`,
            color: "#ffff00",
            x: 295
          },
          {
            title: "PREFIX",
            value: `${prefix}`,
            color: "#ff00ff",
            x: 545
          }
        ];

        smallBoxes.forEach(box => {

          ctx.fillStyle = "#0b0b0b";
          roundRect(ctx, box.x, boxY, 210, 105, 18, true);

          ctx.strokeStyle = box.color;
          ctx.lineWidth = 3;
          roundRect(ctx, box.x, boxY, 210, 105, 18, false);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 19px Sans";
          ctx.fillText(box.title, box.x + 18, boxY + 35);

          ctx.fillStyle = box.color;
          ctx.font = "bold 24px Sans";
          ctx.fillText(box.value, box.x + 18, boxY + 72);
        });

        // COMMAND TITLE
        ctx.fillStyle = "#00ff00";
        ctx.font = "bold 28px Sans";
        ctx.fillText("AVAILABLE COMMANDS", 200, 980);

        // COMMAND BUTTONS
        const commands = [
          "⚔️,help",
          "📡,help3",
          "🛡️,owner",
          "🪯,owner2",
          "🚬,info",
          "🪬,info2"
        ];

        let startX = 55;
        let startY = 1030;

        commands.forEach((cmd, index) => {

          const x = startX + (index % 3) * 235;
          const y2 = startY + Math.floor(index / 3) * 75;

          ctx.fillStyle = "#0d0d0d";
          roundRect(ctx, x, y2, 170, 52, 16, true);

          ctx.strokeStyle = ledColors[(index + frame) % ledColors.length];
          ctx.lineWidth = 3;
          roundRect(ctx, x, y2, 170, 52, 16, false);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 22px Sans";
          ctx.fillText(cmd, x + 40, y2 + 34);
        });

        // PHONE BOX
        ctx.fillStyle = "#0d0d0d";
        roundRect(ctx, 130, 1160, 540, 75, 22, true);

        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 4;
        roundRect(ctx, 130, 1160, 540, 75, 22, false);

        ctx.fillStyle = "#00ff00";
        ctx.font = "bold 36px Sans";
        ctx.fillText("+8801734339892", 175, 1210);

        encoder.addFrame(ctx);
      }

      encoder.finish();

      stream.on("finish", () => {

        api.sendMessage(
          {
            body: "🫵তোমার আব্বু👑𝆠፝HT-FARHAN 👑",
            attachment: fs.createReadStream(cachePath)
          },
          event.threadID,
          () => fs.unlinkSync(cachePath)
        );
      });

    } catch (err) {

      console.log(err);

      api.sendMessage(
        "❌ Error creating premium info gif",
        event.threadID
      );
    }
  }
};

// ROUND RECT
function roundRect(ctx, x, y, width, height, radius, fill) {

  ctx.beginPath();

  ctx.moveTo(x + radius, y);

  ctx.lineTo(x + width - radius, y);

  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

  ctx.lineTo(x + width, y + height - radius);

  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

  ctx.lineTo(x + radius, y + height);

  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

  ctx.lineTo(x, y + radius);

  ctx.quadraticCurveTo(x, y, x + radius, y);

  ctx.closePath();

  if (fill) ctx.fill();
  else ctx.stroke();
        }
                               
