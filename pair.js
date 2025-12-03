const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    delay, 
    Browsers, 
    makeCacheableSignalKeyStore, 
    DisconnectReason 
} = require('@whiskeysockets/baileys');

const { upload } = require('./mega');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function PEAKY_BLINDER_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

        try {
            var items = ["Safari"];
            function selectRandomItem(array) {
                var randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            var randomItem = selectRandomItem(items);

            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);

                if (!res.headersSent) {
                    return res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection == "open") {
                    await delay(5000);

                    let rf = __dirname + `/temp/${id}/creds.json`;

                    function generateRandomText() {
                        const prefix = "3EB";
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let randomText = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            randomText += characters.charAt(randomIndex);
                        }
                        return randomText;
                    }

                    const randomText = generateRandomText();

                    try {
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        const string_session = mega_url.replace('https://mega.nz/file/', '');

                        let sessionID = "blinder~" + string_session;

                        // ⭐ Gifted Buttons Session Message ⭐
                        Sess = await sock.sendMessage(sock.user.id, {
                            text: sessionID,
                            buttons: [
                                {
                                    name: "cta_copy",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "Copy Session",
                                        copy_code: sessionID
                                    })
                                },
                                {
                                    name: "cta_url",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "Visit Bot Repo",
                                        url: "https://github.com/mauricegift/gifted-md"
                                    })
                                },
                                {
                                    name: "cta_url",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "Join WaChannel",
                                        url: "https://whatsapp.com/channel/0029Vb3hlgX5kg7G0nFggl0Y"
                                    })
                                }
                            ]
                        });

                        let desc = `*Hey there, PEAKY-BLINDER-MD User!* 👋🏻

Your session has been successfully created!

🔐 *Session ID:* Sent above  
⚠️ *Keep it safe!* Do NOT share with anyone.

——————

*📢 Stay Updated:*  
https://whatsapp.com/channel/0029Vb3hlgX5kg7G0nFggl0Y

*💻 Bot Repo:*  
https://github.com/mauricegift/gifted-md

——————
> *Powered by Gifted Tech* ✨`;

                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "ᴘᴇᴀᴋʏ-ʙʟɪɴᴅᴇʀ-ᴍᴅ",
                                    thumbnailUrl: "https://files.catbox.moe/7drn23.jpg",
                                    sourceUrl: "https://whatsapp.com/channel/0029Vb3hlgX5kg7G0nFggl0Y",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }
                            }
                        }, { quoted: Sess });

                    } catch (e) {
                        await sock.sendMessage(sock.user.id, { text: e.message });
                    }

                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);

                    console.log(`👤 ${sock.user.id} Connected ✔ Restarting...`);
                    process.exit();
                }

                else if (
                    connection === "close" && 
                    lastDisconnect && 
                    lastDisconnect.error && 
                    lastDisconnect.error.output?.statusCode != 401
                ) {
                    await delay(10);
                    PEAKY_BLINDER_MD_PAIR_CODE();
                }
            });

        } catch (err) {
            console.log("Service Restarted");
            await removeFile('./temp/' + id);

            if (!res.headersSent) {
                return res.send({ code: "❗ Service Unavailable" });
            }
        }
    }

    return await PEAKY_BLINDER_MD_PAIR_CODE();
});

module.exports = router;
