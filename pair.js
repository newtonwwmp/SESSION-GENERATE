const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI(process.env.PASTEBIN_API_KEY); // Use environment variable for Pastebin API key
const { makeid } = require('./id');
const express = require('express');
const pino = require("pino");
const {
    default: Maher_Zubair,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

const router = express.Router();

async function SIGMA_MD_PAIR_CODE(num, res, id) {
    const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

    try {
        let Pair_Code_By_Maher_Zubair = Maher_Zubair({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            printQRInTerminal: false,
            logger: pino({ level: "fatal" }).child({ level: "fatal" }),
            browser: ["Chrome (Linux)", "", ""]
        });

        if (!Pair_Code_By_Maher_Zubair.authState.creds.registered) {
            await delay(1500);
            num = num.replace(/[^0-9]/g, ''); // Sanitize input number
            const code = await Pair_Code_By_Maher_Zubair.requestPairingCode(num);
            if (!res.headersSent) {
                await res.send({ code });
            }
        }

        Pair_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);
        Pair_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
            const { connection, lastDisconnect } = s;
            if (connection === "open") {
                await delay(5000);
                let b64data = Buffer.from(state.creds).toString('base64');
                let session = await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, { text: "" + b64data });

                // New Message Text Block (Cyber Style)
                let SIGMA_MD_TEXT = `
╔═════════════ ⚡ SYSTEM ONLINE ⚡ ═════════════╗
║                                             
║  🟢 MAHIYA MD SESSION : ACTIVE & SECURED    
║  🔐 Status        : Connected Successfully   
║  🔥 Mode          : ENCRYPTED | STABLE       
║                                             
╚═════════════════════════════════════════════╝

⫸ 👨🏻‍💻 𝗖𝗥𝗘𝗔𝗧𝗢𝗥 : MIIRANGA / MAHIYA-BOY_
⫸ 👑 𝗢𝗪𝗡𝗘𝗥   : https://wa.me/+94715450089
⫸ 📡 𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠 : https://t.me/+94715450089

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ Crafted with 💙 by 𝗠𝗮𝗵𝗶𝘆𝗮-𝗕𝗢𝗬 🇱🇰
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                `;

                await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, { text: SIGMA_MD_TEXT }, { quoted: session });

                await delay(100);
                await Pair_Code_By_Maher_Zubair.ws.close();
            } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                await delay(10000);
                SIGMA_MD_PAIR_CODE(num, res, id); // Retry on disconnection
            }
        });
    } catch (err) {
        console.log("service restarted", err);
        if (!res.headersSent) {
            await res.send({ code: "Service Unavailable" });
        }
    }
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    if (!num) {
        return res.status(400).send({ error: "Number is required!" });
    }

    return await SIGMA_MD_PAIR_CODE(num, res, id);
});

module.exports = router;
