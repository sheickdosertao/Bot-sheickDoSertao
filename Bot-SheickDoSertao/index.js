//============================ LEIA ======================≈=≈=≈==≈==\\
/*base feita por sheickdosertao :)*/

//======= ABAIXO FICA A BAILEYS ====\\
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  DisconnectReason,
  PHONENUMBER_MCC,
  makeCacheableSignalKeyStore,
  delay,
  downloadContentFromMessage,
  proto
} = require('@whiskeySockets/baileys');
//============FIMMMMM======\\

//==========ABAIXO FICA OS MODULOS=======\\
const { Buffer } = require('buffer');
const colors = require('colors');
const cfonts = require('cfonts');
const fs = require('fs-extra');
const pino = require('pino');
const PhoneNumber = require('awesome-phonenumber')
const chalk = require('chalk')
let phoneNumber = "555198710999"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const readline = require("readline")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const NodeCache = require("node-cache")
const axios = require('axios');
const cheerio = require('cheerio')
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ytdl = require('ytdl-core');
const yts = require('yt-search');



//========ABAIXO FICA O ARMAZENAMENTO ========\\
const { menu, menuSemP, menuAdm, menuDono } = require('./dono/menus.js')
const { msg18, msgApi, consoleVerde, consoleVerde2, consoleVermelho, consoleVermelho2, consoleAmarelo, consoleAmarelo2, consoleAzul, consoleAzul2, consoleErro, consoleAviso, consoleOnline, consoleSucesso, fetchJson, getBuffer, timed, data, hora, selo, seloMeta, getFileBuffer, seloGpt, seloLuzia, seloLaura, seloCopilot } = require('./dono/Banker-Config/functions.js')

const { prefixo, botName, donoName, NumeroDono, fotomenu } = require('./dono/Banker-Config/settings.json')

const { gerarPagamentoAluguel } = require('./Gebe-Banker/lib/json/aluguel');

const { iniciarLoop } = require('./Gebe-Banker/lib/json/verificarPagamentos');
const setting = JSON.parse(fs.readFileSync('./dono/Banker-Config/settings.json'));


//==INÍCIO DA CONEXAO=//
async function IniciarGebe() {
  const store = makeInMemoryStore({ logger: pino().child({ level: 'debug', stream: 'store' }) });
  const { state, saveCreds } = await useMultiFileAuthState('./Gebe-Banker/Gebe-Conect');
  const { version } = await fetchLatestBaileysVersion();
  const msgRetryCounterCache = new NodeCache()

  const gebe = makeWASocket({
    version: [2, 3000, 1023223821],
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !pairingCode,
    mobile: useMobile,
    browser: ['Chrome (Linux)', '', ''],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    browser: ['Chrome (Linux)', '', ''],
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid)
      let msg = await store.loadMessage(jid, key.id)

      return msg?.message || ""
    },
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
  });

  if (!gebe.authState.creds.registered) {
    try {
      let number = await question(`${colors.cyan("Exemplo de como inserir o número: +55 88 9999-9999")}${colors.cyan("\nInsira o número de telefone nesse campo:")}`);
      number = number.replace(/[^0-9]/g, "");
      let code = await gebe.requestPairingCode(number);
      code = code?.match(/.{1,4}/g)?.join("-") || code;
      console.log(`${colors.yellow("Código para conectar o bot: ")}` + colors.white(code));
      rl.close();
    } catch (error) {
      console.error('Falha ao solicitar o código de registro. Por favor, tente novamente.\n', error)
    }
  };

  store.bind(gebe.ev);
  gebe.ev.on('creds.update', saveCreds);
  gebe.ev.on('chats.set', () => consoleSucesso('✔️ Conversas carregadas.'));
  gebe.ev.on('contacts.set', () => consoleSucesso('Conexão estabelecida.'));

  const banner = cfonts.render(('SheickDoSertao|bot'),
    {
      font: "block",
      align: "center",
      gradient: ["red", "blue"]
    })

  const banner2 = cfonts.render('Criador: Sheick Do Sertao', {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  });

  console.log(banner.string);
  console.log(banner2.string);

  gebe.ev.on('messages.upsert', async (upsert) => {
    try {


    
      const resposta = {
        espere: "**𝙰𝚐𝚞𝚊𝚛𝚍𝚎, 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚊𝚗𝚍𝚘 𝚜𝚞𝚊 𝚜𝚘𝚕𝚒𝚌𝚊𝚝𝚊𝚌𝚊𝚘.**",
        dono: "**𝙼𝚎𝚗𝚜𝚊𝚐𝚎𝚖 𝚛𝚎𝚜𝚝𝚛𝚒𝚝𝚊 𝚊𝚘 𝚙𝚛𝚘𝚙𝚛𝚒𝚎𝚝𝚊𝚝𝚒𝚘 𝚕𝚊𝚖𝚊𝚝𝚘𝚎𝚜 𝚍𝚘 𝚕𝚊𝚖𝚊𝚝𝚘𝚎𝚜 𝚍𝚘 𝚐𝚁𝚄𝙿𝙾.**",
        grupo: "**𝙴𝚜𝚜𝚊 𝚏𝚞𝚗𝚌𝚒𝚘𝚗𝚊𝚕𝚊𝚕𝚎 𝚎𝚜𝚝𝚊 𝚍𝚒𝚜𝚙𝚘𝚗𝚒𝚟𝚎𝚕 𝚊𝚙𝚎𝚗𝚊𝚜 𝚎𝚖 𝚆𝚊𝚝𝚜𝚊𝚙.**",
        premium: "𝙴𝚜𝚜𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘 𝚎 𝚎𝚡𝚌𝚞𝚜𝚒𝚟𝚘 𝚙𝚊𝚛𝚊 𝚞𝚜𝚞𝚊𝚛𝚒𝚘𝚜 𝚅𝙸𝙿/𝙿𝚛𝚎𝚖𝚒𝚞𝚖. 𝚀𝚞𝚎 𝚝𝚊𝚕 𝚜𝚎 𝚝𝚘𝚛𝚗𝚊 𝚞𝚖 𝚅𝙸𝙿 𝚎 𝚊𝚙𝚛𝚘𝚟𝚎𝚒𝚝𝚊𝚛 𝚝𝚘𝚍𝚊𝚜 𝚊𝚜 𝚟𝚊𝚗𝚝𝚊𝚐𝚎𝚗𝚜?",
        query: "𝙿𝚊𝚛𝚎𝚌𝚎 𝚟𝚘𝚌𝚎 𝚎𝚜𝚚𝚞𝚎𝚌𝚎𝚞 𝚍𝚎 𝚊𝚕𝚞𝚖 𝚟𝚊𝚕𝚘𝚛 𝚘𝚞 𝚗𝚘𝚖𝚎 𝚍𝚎𝚙𝚘𝚒𝚜 𝚍𝚘 𝚌𝚘𝚖𝚊𝚗𝚍𝚘. 𝚂𝚎𝚖 𝚙𝚛𝚘𝚋𝚕𝚎𝚖𝚊𝚜, 𝚝𝚎𝚗𝚝𝚎 𝚗𝚘𝚟𝚊𝚖𝚎𝚗𝚝𝚎 𝚎 𝚟𝚊𝚖𝚘𝚜 𝚎𝚖 𝚏𝚛𝚎𝚗𝚝𝚎! 👍",
        privado: "**𝙴𝚜𝚜𝚊 𝚏𝚞𝚗𝚌𝚒𝚘𝚗𝚊𝚕𝚊𝚕𝚎 𝚎𝚜𝚝𝚊 𝚍𝚒𝚜𝚙𝚘𝚗𝚒𝚟𝚎𝚕 𝚊𝚙𝚎𝚗𝚊𝚜 𝚎𝚖 𝚖𝚎𝚗𝚜𝚊𝚕𝚊𝚜 𝚙𝚛𝚊𝚝𝚊𝚝𝚊𝚜.**",
        adm: "**𝙰𝚌𝚎𝚜𝚜𝚘 𝚛𝚎𝚜𝚝𝚛𝚒𝚝𝚘 𝚎𝚜𝚜𝚎 𝚏𝚊𝚖𝚒𝚜𝚝𝚛𝚊𝚝𝚘𝚎𝚜 𝚕𝚊𝚖𝚊𝚝𝚘𝚎𝚜 𝚍𝚘 𝚐𝚛𝚞𝚙𝚘.**",
        error: "**𝙾𝚌𝚘𝚛𝚛𝚎𝚞 𝚞𝚖 𝚎𝚛𝚛𝚘. 𝚃𝚎𝚗𝚝𝚎 𝚗𝚘𝚟𝚊𝚖𝚎𝚗𝚝𝚎 𝚖𝚊𝚒𝚜 𝚝𝚊𝚛𝚍𝚎.**",
        botadm: "**𝙾 𝚋𝚘𝚝 𝚙𝚛𝚎𝚌𝚒𝚜𝚊 𝚍𝚎 𝚙𝚎𝚛𝚖𝚒𝚜𝚜𝚘𝚎𝚜 𝚍𝚎 𝚏𝚊𝚖𝚎𝚗𝚜𝚝𝚛𝚊𝚝𝚘𝚎𝚜 𝚙𝚊𝚛𝚊 𝚏𝚞𝚗𝚌𝚒𝚘𝚗𝚊𝚛 𝚌𝚘𝚛𝚛𝚎𝚝𝚊𝚖𝚎𝚗𝚝𝚎.**",
      }
     

      // CONST PRINCIPAIS //
      const prefix = prefixo;
      const msg = upsert.messages[0];
      const info = msg;
      if (!msg.message) return;
      const from = msg.key.remoteJid;
      const isBot = info.key.fromMe ? true : false;
      const isGroup = from.endsWith('@g.us');
      try { var groupMetadata = isGroup ? await gebe.groupMetadata(from) : "" } catch { return };
      const groupName = isGroup ? groupMetadata.subject : '';
      const altpdf = Object.keys(info.message)
      const type = altpdf[0] == 'senderKeyDistributionMessage' ? altpdf[1] == 'messageContextInfo' ? altpdf[2] : altpdf[1] : altpdf[0];
      const sender = msg.key.participant || from;
      const content = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      const pushname = info.pushName ? info.pushName : '';
      const removerMaiusculas = (texto) => texto.toLowerCase();
      const isCmd = content.startsWith(prefixo);
      const cmd = isCmd ? content.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null;

      let body = info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.buttonsMessage?.imageMessage?.caption || info.message?.buttonsResponseMessage?.selectedButtonId || info.message?.listResponseMessage?.singleSelectReply?.selectedRowId || info.message?.templateButtonReplyMessage?.selectedId || info?.text || ""

      let Procurar_String = info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.buttonsMessage?.imageMessage?.caption || ""

      const getGroupAdmins = (participants) => {
        let admins = []
        for (let i of participants) {
          if (i.admin == 'admin') admins.push(i.id)
          if (i.admin == 'superadmin') admins.push(i.id)
        }
        return admins
      }
      const botNumber = gebe.user.jid;
      const args = body.trim().split(/ +/).slice(1);
      const q = args.join(' ');
      const types = Object.keys(msg.message)[0];
      const groupMembers = isGroup ? groupMetadata.participants : '';
      const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : '';

      const donofc = NumeroDono + "@s.whatsapp.net";
      const numeroDono = NumeroDono;
      const IsDono = donofc.includes(sender);
      const SoDono = IsDono;
      const isGroupAdmins = groupAdmins.includes(sender) || false || IsDono;
     

      //================= FUNCTION DE BOTOFF, BOTON ETC =====\\
      const nescessario = require("./dono/nescessario.json");

      const dirGroup = `./Gebe-Banker/grupos/activation_gp/${from}.json`;

      const dirGroupFolder = './Gebe-Banker/grupos/activation_gp';
      if (!fs.existsSync(dirGroupFolder)) {
        fs.mkdirSync(dirGroupFolder, { recursive: true });
      }
      const nescj = "./dono/nescessario.json";

      if (isGroup && !fs.existsSync(dirGroup)) {
        let data = [
          {
            name: groupName,
            groupId: from,
            x9: false,
            antiimg: false,
            antivideo: false,
            antiaudio: false,
            antisticker: false,
            antidoc: false,
            antictt: false,
            antiloc: false,
            antilinkgp: false,
            antilinkhard: false,
            antifake: false,
            antiporn: false,
            Odelete: false,
            antispam: false,
            antinotas: false,
            anticatalogo: false,
            visuUnica: false,
            registrarFIGUS: false,
            soadm: false,
            listanegra: [],
            advertir: [],
            prefixos: [`#`],
            advertir2: [],
            legenda_estrangeiro: "0",
            legenda_documento: "0",
            legenda_video: "0",
            legenda_imagem: "0",
            multiprefix: true,
            forca_ofc: [
              {
                acertos: 0,
                erros: 0,
                palavra: [],
                escreveu: [],
                palavra_ofc: 0,
                dica: 0,
                tema: 0,
              },
            ],
            ausentes: [],
            forca_inc: false,
            antipalavrao: {
              active: false,
              palavras: [],
            },
            limitec: {
              active: false,
              quantidade: null,
            },
            wellcome: [
              {
                bemvindo1: false,
                legendabv:
                  "Olá #numerodele#, seja bem vindo (a) ao grupo: #nomedogp#",
                legendasaiu: "#numerodele# – Saiu do grupo: #nomedogp#",
              },
              {
                bemvindo2: false,
                legendabv:
                  "Olá #numerodele#, seja bem vindo (a) ao grupo: #nomedogp#",
                legendasaiu: "#numerodele# – Saiu do grupo: #nomedogp#",
              },
            ],
            simi1: false,
            simi2: false,
            autosticker: false,
            autoresposta: false,
            jogos: false,
            level: false,
            bangp: false,
            aluguel: false,
          },
        ];
        fs.writeFileSync(dirGroup, JSON.stringify(data, null, 2) + "\n");
      }

      const dataGp = isGroup
        ? JSON.parse(fs.readFileSync(dirGroup))
        : undefined;

      function setGp(index) {
        fs.writeFileSync(dirGroup, JSON.stringify(index, null, 2) + "\n");
      }

      function setNes(index) {
        fs.writeFileSync(nescj, JSON.stringify(index, null, 2) + "\n");
      }
    

      //======== ARMAZENAMENTO COMPLETO ====\\

      const isBanchat = isGroup ? dataGp[0].bangp : false;
      const So_Adm = isGroup ? dataGp[0].soadm : false;
      const isBotoff = nescessario.botoff;
      const rg_aluguel = JSON.parse(fs.readFileSync("./Gebe-Banker/lib/json/rg_aluguel.json"));
      const isAntilinkgp = isGroup ? dataGp[0].antilinkgp : false
      const IS_DELETE = nescessario.Odelete
      const isAutofigu = isGroup ? dataGp[0].autosticker : false
      const isAntiSticker = isGroup ? dataGp[0].antisticker : false
      const Antidoc = isGroup ? dataGp[0].antidoc : false

      //======== FIMMMM ======\\

      //======CONSOLE COMANDOS=====\\
      if (isCmd && isGroup) {
        console.log(colors.brightGreen(`

〔 ${colors.brightYellow("USUÁRIO")} 〕: ${pushname}

〔 NÚMERO 〕:〔 ${colors.brightMagenta(sender.split("@")[0])} 〕

〔 ${colors.brightMagenta("GRUPO")} 〕:〔 ${colors.cyan(groupName)} 〕

〔 COMANDO 〕:「 ${cmd} 」`))
      } else if (isCmd && !isGroup) {
        console.log(colors.brightGreen(`

〔 ${colors.brightYellow("USUÁRIO")} 〕: ${pushname}

〔 NÚMERO 〕:〔 ${colors.brightMagenta(sender.split("@")[0])} 〕

〔 ${colors.red("PRIVADO")} 〕 

〔 COMANDO 〕 :「 ${cmd} 」`))
      }
    

     

      const somembros =
        isGroup && Array.isArray(groupMembers)
          ? groupMembers.map((v) => v.id)
          : [];

      const menc_prt = info.message?.extendedTextMessage?.contextInfo?.participant

      const menc_jid = args?.join(" ").replace("@", "") + "@s.whatsapp.net"

      const menc_jid2 = info.message?.extendedTextMessage?.contextInfo?.mentionedJid

      const menc_os2 = q.includes("@") ? menc_jid : menc_prt

      var texto_exato = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''

      const texto = texto_exato.slice(0).trim().split(/ +/).shift().toLowerCase()
    

      //=========(isQuoted/consts)=============\\
      const isImage = type == 'imageMessage'
      const isVideo = type == 'videoMessage'
      const isVisuU2 = type == 'viewOnceMessageV2'
      const isAudio = type == 'audioMessage'
      const isSticker = type == 'stickerMessage'
      const isContact = type == 'contactMessage'
      const isLocation = type == 'locationMessage'
      const isProduct = type == 'productMessage'
      const isMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage' || type == "viewOnceMessage" || type == "viewOnceMessageV2")
      typeMessage = body.substr(0, 50).replace(/\n/g, '')
      if (isImage) typeMessage = "Image"
      else if (isVideo) typeMessage = "Video"
      else if (isAudio) typeMessage = "Audio"
      else if (isSticker) typeMessage = "Sticker"
      else if (isContact) typeMessage = "Contact"
      else if (isLocation) typeMessage = "Location"
      else if (isProduct) typeMessage = "Product"

      const isQuotedMsg = type === 'extendedTextMessage' && content.includes('conversation')

      const isQuotedMsg2 = type === 'extendedTextMessage' && content.includes('text')

      const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')

      const isQuotedVisuU = type === 'extendedTextMessage' && content.includes('viewOnceMessage')

      const isQuotedVisuU2 = type === 'extendedTextMessage' && content.includes('viewOnceMessageV2')

      const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')

      const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')

      const isQuotedDocW = type === 'extendedTextMessage' && content.includes('documentWithCaptionMessage')

      const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')

      const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')

      const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage')

      const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage')

      const isQuotedProduct = type === 'extendedTextMessage' && content.includes('productMessage')
    



      const getFileBuffer = async (mediakey, MediaType) => {
        const stream = await downloadContentFromMessage(mediakey, MediaType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
      };

      const { sendVideoAsSticker2, sendImageAsSticker2 } = require('./Gebe-Banker/sticker/rename2.js');

 

      // FUNÇÃO DO RENAME STICKER //

      const { Sticker } = require("./Gebe-Banker/sticker/rename/sticker.js");

      async function renameContextSticker(pack, autor, txt = ``, info) {
        try {
          getfile = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
          var _sticker = new Sticker()
          _sticker.addFile(getfile);
          _sticker.options.metadata = { pack: pack, author: autor, emojis: ['🤠', '🥶', '😻'] };
          resultadoSt = await _sticker.start();
          await gebe.sendMessage(from, { sticker: fs.readFileSync(resultadoSt[0].value), contextInfo: { externalAdReply: { title: txt, body: "", previewType: "PHOTO", thumbnail: fs.readFileSync(resultadoSt[0].value) } } }, { quoted: seloMeta })
          await fs.unlinkSync(resultadoSt[0].value)
        } catch (e) { console.log(e) }
      }
      // FUNÇÃO TOTAL COMANDOS\\
      const infocases = async () => {
        try {
          const data = await fs.readFile('./index.js', 'utf8');
          let regex = /case\s'(\w+)'/g;
          let match;
          let caseNames = [];

          while ((match = regex.exec(data)) !== null) {
            caseNames.push(match[1]);
          }

          let totalCount = caseNames.length;
          return totalCount;
        } catch (err) {
          console.error('Erro ao ler o arquivo:', err);
          return 0;
        }
      };

      const totalcmds = await infocases();

      // FUNÇÃO DE TEMPO //

      if (hora > "00:00:00" && hora < "05:00:00") {
        let tempo = 'Boa noite'
      } if (hora > "05:00:00" && hora < "12:00:00") {
        let tempo = 'Bom dia'
      } if (hora > "12:00:00" && hora < "18:00:00") {
        let tempo = 'Boa tarde'
      } if (hora > "18:00:00") {
        let tempo = 'Boa noite'
      }

      const os = require('os');
      const infoSystem = require('os')

      /* Essa função serve para transformar segundos em hora, minutos.. */
      function kyun(seconds) {
        function pad(s) { return (s < 10 ? "0" : "") + s };
        let horas = Math.floor(seconds / (60 * 60) % (24));
        let minutos = Math.floor(seconds % (60 * 60) / 60);
        let segundos = Math.floor(seconds % 60);
        return `${pad(horas)}h, ${pad(minutos)}m e ${pad(segundos)}s.`;
      }

      // DELETAR  :
      function DLT_FL(file) {
        try {
          fs.unlinkSync(file);
        } catch (error) {
          console.log("Erro ao deletar arquivo: " + error);
        }
      }

      //======== ABAIXO FICA AS FUNÇÕES DE ENVIAR, ESCREVER E ETC====\\
      async function escrever(texto) {
        await gebe.sendPresenceUpdate('composing', from)
        await esperar(1000)
        gebe.sendMessage(from, { text: texto }, { quoted: seloMeta })
      }

      const enviar = (texto) => {
        gebe.sendMessage(from, { text: texto }, { quoted: seloMeta })
      }

      const enviarImg = async (link) => {
        await gebe.sendMessage(from, { image: { url: link } }, { quoted: seloMeta })
      }

      const enviarImg2 = async (link, texto) => {
        await gebe.sendMessage(from, { image: { url: link }, caption: texto }, { quoted: seloMeta })
      }

      const enviarVd = async (link) => {
        await gebe.sendMessage(from, { video: { url: link }, mimetype: "video/mp4", fileName: "video.mp4" }, { quoted: seloMeta })
      }


      const enviarVd2 = async (link, texto) => {
        await gebe.sendMessage(from, { video: { url: link }, caption: texto, mimetype: "video/mp4", fileName: "video.mp4" }, { quoted: seloMeta })
      }

      const enviarAd = async (link) => {
        await gebe.sendMessage(from, { audio: { url: link }, mimetype: "audio/mpeg" }, { quoted: seloMeta })
      }

      const esperar = async (tempo) => {
        return new Promise(funcao => setTimeout(funcao, tempo));
      }

      const reagir = async (idgp, emj) => {
        let reactionMessage = {
          react: {
            text: emj,
            key: info.key
          }
        }
        gebe.sendMessage(idgp, reactionMessage)
      }
    

      //============== AQUI FICA OS IF'S DOS COMANDOS DE DONO, ADM E ETC===========\\

      if (isGroup && isCmd && isBanchat && !SoDono) return;
      if (isGroup && isCmd && So_Adm && !SoDono && !isGroupAdmins) return;
      if (isBotoff && !SoDono) return;

     

      async function LIMPARDOCNT_QUEMJASAIU() {
        var RD_CNT = countMessage[countMessage.map(i => i.groupId).indexOf(from)].numbers
        CNT1 = []; for (i of groupMembers) { CNT1.push(i.id) }
        CNT = []; for (i of RD_CNT) {
          if (!CNT1.includes(i.id)) CNT.push(i)
        }
        for (i of CNT) {
          RD_CNT.splice(RD_CNT.map(i => i.id).indexOf(i.id), 1)
        }
        fs.writeFileSync("./Gebe-Banker/lib/countmsg.json", JSON.stringify(countMessage, null, 2))
      }


      if (isCmd) { 

      
        if (body.startsWith(`${prefixo}lojinha`) || body.startsWith(`${prefixo}alugar`)) {
          // Aqui você só deixa passar, não bloqueia  
        } else {

          // se não é dono e precisa ter aluguel registrado  
          if ((nescessario?.rg_aluguelGB || (isGroup && dataGp[0]?.rg_aluguel) || false) && !SoDono) {

            // se não tiver aluguel registrado  
            if (!rg_aluguel.some(i => i.id_gp == from)) {
              return enviar(
                `🚫 O aluguel do (Grupo/Usuário) não está registrado!\n\n` +
                `👉 Fale com o dono para registrar ou renovar digite o comando: ${prefixo}lojinha`
              )
            }



            // ✅ Se chegou aqui → está válido, só libera os comandos (não manda mensagem)  
          }
        }
      }

    
    
      // ======================
      function ativarAluguel(id_gp, nome_, dias = 30) {
        const vencimento = Math.floor(Date.now() / 1000) + (dias * 24 * 60 * 60);

        // adiciona no registro
        rg_aluguel.push({
          id_gp,
          nome_,
          vencimento
        });

        // salva no JSON
        fs.writeFileSync("./Gebe-Banker/lib/json/rg_aluguel.json", JSON.stringify(rg_aluguel, null, 2));

        // envia a mensagem apenas 1 vez (quando pago)
        enviar(
          `✅ Pagamento confirmado!\n\n` +
          `✨ Acesso autorizado! O aluguel está ativo.\n\n` +
          `🔓 Todos os comandos foram liberados conforme o plano contratado.`
        );
      }
      //====

      if (isAntilinkgp && isGroup && isBotGroupAdmins && !isGroupAdmins) {
        if (Procurar_String.includes("chat.whatsapp.com/")) {
          if (isBot) return;
          let link_dgp = await gebe.groupInviteCode(from);
          if (Procurar_String.match(link_dgp)) return enviar('Link do nosso grupo, não irei remover.. ');

          // Apaga a mensagem do usuário
          await gebe.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });

          // Remove o usuário do grupo
          if (JSON.stringify(groupMembers).includes(sender)) {
            await gebe.groupParticipantsUpdate(from, [sender], 'remove');
          }

          await enviar(`Usuário removido por enviar link de grupo!`);
        }
      }

   

      if (isAutofigu && isGroup) {
        async function autofiguf() {
          setTimeout(async () => {

            if (body.includes(`${prefix}sticker`) || body.includes(`${prefix}s`) || body.includes(`${prefix}fsticker`) || body.includes(`${prefix}f`) || body.includes(`${prefix}fstiker`)) return

            if (type == 'imageMessage') {
              let pack = `↧ [🤖] Criada por:\n• ↳ ${botName}\n—\n↧ [🕵🏻‍♂️] Proprietário:\n• ↳ ${donoName}`
              let author2 = `↧ [👤] Feito por:\n• ↳ ${pushname}\n—\n↧ [☁️] Grupo:\n• ↳ ${groupName}`
              let owgi = await getFileBuffer(info.message.imageMessage, 'image')
              let encmediaa = await sendImageAsSticker2(gebe, from, owgi, info, { packname: pack, author: author2 })
              DLT_FL(encmediaa)
            }
            if (type == 'videoMessage') {
              if ((isMedia && info.message.videoMessage.seconds < 10)) {
                let pack = `↧ [🤖] Criada por:\n• ↳ ${botName}\n—\n↧ [🕵🏻‍♂️] Proprietário:\n• ↳ ${donoName}`
                let author2 = `↧ [👤] Feito por:\n• ↳ ${pushname}\n—\n↧ [☁️] Grupo:\n• ↳ ${groupName}`
                let owgi = await getFileBuffer(info.message.videoMessage, 'video')
                let encmedia = await sendVideoAsSticker2(gebe, from, owgi, info, { packname: pack, author: author2 })
                DLT_FL(encmedia)
              }
            }
          }, 1000)
        }
        autofiguf().catch(e => {
          console.log(e)
        })
      };

  

      // Anti Sticker
      if (isAntiSticker && isBotGroupAdmins && type === 'stickerMessage') {
        if (info.key.fromMe) return; // ignora mensagens do bot
        if (isGroupAdmins) {
          await gebe.sendMessage(from, { text: '⚠️ Administradores não podem enviar stickers proibidos!' }, { quoted: seloMeta });
          return;
        }

        // Deleta o sticker enviado
        if (IS_DELETE) {
          setTimeout(() => {
            gebe.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
          }, 500);
        }

        // Remove usuário do grupo
        if (JSON.stringify(groupMembers).includes(sender)) {
          await gebe.groupParticipantsUpdate(from, [sender], 'remove');
        }
      }

      // Anti Document
      if (Antidoc && isBotGroupAdmins && type === 'documentMessage') {
        if (info.key.fromMe) return; // ignora mensagens do bot
        if (isGroupAdmins) {
          await gebe.sendMessage(from, { text: '⚠️ Administradores não podem enviar documentos proibidos!' }, { quoted: seloMeta });
          return;
        }

        // Envia legenda se configurada
        if (dataGp[0].legenda_documento && dataGp[0].legenda_documento !== "0") {
          await gebe.sendMessage(from, { text: dataGp[0].legenda_documento }, { quoted: seloMeta });
        }

        // Deleta o documento enviado
        if (IS_DELETE) {
          setTimeout(() => {
            gebe.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
          }, 500);
        }

        // Remove usuário do grupo
        if (JSON.stringify(groupMembers).includes(sender)) {
          await gebe.groupParticipantsUpdate(from, [sender], 'remove');
        }
      }

      //============FIMMMMM=========\\

      //==========ABAIXO FICA AONDE VOCE VAI BOTAR TODOS OS COMANDOS===\\
      switch (cmd) {

        //============AQUI FICA OS MENUS ========\\
        case 'menu': {
          reagir(from, "😼")
          await gebe.sendMessage(from, { image: { url: fotomenu }, caption: menu(donoName, botName, prefixo, sender) }, { quoted: seloMeta });
          break;
        }
        case 'menu_sem_prefixo': {
          reagir(from, "🏧")
          await gebe.sendMessage(from, { image: { url: fotomenu }, caption: menuSemP(donoName, botName, prefixo, sender) }, { quoted: seloMeta });
          break;
        }
        case 'menudono': {
          if (!SoDono) return enviar(resposta.dono)
          reagir(from, "😜")
          await gebe.sendMessage(from, { image: { url: fotomenu }, caption: menuDono(donoName, botName, prefixo, sender) }, { quoted: seloMeta });
          break;
        }
        case 'menuadm': {
          if (!isGroupAdmins) return enviar(resposta.adm)
          reagir(from, "😛")
          await gebe.sendMessage(from, { image: { url: fotomenu }, caption: menuAdm(donoName, botName, prefixo, sender) }, { quoted: seloMeta });
          break;
        }


        //========FIMMMMMM======\\

        //=======COMANDOS ALEATÓRIOS======\\

        case 'recrutar': {
          if (!isGroup) return enviar(resposta.grupo)
          if (!q) return enviar("❓ Cadê o número do usuário que você deseja convidar?")

          // limpar número digitado
          let rcrt = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

          // gerar link do grupo
          let linkgc = await gebe.groupInviteCode(from)

          // pegar nome de quem usou o comando
          let convidador = pushname || m.sender.split('@')[0]

          // mensagem simples de convite
          let msgConvite = {
            text: `👋 *Olá, tudo bem?*\n\nVocê foi convidado(a) por *${convidador}* para participar do grupo.\n\n👉 Clique aqui para entrar:\nhttps://chat.whatsapp.com/${linkgc}`
          }

          try {
            await gebe.sendMessage(rcrt, msgConvite) // envia convite no pv
            enviar(`✅ Convite enviado com sucesso para o privado de *@${q.replace(/[^0-9]/g, "")}*`, { mentions: [rcrt] })
          } catch (e) {
            enviar("⚠️ Não foi possível enviar o convite. O usuário pode não estar disponível no WhatsApp.")
          }
          break;
        }

        case "calculadora":
        case "calcular":
        case "calc": {
          if (!q)
            return enviar("Digite uma expressão para calcular, exemplo: 5+5");
          try {
            let expressao = q
              .replace(/x/gi, "*")
              .replace(/÷/g, "/")
              .replace(/[^0-9\-+*/().]/g, "");
            let resultado = eval(expressao);
            if (resultado === undefined) return enviar("Expressão inválida.");
            enviar(`Resultado: ${resultado}`);
          } catch (err) {
            enviar("Erro ao calcular. Verifique a expressão.");
          }
          break;
        }
        case 'criador':
        case 'SheickDoSertao': {
          // Número do dono do bot
          const numeroDono = '557197135969'; // Substitua pelo seu número com DDI + DDD, sem sinais
          const nomeDono = 'SheickDoSertao 💖'; // Nome que aparecerá no vCard

          // vCard formatado
          const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${nomeDono}
TEL;type=CELL;type=VOICE;waid=${numeroDono}:${numeroDono}
END:VCARD`;

          // Enviando o vCard
          await gebe.sendMessage(from, {
            contacts: {
              displayName: nomeDono,
              contacts: [{ vcard }]
            }
          }, { quoted: seloMeta });
        }
          break;
      
      case 'estatistica': {
        try {
          const stats = {
            punhetas: Math.floor(Math.random() * 2000),
            sexo: Math.floor(Math.random() * 800),
            nudesRecebidos: Math.floor(Math.random() * 1000),
            nudesEnviados: Math.floor(Math.random() * 700),
            packsVistos: Math.floor(Math.random() * 1200),
            pornoVisto: Math.floor(Math.random() * 3000),
            gemidasOuvidas: Math.floor(Math.random() * 500),
            hentaiAssistido: Math.floor(Math.random() * 1500),
            gemidoTomado: Math.floor(Math.random() * 300),
            viradasNoLuv: Math.floor(Math.random() * 600),
            punhetaMental: Math.floor(Math.random() * 1000),
            roleNoturno: Math.floor(Math.random() * 400),
            travecoVisto: Math.floor(Math.random() * 200),
            punhetasNoBanho: Math.floor(Math.random() * 700),
            noitesSemDormir: Math.floor(Math.random() * 250),
          };

          const PikaDoGebe = `
╭──❰ 📊 𝗘𝗦𝗧𝗔𝗗𝗜́𝗦𝗧𝗜𝗖𝗔𝗦 +𝟭𝟴 ❱──╮
│😈 *Punhetas batidas:* ${stats.punhetas}
│🍑 *Sexo feito:* ${stats.sexo}
│📸 *Nudes recebidos:* ${stats.nudesRecebidos}
│📤 *Nudes enviados:* ${stats.nudesEnviados}
│📦 *Packs vistos:* ${stats.packsVistos}
│🎞️ *Pornôs assistidos:* ${stats.pornoVisto}
│🔊 *Gemidas ouvidas:* ${stats.gemidasOuvidas}
│👀 *Hentai assistido:* ${stats.hentaiAssistido}
│🔈 *Gemido tomado:* ${stats.gemidoTomado}
│💦 *Punheta mental:* ${stats.punhetaMental}
│🛁 *Punhetas no banho:* ${stats.punhetasNoBanho}
│🌙 *Role noturno safado:* ${stats.roleNoturno}
│👩‍❤️‍👨 *Viradas no "luv":* ${stats.viradasNoLuv}
│👧 *Traveco que viu e fingiu que não:* ${stats.travecoVisto}
│🌚 *Noites sem dormir pós punheta:* ${stats.noitesSemDormir}
╰────────────────────────────╯
`;

          enviar(PikaDoGebe);
        } catch (e) {
          console.error(e);
          enviar('❌ Ocorreu um erro ao gerar as estatísticas 😔');
        }
        break;
      }

    case 'ping': {
        reagir(from, '⚡️')

        let r = (Date.now() / 1000) - info.messageTimestamp
        let uptime = process.uptime()

        let ping = `${tempo}, Usuário: ${sender.split("@")[0]}\n\n🖥 *Sistema operacional:* ${infoSystem.type()}\n⚙️ *Versão:* ${infoSystem.release()}\n⏰️ *Horario atual:* ${hora}\n📆 *Data atual:* ${data}\n🤖 *Tempo online:* ${kyun(uptime)}\n📊 *Comandos totais:* ${totalcmds}\n🗂 *Memoria ram total:* ${(infoSystem.totalmem() / Math.pow(1024, 3)).toFixed(2)} GB\n🗂 *Memoria ram livre:* ${(infoSystem.freemem() / Math.pow(1024, 3)).toFixed(2)} GB`

        await gebe.sendMessage(
          from, {
          image: {
            url: `https://i.postimg.cc/HW0LnShL/imagembot.png` // apenas o banner
          },
          caption: ping
        }, {
          quoted: seloMeta
        }
        )
        break;
      }

    case 'avalie': {
        const avalie = body.slice(8)
        if (!q) return enviar(`Exemplo: avalie "muito bom, parabéns. "`)
        if (args.length >= 400) return gebe.sendMessage(from, { text: 'Máximo 400 caracteres' }, { quoted: seloMeta })
        var nomor = info.participant
        tdptls = `[ Avaliação ]\nwa.me/${sender.split("@s.whatsapp.net")[0]}\nMensagem: ${avalie}`
        gebe.sendMessage(donofc, { text: tdptls }, { quoted: seloMeta })
        enviar("Mensagem enviada ao meu dono, obrigado pela avaliação, iremos melhorar a cada dia.")
        break
      }
    case 'sugestão':
    case 'sugestao': {
        const sugestao = body.slice(prefix.length + args.length + 1); // pega o texto depois do comando
        if (!sugestao) return enviar(`Exemplo: ${prefix}sugestao "Opa, crie um comando tal..."`);
        if (sugestao.length > 800) return gebe.sendMessage(from, { text: 'Máximo 800 caracteres' }, { quoted: info });

        const sug = `[ Sugestões de Novos Comandos ]\n@${sender.split("@")[0]}\nMensagem: ${sugestao}`;

        // envia para o dono, mencionando o usuário que enviou
        await gebe.sendMessage(donofc, { text: sug, mentions: [sender] }, { quoted: seloMeta });

        enviar("Mensagem enviada ao meu dono, obrigado pela sugestão!");
        break;
      }
    case 'infodono': {
        const criador = `
『 *INFO DO MEU DONO* 』
╭─▹
┊ ➩ 👨🏻‍💻 NOME: Sheick Do Sertao
┊ ➩ 🆔️ IDADE: 40
┊ ➩ 🇧🇷 ORIGEM: BRASILEIRO
┊ ➩ 💬 RECADO: GOOD BOY 
┊ ➩ 📆 DATA: ${data}
┊ ➩ 📊 TOTAL CMDS: ${totalcmds}
╰──▹`
        reagir(from, "ℹ️")
        gebe.sendMessage(from, {
          image: { url: 'https://files.catbox.moe/5190o7.jpg' },
          caption: criador
        }, { quoted: seloMeta })
        break
      }

    case "fakechat":
    case "fakemsg": {
        if (!isGroup) return enviar(resposta.grupo);
        var [repplace, tarrget, bott] = q.split("|");
        var m_ =
          info.message.extendedTextMessage &&
            info.message.extendedTextMessage.contextInfo &&
            info.message.extendedTextMessage.contextInfo.mentionedJid ?
            info.message.extendedTextMessage.contextInfo.mentionedJid[0] :
            null;
        if (m_ && tarrget && bott) {
          gebe.sendMessage(
            from, { text: bott }, {
            quoted: {
              key: { fromMe: false, participant: m_ },
              message: { conversation: tarrget },
            },
          },
          );
        } else {
          enviar(
            `Crie mensagens fakes com qualquer uma pessoa! Explicando abaixo:\n—\n• Você precisaria mencionar a pessoa e adicionar a mensagem que ele supostamente iria enviar e que você responderia a seguinte mensagem, todos usando a *|* para separar o que foi pedido dito nesse textinho...\n• *Ex:* ${prefix + comando} @vitima|msg1|msg2`,
          );
        }
        break;
      }
    //============AQUI FICA O COMANDO DE ADM======\\

    case "totag":
    case "cita":
    case "hidetag": {
        if (!isGroup) return enviar(resposta.grupo);
        if (!isGroupAdmins) return enviar(resposta.adm);
        const groupMembersIds = groupMembers.map(u => u.id);
        const qmsg = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const msgUser = q ? q : `Marcação do(a) Adm: ${pushname}`;
        if (qmsg) {
          await gebe.sendMessage(from, {
            forward: { key: info.message.extendedTextMessage.contextInfo, message: qmsg },
            mentions: groupMembersIds,
            caption: msgUser
          }, { quoted: seloMeta });
        } else {
          await gebe.sendMessage(from, {
            text: msgUser,
            mentions: groupMembersIds
          }, { quoted: seloMeta });
        }
        break;
      }
    case "linkgp":
    case "linkgroup": {
        if (!isBotGroupAdmins) {
          return enviar("Desculpe, só executo isso se eu for admin.");
        }
        if (!isGroup) return enviar(resposta.grupo);
        if (!isGroupAdmins) return enviar(resposta.adm);
        let linkgc = await gebe.groupInviteCode(from);
        enviar(`https://chat.whatsapp.com/` + linkgc);
        break;
      }

    case "limpar": {
        if (!isGroup) return enviar("*OPS, SO PODE SER USADO EM GRUPOS*");
        if (!isGroupAdmins) {
          return enviar("SAI DAI MACACO SEM ADM, SO ADM PODE USAR VEY*");
        }
        if (!isBotGroupAdmins) return enviar(`*${botName} precisa de adm 🥺*`);
        enviar("Função limpar em desenvolvimento ou não implementada.");
        break;
      }
    case 'add':
    case 'unkick': {
        if (!isGroupAdmins) return enviar('você não é um administrador.')
        if (!isBotGroupAdmins) return enviar('Para adicionar alguém eu preciso ser adm.')
        if (!q && info.message.extendedTextMessage === null) return enviar('Marque a mensagem ou coloque o número de quem você quer adicionar no grupo.')
        try {
          useradd = `${args.join(" ").replace(/\D/g, '')}` ? `${args.join(" ").replace(/\D/g, '')}` : info.message.extendedTextMessage.contextInfo.participant
          let id = `${useradd.replace(/\D/g, '')}`
          if (!id) return enviar(`Número inválido.`)
          let [result] = await gebe.onWhatsApp(id)
          if (!result) return enviar(`Esse número não está registrado no WhatsApp.`)
          let response = await gebe.groupParticipantsUpdate(from, [result.jid], "add")
          if (response[0].status == "409") {
            gebe.sendMessage(from, { text: `contato já está no grupo, patrão!`, mentions: [result.jid, sender] })
          } else if (response[0].status == "403") {
            gebe.sendMessage(from, { text: `Não consegui adicionar ${result.jid.split("@")[0]} porque privou a conta.`, mentions: [result.jid, sender] })
          } else if (response[0].status == "408") {
            gebe.sendMessage(from, { text: `Não consegui adicionar ${result.jid.split("@")[0]} porque saiu do grupo.`, mentions: [result.jid, sender] })
          } else if (response[0].status == "401") {
            gebe.sendMessage(from, { text: `Não consegui adicionar ${result.jid.split("@")[0]} porque me bloqueou.`, mentions: [result.jid, sender] })
          } else if (response[0].status == "200") return enviar('Prontinho, adicionado com sucesso.')
        } catch (e) {
          console.log("[ERROR]:" + e)
        }
        break
      }
    
        case 'ban':
         case 'banir':
          case 'kick': {
      if (!isGroupAdmins) return enviar('você não é um administrador.')
      if (!isBotGroupAdmins) return enviar('Para remover alguém eu preciso ser adm.')
      try {
        if (!menc_os2 || menc_jid2[1]) return enviar("Marque a mensagem do usuário ou marque o @ dele.., lembre de só marcar um usuário...")
        if (!JSON.stringify(groupMembers).includes(menc_os2)) return enviar("Este usuário já foi removido do grupo ou saiu.")
        if (botNumber.includes(menc_os2)) return enviar('Não sou besta de remover eu mesmo né 🙁, mas estou decepcionado com você.')
        if (JSON.stringify(NumeroDono).indexOf(menc_os2) >= 0) return enviar('Não posso remover meu dono 🤧')
        enviar(`@${menc_os2.split("@")[0]} removido com sucesso.`)
        gebe.groupParticipantsUpdate(from, [menc_os2], "remove")
      } catch (e) {
        console.log(e)
      }
      break
    }
        case 'promover': {
      if (!isGroupAdmins) return enviar('você não é um administrador.')
      if (!isBotGroupAdmins) return enviar('Para promover alguém eu preciso ser adm.')
      if (!menc_os2 || menc_jid2[1]) return enviar("Marque a mensagem do usuário ou marque o @ dele.., lembre de só marcar um usuário...")
      if (!JSON.stringify(groupMembers).includes(menc_os2)) return enviar("Este usuário foi removido do grupo ou saiu, não será possível promover..")
      gebe.sendMessage(from, { text: `@${menc_os2.split("@")[0]} promovido com sucesso.`, mentions: [menc_os2] })
      gebe.groupParticipantsUpdate(from, [menc_os2], "promote")
      break
    }
        case 'rebaixar': {
      if (!isGroupAdmins) return enviar('você não é um administrador.')
      if (!isBotGroupAdmins) return enviar('Para rebaixar alguém eu preciso ser adm.')
      if (!menc_os2 || menc_jid2[1]) return enviar("Marque a mensagem do usuário ou marque o @ dele.., lembre de só marcar um usuário...")
      if (!JSON.stringify(groupMembers).includes(menc_os2)) return enviar("Este usuário foi removido do grupo ou saiu, não será possível rebaixar..")
      gebe.sendMessage(from, { text: `@${menc_os2.split("@")[0]} rebaixado com sucesso.`, mentions: [menc_os2] })
      gebe.groupParticipantsUpdate(from, [menc_os2], "demote")
      break
    }
        case "marcar": { // Adicione esta chave de abertura
      if (!isGroup) return enviar(resposta.grupo);
      if (!isGroupAdmins) return enviar(resposta.adm);
      if (!isBotGroupAdmins) return enviar(resposta.botadm);

      const groupMetadata = await gebe.groupMetadata(from);
      const participants = groupMetadata.participants;
      const groupAdmins = groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id);

      const somembros = participants.filter(v => !groupAdmins.includes(v.id)).map(v => v.id);

      async function marcac() {
        if (somembros.length === 0) {
          return enviar(
            `❌️ Olá *${pushname}* - Não contém nenhum membro comum no grupo, apenas administradores. `
          );
        }

        let blad = `• Mencionando os membros comuns do grupo ou de uma comunidade. ${!q ? "" : `\n*Mensagem:* ${q}`}\n\n`;
        let bla = [];

        for (const i of somembros) {
          blad += `» @${i.split("@")[0]}\n`;
          bla.push(i);
        }

        await gebe.sendMessage(from, {
          text: blad,
          mentions: bla
        }, { quoted: seloMeta });
      }

      marcac().catch((e) => {
        console.log(e);
        enviar("❌ Ocorreu um erro ao marcar os membros.");
      });
      break;
    } // E adicione esta chave de fechamento

 case "marcar2": {
      try {
        if (!isGroup) return enviar(resposta.grupo);
        if (!isGroupAdmins) return enviar(resposta.adm);
        if (q.includes(`${prefix}`))
          return enviar("Não pode utilizar comandos nesse comando.");
        members_id = [];
        teks = args.length > 1 ? body.slice(8).trim() : "";
        teks += "";
        for (let mem of groupMembers) {
          teks += `╠➥ @${mem.id.split("@")[0]}\n`;
          members_id.push(mem.id);
        }
        enviar(teks);
      } catch {
        enviar("Erro ao mencionar.");
      }
      break;
    }
        case "marcarwa": {
      try {
        if (!isGroup) return enviar(resposta.grupo);
        if (!isGroupAdmins) return enviar(resposta.adm);
        if (q.includes(`${prefix}`))
          return enviar("Não pode utilizar comandos nesse comando");
        members_id = [];
        teks = args.length > 1 ? body.slice(10).trim() : "";
        teks += "";
        for (let mem of groupMembers) {
          teks += `╠➥ https://wa.me/${mem.id.split("@")[0]}\n`;
          members_id.push(mem.id);
        }
        gebe.sendMessage(from, { text: teks }, { quoted: seloMeta });
      } catch {
        enviar("Erro ao mencionar.");
      }
      break;
    }
        //========ATIVAÇÕES DE ADM=======\\

        case 'antilinkgp': {
      if (!isGroup) return enviar(resposta.grupo)
      if (!isGroupAdmins) return enviar(resposta.adm)
      if (!isBotGroupAdmins) return enviar(resposta.botadm)
      if (args.length < 1) return enviar('1 pra ligar / 0 pra desligar')
      if (Number(args[0]) === 1) {
        if (isAntilinkgp) return enviar('O recurso de antilink de grupo já está ativado.')
        dataGp[0].antilinkgp = true
        setGp(dataGp)
        enviar('Ativou com sucesso o recurso de antilink de grupo.')
      } else if (Number(args[0]) === 0) {
        if (!isAntilinkgp) return enviar('O recurso de antilink de grupo já está desativado.')
        dataGp[0].antilinkgp = false
        setGp(dataGp)
        enviar('Desativou com sucesso o recurso de antilink de grupo.')
      } else {
        enviar('1 para ativar, 0 para desativar')
      }
      break
    }
        case 'autofigu':
        case 'autosticker': {
      if (!isGroup) return enviar(resposta.grupo)
      if (!isGroupAdmins) return enviar(resposta.adm)
      if (!isBotGroupAdmins) return enviar(resposta.botadm)
      if (args.length < 1) return enviar('1 pra ligar / 0 pra desligar')
      if (Number(args[0]) === 1) {
        if (isAutofigu) return enviar('Ja esta ativo')
        dataGp[0].autosticker = true
        setGp(dataGp)
        enviar('Ativou com sucesso o recurso de auto figurinhas neste grupo.')
      } else if (Number(args[0]) === 0) {
        if (!isAutofigu) return enviar('Ja esta Desativado')
        dataGp[0].autosticker = false
        setGp(dataGp)
        enviar('Desativou com sucesso o recurso de auto figurinhas neste grupo.️')
      } else {
        enviar('1 para ativar, 0 para desativar')
      }
      break
    }
        case 'antisticker': {
      if (!isGroup) return enviar(resposta.grupo)
      if (!isGroupAdmins) return enviar(resposta.adm)
      if (!isBotGroupAdmins) return enviar(resposta.botadm)
      if (args.length < 1) return enviar('Hmmmm')
      if (Number(args[0]) === 1) {
        if (isAntiSticker) return enviar('O recurso de anti sticker já está ativado.')
        dataGp[0].antisticker = true
        setGp(dataGp)
        enviar('Ativou com sucesso o recurso de anti sticker neste grupo.')
      } else if (Number(args[0]) === 0) {
        if (!isAntiSticker) return enviar('O recurso de anti sticker já está desativado.')
        dataGp[0].antisticker = false
        setGp(dataGp)
        enviar('Desativou com sucesso o recurso de anti sticker neste grupo.')
      } else {
        enviar('1 para ativar, 0 para desativar')
      }
      break
    }
        //=======FIM DA ATIVAÇÕES=====\\

        //=========FIMMM====\\

        //======================COMANDOS DE FIGURINHAS======\\
        case 'sticker':
        case 's': {
      reagir(from, "✅️")
      let RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
      let boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage
      let boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage
      if (boij2) {
        let pack = `↧ [👑] » Criador (a) da Figurinha:\n• ↳ ${pushname} owner\n—\n↧ [🩵] » Visite nosso Instagram:\n• ↳ instagram.com/Gebezkz`
        owgi = await getFileBuffer(boij2, 'image')
        let encmediaa = await sendImageAsSticker2(gebe, from, owgi, info, { packname: pack })
        await DLT_FL(encmediaa)
      } else if (boij && boij.seconds < 11) {
        let pack = `↧ [👑] » Criador (a) da Figurinha:\n• ↳ ${pushname} owner\n—\n↧ [🩵] » Visite nosso Instagram:\n• ↳ instagram.com/Gebezkz`
        owgi = await getFileBuffer(boij, 'video')
        let encmedia = await sendVideoAsSticker2(gebe, from, owgi, info, { packname: pack })
        await DLT_FL(encmedia)
      } else {
        reagir(from, "❌️")
        return enviar(`Marque uma imagem, ou um vídeo de ate 9.9 segundos.`)
      }
      break
    }
        case 'toimg': {
      reagir(from, "✅️")
      try {
        buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker')
        gebe.sendMessage(from, { image: buff }, { quoted: seloMeta }).catch(e => {
          console.log(e);
          enviar('*erro ao converter para imagem.*')
        });
      } catch (e) {
        console.log(e)
        reagir(from, "❌️")
      }
      break
    }
        case 'rename':
        case 'roubar': {
      reagir(from, "✅️")
      var kls = q
      var pack = kls.split("|")[0];
      var author2 = kls.split("|")[1];
      if (!q) return enviar('*Falta um nome para renomear a figurinha.*')
      if (!pack) return enviar(`*Necessita de um nome antes da barra ( | )*`)
      renameContextSticker(pack, author2, `RENOMEADA COM SUCESSO`, seloMeta)
        .catch((err) => {
          reagir(from, "❌️")
          enviar(`❌ Erro, tente mais tarde`);
        })
      break
    }
        case 'figu-random': {
      if (!q) return enviar('cadê a quantidade?')
      if (!q > 10) return enviar('O limite máximo é de 10 figurinhas!');
      enviar('Enviando suas figurinhas..')
      async function eitamundobon() {
        gebe.sendMessage(from, { sticker: { url: `https://neon-apis.shop/api/figu-aleatoria` } })
      }
      for (i = 0; i < q; i++) {
        await esperar(500)
        eitamundobon()
      }
      break
    }
        case 'figu-raiva': {
      if (!q) return enviar('cadê a quantidade?')
      if (!q > 10) return enviar('O limite máximo é de 10 figurinhas!');
      enviar('Enviando suas figurinhas..')
      async function eitamundoraiva() {
        gebe.sendMessage(from, { sticker: { url: `https://neon-apis.shop/api/figu-raiva` } })
      }
      for (i = 0; i < q; i++) {
        await esperar(500)
        eitamundoraiva()
      }
      break
    }
        case 'figu-desenho': {
      if (!q) return enviar('cadê a quantidade?')
      if (!q > 10) return enviar('O limite máximo é de 10 figurinhas!');
      enviar('Enviando suas figurinhas..')
      await esperar(1000)
      async function eitamundobcvxx() {
        gebe.sendMessage(from, { sticker: { url: `https://neon-apis.shop/api/figu-desenho` } })
      }
      for (i = 0; i < q; i++) {
        await esperar(500)
        eitamundobcvxx()
      }
      break
    }
        case 'figu-flork': {
      if (!q) return enviar('cadê a quantidade?')
      if (!q > 10) return enviar('O limite máximo é de 10 figurinhas!');
      enviar('Enviando suas figurinhas..')
      await esperar(1000)
      async function eitamundoflork() {
        gebe.sendMessage(from, { sticker: { url: `https://neon-apis.shop/api/figu-flork` } })
      }
      for (i = 0; i < q; i++) {
        await esperar(500)
        eitamundoflork()
      }
      break
    }
        case 'figu-roblox': {
      if (!q) return enviar('cadê a quantidade?')
      if (!q > 10) return enviar('O limite máximo é de 10 figurinhas!');
      enviar('Enviando suas figurinhas..')
      await esperar(1000)
      async function eitamundoroblox() {
        gebe.sendMessage(from, { sticker: { url: `https://neon-apis.shop/api/figu-roblox` } })
      }
      for (i = 0; i < q; i++) {
        await esperar(500)
        eitamundoroblox()
      }
      break
    }
        case 'figu-anime': {
      if (!q) return enviar('cadê a quantidade?')
      if (!q > 10) return enviar('O limite máximo é de 10 figurinhas!');
      enviar('Enviando suas figurinhas..')
      await esperar(1000)
      async function eitxmundobom() {
        gebe.sendMessage(from, { sticker: { url: `https://neon-apis.shop/api/figu-anime` } })
      }
      for (i = 0; i < q; i++) {
        await esperar(500)
        eitxmundobom()
      }
      break
    }
        case 'figu-coreana': {
      if (!q) return enviar('cadê a quantidade?')
      if (!q > 10) return enviar('O limite máximo é de 10 figurinhas!');
      enviar('Enviando suas figurinhas..')
      await esperar(1000)
      async function eitamxndobom() {
        gebe.sendMessage(from, { sticker: { url: `https://neon-apis.shop/api/figu-coreana` } })
      }
      for (i = 0; i < q; i++) {
        await esperar(500)
        eitamxndobom()
      }
      break
    }
        case 'figu-animais': {
      if (!q) return enviar('cadê a quantidade?')
      if (!q > 10) return enviar('O limite máximo é de 10 figurinhas!');
      enviar('Enviando suas figurinhas..')
      await esperar(1000)
      async function eitamundoruim() {
        gebe.sendMessage(from, { sticker: { url: `https://neon-apis.shop/api/figu-animais` } })
      }
      for (i = 0; i < q; i++) {
        await esperar(500)
        eitamundoruim()
      }
      break
    }
        case 'figu-engracada': {
      if (!q) return enviar('cadê a quantidade?')
      if (!q > 10) return enviar('O limite máximo é de 10 figurinhas!');
      enviar('Enviando suas figurinhas..')
      await esperar(1000)
      async function eitamunzzbom() {
        gebe.sendMessage(from, { sticker: { url: `https://neon-apis.shop/api/figu-engracada` } })
      }
      for (i = 0; i < q; i++) {
        await esperar(500)
        eitamunzzbom()
      }
      break
    }
        case 'figu-emojis': {
      if (!q) return enviar('cadê a quantidade?')
      if (!q > 10) return enviar('O limite máximo é de 10 figurinhas!');
      enviar('Enviando suas figurinhas..')
      await esperar(1000)
      async function eitamundobebe() {
        gebe.sendMessage(from, { sticker: { url: `https://neon-apis.shop/api/figu-emoji` } })
      }
      for (i = 0; i < q; i++) {
        await esperar(500)
        eitamundobebe()
      }
      break
    }
        //===========FIMMMMMM=====\\

        //=========AQUI FICA OS COMANDOS QUE NECESSITAM DE API======= \\

        case 'spoilers': {
      (async () => {
        if (!args[0]) {
          await enviar('Envie o nome do filme ou série para eu procurar spoilers sobre ele');
          return;
        }

        // junta os argumentos em um título
        const titulo = args.join(" ");

        // checagem básica pra evitar inputs estranhos ou ofensivos
        if (titulo.length > 60) {
          await enviar("⚠️ O nome está muito grande, tente algo mais curto.");
          return;
        }

        await enviar(`🔎 Procurando spoilers sobre: *${titulo}*...`);

        try {
          // busca o artigo na Wikipédia
          const searchUrl = `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(titulo)}&utf8=&format=json`;
          const searchRes = await axios.get(searchUrl);

          if (!searchRes.data.query.search.length) {
            await enviar('😢 Não encontrei esse título na Wikipédia.');
            return;
          }

          // pega o primeiro resultado e gera o link correto
          const pageTitle = searchRes.data.query.search[0].title.replace(/ /g, "_");
          const pageUrl = `https://pt.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;

          // carrega o HTML da página
          const { data } = await axios.get(pageUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
          });

          const $ = cheerio.load(data);
          let texto = '';

          // pega os 3 primeiros parágrafos
          $('#mw-content-text .mw-parser-output > p').each((i, elem) => {
            if (i < 3) {
              texto += $(elem).text().trim() + "\n\n";
            }
          });

          if (!texto.trim()) {
            await enviar('😢 Não encontrei spoilers para esse título.');
            return;
          }

          await enviar(`📖 Spoilers (Wikipédia) de *${titulo}*:\n\n${texto}\n🔗 ${pageUrl}`);

        } catch (e) {
          console.error("Erro no comando spoilers:", e.message);
          await enviar('⚠️ Ocorreu um erro ao buscar spoilers.');
        }
      })();
      break;
    }
        case 'youtube': {
      if (!q) return enviar(`❌ Use: ${prefix}youtube nome do vídeo\nEx: ${prefix}youtube Gebe`);

      try {
        const search = await yts(q);
        const videos = search.videos.slice(0, 5); // Pega os 5 primeiros resultados

        if (videos.length === 0) {
          return enviar('❌ Nenhum resultado encontrado no YouTube.');
        }

        let texto = `📺 *Resultados do YouTube*\n🔍 *Pesquisa:* ${q}\n\n`;

        for (const video of videos) {
          const title = video.title || 'Sem título';
          const canal = video.author.name || 'Desconhecido';
          const duracao = video.duration || 'Indefinida';
          const url = video.url || '#';

          texto += `📌 *${title}*\n`;
          texto += `👤 Canal: ${canal}\n`;
          texto += `🕒 Duração: ${duracao}\n`;
          texto += `🔗 Link: ${url}\n\n`;
        }

        enviar(texto.trim());
      } catch (e) {
        console.error('Erro ao buscar vídeos no YouTube:', e);
        enviar('❌ Erro ao buscar vídeos no YouTube.');
      }

      break;
    }

        case 'gerar': {
      if (!q) return enviar(`❌ Use: ${prefix}gerar um gato fofo`);

      try {
        // A lógica de geração de imagem é feita internamente pelo bot.
        // O prompt será passado diretamente para a ferramenta de geração.
        const imageUrl = await image_generation.generate_images({
          prompts: [`${q}`],
          image_generation_usecase: image_generation.ImageGenerationUsecase.ALTERNATIVES
        });

        if (!imageUrl) {
          return enviar("❌ Ocorreu um erro ao gerar a imagem.");
        }

        await gebe.sendMessage(from, {
          image: { url: imageUrl },
          caption: `🧠 *Imagem Gerada com IA*\n\n📝 Texto: ${q}`
        }, { quoted: seloMeta });

      } catch (e) {
        console.error('Erro ao gerar a imagem:', e);
        enviar('❌ Ocorreu um erro ao gerar a imagem.');
      }

      break;
    }
        case 'audiomeme': {
      if (!q) {
        // Se não houver termo de busca, mostre as opções
        const categorias = Object.keys(audioMemes).join(', ');
        return enviar(`🎵 Use assim: ${prefix}audiomeme nome-do-meme\n\nCategorias disponíveis: ${categorias}`);
      }

      try {
        const categoria = q.toLowerCase();

        // Verifica se a categoria existe no seu banco de dados local
        if (!audioMemes[categoria]) {
          return enviar('❌ Nenhum áudio encontrado nessa categoria.');
        }

        // Pega um áudio aleatório da lista
        const lista = audioMemes[categoria];
        const aleatorio = lista[Math.floor(Math.random() * lista.length)];

        // Envia o áudio
        const audioData = await axios.get(aleatorio, { responseType: 'arraybuffer' });

        await gebe.sendMessage(from, {
          audio: audioData.data,
          mimetype: 'audio/mp4',
          ptt: true
        }, { quoted: seloMeta });

      } catch (e) {
        console.error('Erro ao buscar ou enviar o áudio:', e);
        enviar('❌ Erro ao buscar ou enviar o áudio. Tente novamente mais tarde.');
      }
      break;
    }
    
        case 'toglibh': {
      if (!q) return enviar(`🎨 Use assim: ${prefix}toglibh texto da imagem\n🧸 Ex: ${prefix}toglibh um gato fofo`);

      try {
        // A lógica de geração de imagem é feita internamente pelo bot.
        // O prompt deve ser em inglês.
        // A ferramenta é chamada com o seu prompt e o estilo "Ghibli".

        // O prompt "um gato fofo" foi traduzido para "a cute cat"
        // e o estilo "Ghibli style" foi adicionado.

        // A ferramenta retornará o link para a imagem gerada.
        const imageUrl = await tool.image_generation.generate_images({
          prompts: [`A cute cat in Ghibli style`],
          image_generation_usecase: 'alternatives'
        });

        if (!imageUrl) {
          return enviar("❌ Erro ao gerar a imagem no estilo Ghibli.");
        }

        await gebe.sendMessage(from, {
          image: { url: imageUrl },
          caption: `🌸 *Imagem no estilo Ghibli gerada com:*\n_${q}_`
        }, { quoted: seloMeta });

      } catch (e) {
        console.error('Erro ao gerar imagem Ghibli:', e);
        enviar('❌ Erro ao gerar imagem Ghibli.');
      }
      break;
    }
        // ========= FIM DA SOLUÇÃO COM FERRAMENTA INTERNA =========


        // Substitua o trecho antigo do seu código por este:
        // ========= INÍCIO DA SOLUÇÃO COM YTDL-CORE =========
        case 'play':
        case 'tocar': {
      if (!q) return enviar("❌ | Envie o nome da música que deseja buscar!");

      try {
        const search = await yts(q);
        const video = search.videos[0];

        if (!video) {
          return enviar("❌ | Não foi possível encontrar essa música.");
        }

        const videoUrl = video.url;
        const videoTitle = video.title;
        const thumbnailUrl = video.thumbnail;

        // Envia a thumbnail e o título do vídeo
        await gebe.sendMessage(from, {
          image: { url: thumbnailUrl },
          caption: `🎵 *${videoTitle}*`
        }, { quoted: seloMeta });

        // Baixa o áudio do vídeo com a biblioteca ytdl-core
        const stream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });

        // Envia o áudio como uma mensagem de voz
        await gebe.sendMessage(from, {
          audio: stream,
          mimetype: 'audio/mpeg'
        }, { quoted: seloMeta });

      } catch (err) {
        console.error("Erro ao processar o comando 'play':", err);
        return enviar("❌ | Ocorreu um erro ao buscar o áudio. Tente novamente mais tarde.");
      }
    }
    break;
        // ========= FIM DA SOLUÇÃO COM YTDL-CORE =========

        case 'play_video':
        case 'playvideo': {
      if (!q) {
        return await gebe.sendMessage(from, {
          text: `🎵 Use assim: ${prefix}playvideo nome da música\n📽️ Ex: ${prefix}playvideo melo de perdida`
        }, { quoted: seloMeta });
      }

      try {
        const search = await yts(q);
        const video = search.videos[0];

        if (!video) {
          return await gebe.sendMessage(from, { text: '❌ Nenhum resultado encontrado.' }, { quoted: seloMeta });
        }

        const info = `🎶 *${video.title}*\n\n` +
          `📺 *Canal:* ${video.author.name}\n` +
          `📊 *Views:* ${video.views.toLocaleString()}\n` +
          `⏱️ *Duração:* ${video.duration}\n` +
          `🔗 *Link:* ${video.url}\n\n`;

        await gebe.sendMessage(from, {
          image: { url: video.thumbnail },
          caption: info
        }, { quoted: seloMeta });

      } catch (e) {
        console.error('Erro ao buscar vídeo:', e);
        await gebe.sendMessage(from, { text: '❌ Erro ao buscar vídeo. Tente novamente mais tarde.' }, { quoted: seloMeta });
      }

      break;
    }

        case 'ytmp4': {
      if (!q) return enviar(`🎥 Use assim: ${prefix}ytmp4 link_do_youtube\n📌 Ex: ${prefix}ytmp4 https://www.youtube.com/watch?v=0O7nK2XSjAs`);

      // Verifica se o link é válido
      const isValidUrl = ytdl.validateURL(q);
      if (!isValidUrl) {
        return enviar('❌ O link do YouTube é inválido. Por favor, envie um link válido.');
      }

      try {
        const stream = ytdl(q, { filter: format => format.container === 'mp4' && format.hasAudio && format.hasVideo, quality: 'highest' });

        // Obter metadados do vídeo para a legenda
        const videoInfo = await ytdl.getInfo(q);
        const videoTitle = videoInfo.videoDetails.title;

        // Envia o vídeo
        await gebe.sendMessage(from, {
          video: stream,
          caption: `🎬 *${videoTitle}*`
        }, { quoted: seloMeta });

      } catch (e) {
        console.error('Erro ao baixar vídeo:', e);
        enviar('❌ Erro ao baixar vídeo. O vídeo pode ter restrições, ou a URL pode estar incorreta.');
      }
      break;
    }

        case 'pinterest': {
      if (!q) return enviar(`🔎 Use assim: ${prefix}pinterest tema/palavra\n📌 Ex: ${prefix}pinterest gato`);

      try {
        const url = `https://br.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        const $ = cheerio.load(data);
        const images = [];

        $('img').each((i, element) => {
          const src = $(element).attr('src');
          if (src && src.startsWith('https://i.pinimg.com/')) {
            images.push(src);
          }
        });

        if (images.length === 0) {
          return enviar('❌ Nenhum resultado encontrado no Pinterest.');
        }

        const randomIndex = Math.floor(Math.random() * images.length);
        const imageUrl = images[randomIndex];

        await gebe.sendMessage(from, {
          image: { url: imageUrl },
          caption: `🖼️ Resultado de: *${q}*`
        }, { quoted: seloMeta });

      } catch (e) {
        console.error('Erro ao buscar imagem no Pinterest:', e);
        enviar('❌ Erro ao buscar imagem no Pinterest. Tente novamente mais tarde.');
      }
      break;
    }

        case 'gemini': {
      if (!q) return enviar("❌ | Envie uma pergunta para a IA Gemini.");

      try {
        const genAI = new GoogleGenerativeAI("SUA_CHAVE_AQUI"); // Substitua pela sua chave de API
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(q);
        const response = await result.response;
        let respostaIA = response.text();

        if (!respostaIA) {
          return enviar("🤖 | A IA Gemini não retornou nenhuma resposta.");
        }

        enviar(`🌐 *Gemini responde:*\n\n${respostaIA}`);
      } catch (e) {
        console.error('Erro ao consultar Gemini:', e);
        enviar("❌ | Ocorreu um erro ao consultar a IA Gemini.");
      }
    }
    break;

        case 'xvideo': {
      if (!q) return enviar('🔞 *Digite o termo para buscar no Xvideos.*\nEx: novinha, milf, hentai...');

      try {
        const url = `https://www.xvideos.com/?k=${encodeURIComponent(q.replace(/\s+/g, '+'))}`;
        const { data } = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        const $ = cheerio.load(data);
        const videos = [];

        $('#content .mozaique > div').each((i, element) => {
          const title = $(element).find('.thumb a').attr('title');
          const link = 'https://www.xvideos.com' + $(element).find('.thumb a').attr('href');
          const duration = $(element).find('.duration').text().trim();

          if (title && link && videos.length < 5) {
            videos.push({ title, link, duration });
          }
        });

        if (videos.length === 0) {
          return enviar('❌ Nenhum vídeo encontrado com esse termo.');
        }

        let texto = `🔞 *Resultados encontrados para:* _${q}_\n\n`;
        videos.forEach((video, i) => {
          texto += `🍑 *${i + 1}.* ${video.title}\n`;
          if (video.duration) texto += `⏱️ Duração: ${video.duration}\n`;
          texto += `🔗 Link: ${video.link}\n\n`;
        });

        enviar(texto.trim());

      } catch (e) {
        console.error('Erro ao buscar resultados do Xvideos:', e);
        enviar('❌ Erro ao buscar resultados.\nTente novamente mais tarde.');
      }
      break;
    }

        case 'aptoide': {
      if (!q) return enviar(`👾 Use assim: ${prefix}aptoide nome-do-app\n📱 Ex: ${prefix}aptoide pou`);

      try {
        const url = `https://en.aptoide.com/search?query=${encodeURIComponent(q)}`;

        const { data } = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        const $ = cheerio.load(data);

        const appElement = $('.app-info').first();

        if (appElement.length === 0) {
          return enviar('❌ Nenhum resultado encontrado na Aptoide.');
        }

        const appName = appElement.find('.app-name').text().trim();
        const appDeveloper = appElement.find('.app-developer').text().trim();
        const downloadLink = appElement.find('.app-download-link').attr('href');
        const imageUrl = appElement.find('.app-icon').attr('src');

        if (!appName || !downloadLink) {
          return enviar('❌ Não foi possível extrair os dados do aplicativo.');
        }

        let resposta = `📲 *Resultado da Aptoide:*\n\n`;
        resposta += `🔹 *Nome:* ${appName}\n`;
        resposta += `👤 *Desenvolvedor:* ${appDeveloper}\n`;
        resposta += `📥 *Download:* ${downloadLink}`;

        await gebe.sendMessage(from, {
          image: { url: imageUrl },
          caption: resposta
        }, { quoted: seloMeta });

      } catch (e) {
        console.error('Erro ao buscar dados da Aptoide:', e);
        enviar('❌ Erro ao buscar dados da Aptoide. Tente novamente mais tarde.');
      }
      break;
    }

        //==========≈======FIMMMMM=========\\

        //==========AQUI FIXA OS COMANDOS DE DONO======\\

        case 'bloquear': {
      if (!SoDono) return enviar("Esse comando é exclusivo do dono do bot!");

      let numero = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
      if (!q) return enviar("Use: bloqueiar 5581 resto do numero");

      try {
        await gebe.updateBlockStatus(numero, 'block');
        enviar(`✅ Número bloqueado com sucesso: ${q}`);
      } catch (e) {
        console.log(e);
        enviar("❌ Ocorreu um erro ao tentar bloquear.");
      }
    }
    break;//by gebe

        case 'clonar':
        case 'clone': {
      if (!SoDono) return enviar('❌ Apenas o proprietário pode usar este comando.');
      if (!isGroup) return enviar(resposta.grupo);

      // Obtém os metadados do grupo em tempo real para ter os dados mais recentes
      const groupMetadata = await gebe.groupMetadata(from);
      const getGroupAdmins = (participants) => {
        let admins = [];
        for (let i of participants) {
          if (i.admin == 'admin' || i.admin == 'superadmin') admins.push(i.id);
        }
        return admins;
      };
      const groupAdmins = getGroupAdmins(groupMetadata.participants);

      // Agora, verificamos se o bot está na lista de administradores mais recente
      const isBotGroupAdmins = groupAdmins.includes(botNumber);

      if (!isBotGroupAdmins) {
        return enviar('❌ Preciso de permissão de administrador para usar este comando.');
      }

      // Pega a menção diretamente do objeto 'info'
      const jidDaMencao = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

      if (!jidDaMencao) {
        return enviar(`📌 Marque a pessoa que deseja clonar.\n\n*Exemplo:* ${prefixo}clonar @user`);
      }

      try {
        const urlFoto = await gebe.profilePictureUrl(jidDaMencao, 'image');

        if (!urlFoto) {
          return enviar('⚠️ Não consegui pegar a foto. O usuário pode não ter foto de perfil.');
        }

        const { data } = await axios.get(urlFoto, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(data);

        await gebe.sendMessage(from, { image: buffer, caption: `📸 Foto clonada de @${jidDaMencao.split('@')[0]}` }, { mentions: [jidDaMencao] });

      } catch (e) {
        console.error('Erro ao clonar perfil:', e);
        return enviar('⚠️ Ocorreu um erro ao tentar clonar a foto. Tente novamente.');
      }
    }
    break;
        case 'aluguel':
    if (!SoDono) return enviar(resposta.dono);
    if (!isGroup) return enviar(resposta.grupo)
    dataGp[0]['rg_aluguel'] = !dataGp[0]['rg_aluguel'];
    setGp(dataGp)
    enviar(dataGp[0]['rg_aluguel'] ? `Ativado com sucesso, agora use o comando: ${prefix}rg_aluguel\nOu então o comando ${prefix}infoaluguel pra saber como usar o resto.` : "Desativado com sucesso.")
    break;

        case 'aluguel_global':
    if (!SoDono) return enviar(resposta.dono);
    nescessario.rg_aluguelGB = !nescessario.rg_aluguelGB
    setNes(nescessario)
    enviar(nescessario?.rg_aluguelGB ? `Ativado com sucesso, agora use o comando: ${prefix}rg_aluguel\nOu então o comando ${prefix}infoaluguel pra saber como usar o resto.` : "Desativado com sucesso..")
    break;

        case 'renovar_aluguel':
    if (!SoDono) return enviar(resposta.dono);
    var ID_G = rg_aluguel.findIndex(i => i.id_gp == from)
    if (rg_aluguel.some(i => i.id_gp != from)) return enviar(`Este grupo não está na lista de aluguel, use: ${prefix}listaaluguel pra ver os grupos que estão registrado.`)
    if (q.trim().length > 1 && (q.trim().includes("d") || q.trim().includes("h")) && q.trim().includes("/")) {
      var TMP_A = Math.floor(Date.now() / 1000)
      var TEMPO = (q.trim().includes("h") ? Math.floor(q.trim().split("/")[1].split("h")[0]) * 60 * 60 : Math.floor(q.trim().split("/")[1].split("d")[0]) * 60 * 60 * 24);
      rg_aluguel[ID_G].vencimento = TMP_A + TEMPO
      fs.writeFileSync("./Gebe-Banker/lib/json/rg_aluguel.json", JSON.stringify(rg_aluguel, null, 2));
      enviar(`Este grupo foi renovado, e vai vencer em: ${kyun(Math.floor(rg_aluguel[ID_G].vencimento - TMP_A))}, caso queira tirar este grupo da lista de aluguel antes do tempo, use: ${prefix}rm_aluguel ${from}`)
    } else {
      enviar(`Exemplo: ${prefix + cmd} /24h ou Exemplo: ${prefix + cmd} /30d\n\nCom d é dias, e h é horas, então boa sorte..`)
    }
    break;

        case 'rg_aluguel':
        case 'rgaluguel':
    if (!SoDono) return enviar(resposta.dono);
    if (!nescessario?.rg_aluguelGB && !dataGp[0]["rg_aluguel"]) return enviar(`Você não ativou o sistema de aluguel para esse grupo, nem global.. Leia como utilizar em ${prefix}infoaluguel\n\nBoa sorte.`)
    if (q.trim().length > 1 && (q.trim().includes("d") || q.trim().includes("h")) && q.trim().includes("/")) {
      let TMP_A = Math.floor(Date.now() / 1000)
      let TEMPO = (q.trim().includes("h") ? Math.floor(q.trim().split("/")[1].split("h")[0]) * 60 * 60 : Math.floor(q.trim().split("/")[1].split("d")[0]) * 60 * 60 * 24);
      let ID_G = rg_aluguel.findIndex(i => i.id_gp == from);
      if (ID_G === -1) {
        rg_aluguel.push({ id_gp: from, nome_: groupName || pushname, vencimento: TMP_A + TEMPO });
        fs.writeFileSync("./Gebe-Banker/lib/json/rg_aluguel.json", JSON.stringify(rg_aluguel, null, 2));
        await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo
        ID_G = rg_aluguel.findIndex(i => i.id_gp == from); // Atualiza o valor de ID_G
        enviar(`Este grupo/usuario foi registrado com sucesso, e vai vencer em: ${kyun(Math.floor(rg_aluguel[ID_G].vencimento) - TMP_A)}, caso queira tirar este grupo da lista de aluguel antes do tempo, use: ${prefix}rm_aluguel ${from}\n\nSe deseja ver a lista de Usuarios/Grupos, use: ${prefix}listaaluguel`);
      } else {
        enviar(`Este grupo já está registrado, e vai vencer em: ${kyun(Math.floor(rg_aluguel[ID_G].vencimento) - TMP_A)}, caso queira tirar este grupo da lista de aluguel antes do tempo, use: ${prefix}rm_aluguel ${from}`);
      }
    } else {
      enviar(`Exemplo: ${prefix + cmd} /24h ou Exemplo: ${prefix + cmd} /30d\n\nCom d é dias, e h é horas, então boa sorte..`);
    }
    break;


        case 'rm_aluguel': case 'rmaluguel':
    if (!SoDono) return enviar(resposta.dono);
    if (q.trim().length < 4) return enviar(`Use o comando ${prefix + cmd} ${from}\nAssim removerá este grupo da listaaluguel`)
    var ID_R = rg_aluguel.findIndex(i => i.id_gp == q.trim())
    if (!rg_aluguel.map(i => i.id_gp).includes(q.trim())) return enviar(`Este grupo não está na lista de aluguel, use: ${prefix}listaaluguel pra ver os grupos que estão registrado.`)
    rg_aluguel.splice(ID_R, 1)
    fs.writeFileSync("./Gebe-Banker/lib/json/rg_aluguel.json", JSON.stringify(rg_aluguel, null, 2));
    enviar(`Grupo/Usuario tirado com sucesso da lista de aluguel, não irei mais funcionar aqui.`)
    break;

        case 'listaaluguel': case 'lista_aluguel':
    if (!SoDono) return enviar(resposta.dono);
    if (rg_aluguel?.length === 0) return enviar("Não contém nenhum usuario/grupo na lista de aluguel...")
    var TMP = Math.floor(Date.now() / 1000)
    ABC = "Lista de Usuarios/Grupos:\n\n"
    for (var i of rg_aluguel) {
      ABC += `ID: ${i?.id_gp}\nNome: ${i.nome_}\nVencimento: ${kyun(Math.floor(i.vencimento) - TMP)}\n-----------------------------------------\n`
    }
    enviar(ABC)
    break;


        case 'reiniciar':
    if (!SoDono) return enviar("esse comando e exclusivo para meu dono")
    enviar("Reiniciando o sistema, em segundos já estarei de volta senhor(a) as suas ordens!")
    setTimeout(async () => { process.exit() }, 1200)
    break//by gebe                

        case 'limparqr':
    try {
      if (!SoDono) return enviar('apenas meu dono')
      const limparPasta = (caminho) => {
        fs.readdir(caminho, (err, arquivos) => {
          if (err) { console.error('Erro ao ler os arquivos da pasta:', err); return; }
          const arquivosDeletados = arquivos.filter((arquivo) => {
            return /sender|pre-key|session/i.test(arquivo);
          });
          arquivosDeletados.forEach((arquivo) => {
            fs.unlink(`${caminho}/${arquivo}`, (err) => {
              if (err) {
                console.error(`Erro ao deletar o arquivo ${arquivo}:`, err);
                return;
              }
            });
          });
          enviar(`${arquivosDeletados.length} arquivo(s) deletado(s) com sucesso.`);
        });
      };
      await limparPasta(`./Gebe-Banker/Gebe-Conect`);
    } catch (e) {
      console.log(e);
      await enviar(`Ocorreu um erro`);
      await gebe.sendMessage(nmrdn, { text: `oii mestre, desculpa lhe incomodar, mas ocorreu um erro aqui\n\nComando: ${prefix}${cmd}\nErro: ${String(e)}` });
    }
    break

        case "rvisu":
        case "open":
        case "revelar":
    if (!SoDono) return enviar(resposta.dono)
    try {
      // tenta pegar a mensagem marcada
      const quoted =
        info.message?.extendedTextMessage?.contextInfo?.quotedMessage || {};

      // detecta se é mídia viewOnce (V1 ou V2)
      const viewOnce =
        quoted?.viewOnceMessage ||
        quoted?.viewOnceMessageV2 ||
        info.message?.viewOnceMessage ||
        info.message?.viewOnceMessageV2;

      // conteúdo interno da mídia
      const content = viewOnce?.message || quoted || info.message;

      // tipos de mídia suportados
      const image = content?.imageMessage;
      const video = content?.videoMessage;
      const audio = content?.audioMessage;
      const sticker = content?.stickerMessage;

      const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

      // função pra baixar mídia
      async function getBuffer(media, tipo) {
        const stream = await downloadContentFromMessage(media, tipo);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
      }

      // 🔎 verifica qual mídia foi marcada
      if (video) {
        await reagir(from, "🎥", seloMeta);
        const buffer = await getBuffer(video, "video");
        await gebe.sendMessage(
          from,
          { video: buffer, caption: "🎥 Aqui está o vídeo revelado!" },
          { quoted: seloMeta }
        );
        await reagir(from, "✅", seloMeta);

      } else if (image) {
        await reagir(from, "🖼️", seloMeta);
        const buffer = await getBuffer(image, "image");
        await gebe.sendMessage(
          from,
          { image: buffer, caption: "🖼️ Aqui está a imagem revelada!" },
          { quoted: seloMeta }
        );
        await reagir(from, "✅", seloMeta);

      } else if (audio) {
        await reagir(from, "🎧", seloMeta);
        const buffer = await getBuffer(audio, "audio");
        await gebe.sendMessage(
          from,
          { audio: buffer, mimetype: "audio/mp4", ptt: true },
          { quoted: seloMeta }
        );
        await reagir(from, "✅", seloMeta);

      } else if (sticker) {
        await reagir(from, "🌟", seloMeta);
        const buffer = await getBuffer(sticker, "sticker");
        await gebe.sendMessage(
          from,
          { sticker: buffer },
          { quoted: seloMeta }
        );
        await reagir(from, "✅", seloMeta);

      } else {
        await reply(
          from,
          "📌 Marque uma mídia de *visualização única* (imagem, vídeo, áudio ou figurinha) para eu revelar!",
          seloMeta
        );
      }

    } catch (e) {
      console.error("[RVISU ERRO]", e.message || e);
      await reply(from, "❌ Não consegui revelar a mídia. Tente novamente.", seloMeta);
      await reagir(from, "❌", seloMeta);
    }
    break;

        case "totalcmd":
    if (!SoDono) {
      return (enviarAd(seTocaMenino), errorReact(), erroDono());
    }
    try {
      const fileContent = fs.readFileSync("index.js", "utf-8");
      const caseNames =
        fileContent.match(/case\s+['"]([^'"]+)['"]/g) || [];
      const cont = caseNames.length;
      gebe.sendMessage(
        from,
        {
          text: `Atualmente, existem ${cont} comandos registrados no ${botName}`,
        },
        { quoted: seloMeta },
      );
    } catch (error) {
      console.error("Erro ao obter o total de comandos:", error);
      encamError();
    }
    break;

        case "boton":
        case "botoff":
    if (!SoDono) return enviar(resposta.dono);
    if (!isBotoff) {
      nescessario.botoff = true;
      setNes(nescessario);
      enviar(
        "Desativando funções e parando a execução de comandos por membros com sucesso...",
      );
    } else if (isBotoff) {
      nescessario.botoff = false;
      setNes(nescessario);
      enviar(`Ativando todos os funcionamentos do bot novamente...`);
    }
    break;

        case 'bangp':
        case 'unbangp':
    if (!isGroup) return enviar(resposta.grupo)
    if (!SoDono) return enviar(resposta.dono)
    if (cmd == 'bangp') {
      if (isBanchat) return enviar(`Este grupo ja está banido`)
      dataGp[0].bangp = true
      setGp(dataGp)
      enviar(`Grupo banido com sucesso`)
    } else {
      if (!isBanchat) return enviar(`Este grupo não está mais banido`)
      dataGp[0].bangp = false
      setGp(dataGp)
      enviar(`Grupo desbanido...`)
    }
    break

        case 'prefixo-bot': case 'setprefix':
    if (!IsDono) return enviar('exclusivo apenas para meu dono.')
    if (!q) return enviar('cade o simbolo?')
    setting.prefixo = q
    fs.writeFileSync('./dono/settings.json', JSON.stringify(setting, null, 2))
    enviar(`O prefixo foi alterado com sucesso para: ${setting.prefixo}`)
    setTimeout(async () => {
      setTimeout(async () => {
        process.exit()
      }, 1200)
    }, 1000)
    break

        case 'nome-bot':
    if (!IsDono) return enviar('exclusivo apenas para meu dono.')
    if (!q) return enviar('cade o nome?')
    setting.botName = q
    fs.writeFileSync('./dono/settings.json', JSON.stringify(setting, null, 2))
    enviar(`Meu nome foi alterado com sucesso para: ${q}`)
    setTimeout(async () => {
      setTimeout(async () => {
        process.exit()
      }, 1200)
    }, 1000)
    break

        case 'nick-dono':
    if (!IsDono) return enviar('exclusivo apenas para meu dono.')
    if (!q) return enviar('cade o nome?')
    setting.donoName = q
    fs.writeFileSync('./dono/settings.json', JSON.stringify(setting, null, 2))
    enviar(`O nick do dono foi configurado para: ${q}`)
    setTimeout(async () => {
      setTimeout(async () => {
        process.exit()
      }, 1200)
    }, 1000)
    break

        case 'numero-dono':
    if (!IsDono) return enviar('exclusivo apenas para meu dono.')
    if (!q) return enviar('cade o numero?')
    if (q.match(/[a-z]/i)) return enviar("É apenas números.")
    enviar(`O número dono foi configurado com sucesso para: ${q}`)
    setting.NumeroDono = q
    fs.writeFileSync('./dono/settings.json', JSON.stringify(setting, null, 2))
    setTimeout(async () => {
      setTimeout(async () => {
        process.exit()
      }, 1200)
    }, 1000)
    break

        //============FIMMMMM=======\\

        //======== AQUI FICA OS +18 ======\\
        case 'plaq1':
    if (!q) return enviar(`Cadê o nick?`)
    enviar('Estou processando..')
    gebe.sendMessage(from, { image: { url: `https://neon-apis.shop/api/plaq1?texto=${q}` } }, { quoted: seloMeta })
    break

        case 'plaq2':
    if (!q) return enviar(`Cadê o nick?`)
    enviar('Estou processando..')
    gebe.sendMessage(from, { image: { url: `https://neon-apis.shop/api/plaq2?texto=${q}` } }, { quoted: seloMeta })
    break

        case 'plaq3':
    if (!q) return enviar(`Cadê o nick?`)
    enviar('Estou processando..')
    gebe.sendMessage(from, { image: { url: `https://neon-apis.shop/api/plaq3?texto=${q}` } }, { quoted: seloMeta })
    break

        case 'plaq4':
    if (!q) return enviar(`Cadê o nick?`)
    enviar('Estou processando..')
    gebe.sendMessage(from, { image: { url: `https://neon-apis.shop/api/plaq4?texto=${q}` } }, { quoted: seloMeta })
    break

        case 'plaq5':
    if (!q) return enviar(`Cadê o nick?`)
    enviar('Estou processando..')
    gebe.sendMessage(from, { image: { url: `https://neon-apis.shop/api/plaq5?texto=${q}` } }, { quoted: seloMeta })
    break

        case "only1": //by: gebe
    enviar(`*Acabei de te enviar no PV 🤭*`);
    only1 = `
Luiz russo (mansão maromba)
⌠🌐⌡> https://t.me/+8cJ7yGnq5fI2YjYx
`;
    gebe.sendMessage(sender, { text: only1 }, { quoted: seloMeta });
    break;

        case "only2":
    enviar(`*Acabei de te enviar no PV 🤭*`);
    only2 = `
Luiza blue 
⌠🌐⌡> https://t.me/+JaX8wY_45843ZTBh
`;
    gebe.sendMessage(sender, { text: only2 }, { quoted: seloMeta });
    break;

case "only3":
    enviar(`*Acabei de te enviar no PV 🤭*`);
    const only3 = `
Isadora vale 
⌠🌐⌡> https://t.me/+smb4i0bxRl41ZjRh
`;
    gebe.sendMessage(sender, { text: only3 }, { quoted: seloMeta });
    break;

        case "only4":
    enviar(`*Acabei de te enviar no PV 🤭*`);
    const only4 = `
Ingrid bianchi
⌠🌐⌡> https://t.me/+RJtf2TqTQ8NjZjlh
`;
    gebe.sendMessage(sender, { text: only4 }, { quoted: seloMeta });
    break;

        case "only5":
    enviar(`*Acabei de te enviar no PV 🤭*`);
    const only5 = `
Lizy Donato 
⌠🌐⌡> https://t.me/+gmSjm2WZnb41OGEx
`;
    gebe.sendMessage(sender, { text: only5 }, { quoted: seloMeta });
    break;
      
        //========FIMMM====\\
        //========AQUI FICA A LOJINHA DE ALUGAR BOT======\\

            case 'lojinha':
            case 'loja': {
      const lojaMsg = `
              🎪💖 *LOJINHA VIP - ${botName}* 💖🎪
              ━━━━━━━━━━━━━━━━━━━━━━

              ✨ *PLANOS FIXOS* ✨
              💎 Semanal → R$10  
              💎 Mensal → R$25  
              💎 Anual → R$150  

              ━━━━━━━━━━━━━━━━━━━━━━

              ✨ *PLANOS VARIÁVEIS* ✨
              ⏱️ Por hora → R$0,50  
              📅 Por dia → R$2,00  

              ━━━━━━━━━━━━━━━━━━━━━━

              💸 *Pagamento via PIX* 💸
              Chave PIX: 51998710999

              Após o pagamento, envie o comprovante no PV do dono:
              wa.me/${NumeroDono}

              Assim que confirmado, o bot será ativado no seu grupo!

              ━━━━━━━━━━━━━━━━━━━━━━

              🕹️ *BENEFÍCIOS VIP* 🕹️
              ✔️ Comandos exclusivos  
              ✔️ Figurinhas animadas  
              ✔️ Prioridade no suporte  
              ✔️ Surpresas do ${botName} 🎭

              ━━━━━━━━━━━━━━━━━━━━━━

              🎀 *Escolha seu plano, faça o PIX e divirta-se!* 🎀
              `;

      await gebe.sendMessage(from, { text: lojaMsg });
      break;
    }
            case 'alugar': {
      if (!isGroup) return enviar("❌ Este comando só pode ser usado em grupos.");
      const duracao = q.trim();
      gerarPagamentoAluguel(from, groupName || pushname, duracao, enviar);
      break;
            }

        default:
    if (isCmd) {
      enviar(`
                                        ╔═══════════════════════════════╗
                                        ║ ⚡✨ ${botName} ✨⚡
                                        ║
                                        ║ ❌ 𝘾𝙤𝙢𝙖𝙣𝙙𝙤 𝙣𝙖̃𝙤 𝙚𝙣𝙘𝙤𝙣𝙩𝙧𝙖𝙙𝙤 ❌
                                        ║
                                        ║ 🕵️‍♂️ Você se perdeu no labirinto dos comandos...
                                        ║ 🖤 Tente outro comando válido para continuar
                                        ║
                                        ║ 🌌 Siga a trilha certa e tudo ficará claro
                                        ╚════════════════════════╝
    `)

      break;
    }

    

    
   
    let text = (body || '').trim();
    let partes = text.split(' '); // separa por espaço
    let comando = partes[0].toLowerCase(); // primeira palavra
    //===========FIMMMM========\\

    //========== IF DE QUANDO ALGUEM FALAR O NOME GEBE ELE REAGIR COM STICKER==\\
    if (body.toLowerCase() === 'SheickDoSertao') {
      // Caminho do arquivo da figurinha
      let stickerPath = './Gebe-Banker/sticker/figurinhas/gebe.webp'; // coloque o caminho real do seu arquivo .webp

      await gebe.sendMessage(from, {
        sticker: fs.readFileSync(stickerPath)
      }, { quoted: seloMeta });
    }

    if (body.toLowerCase() === 'SheickDoSerta') {
      // Caminho do arquivo da figurinha
      let stickerPath = './Gebe-Banker/sticker/figurinhas/gebe.webp'; // coloque o caminho real do seu arquivo .webp

      await gebe.sendMessage(from, {
        sticker: fs.readFileSync(stickerPath)
      }, { quoted: seloMeta });
    };
    //============FIMMMMM==============\\

    ///========= IF DE PLAY=========\\
    if (comando === 'play' || comando === 'tocar') {
      if (!q) return enviar("❌ | Envie o nome da música que deseja buscar!");

      try {
        // Busca o vídeo no YouTube com a biblioteca yt-search
        const search = await yts(q);
        const video = search.videos[0]; // Pega o primeiro resultado

        if (!video) {
          return enviar("❌ | Não foi possível encontrar esse áudio.");
        }

        const videoUrl = video.url;
        const videoTitle = video.title;
        const thumbnailUrl = video.thumbnail;

        // Envia a thumbnail (miniatura) e o título do vídeo primeiro
        await gebe.sendMessage(from, {
          image: { url: thumbnailUrl },
          caption: `🎵 *${videoTitle}*`
        }, { quoted: seloMeta });

        // Baixa o áudio do vídeo com a biblioteca ytdl-core
        const stream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });

        // Envia o áudio como uma mensagem de voz
        await gebe.sendMessage(from, {
          audio: stream,
          mimetype: 'audio/mpeg'
        }, { quoted: seloMeta });

      } catch (err) {
        console.error("Erro ao processar o comando 'play':", err);
        return enviar("❌ | Ocorreu um erro ao buscar o áudio. Tente novamente mais tarde.");
      }
    }
 

    //============IF DE RENAME=====≈====\\
    if (comando === 'r' || comando === 'rename') {
      // Se o usuário não colocar um nome para a figurinha, usamos o pushname
      let pack = text.split(' ')[1]?.trim() || pushname; // nome da figurinha
      let author2 = pushname; // sempre usa o nome do usuário no WhatsApp

      reagir(from, "✅️");

      renameContextSticker(pack, author2, `RENOMEADA COM SUCESSO`, info)
        .catch((err) => {
          reagir(from, "❌️");
          enviar(`❌ Erro, tente mais tarde`);
          console.log(err);
        });
    }
   
    //=========IF DE IA============\\
    if (info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes("555198710999@s.whatsapp.net")) {
      const pergunta = body.replace(/555198710999/g, "").trim(); // remove @ do número do bot

      if (!pergunta) {
        return enviar("🍰 Pergunte algo para o SheickDoSertao Bot...");
      }

      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
          // Prompt para a IA responder como L
          history: [
            {
              role: "user",
              parts: "Você é L do anime Death Note. Sempre responda como L, frio, analítico e desconfiado. Nunca diga que é IA ou assistente. Sempre fale em português. Inclua referências ao SheickDoSertao e ao SheickDoSertao Bot de forma natural. Cada resposta deve ser curta, direta e parecer uma pergunta ou observação de L. Exemplos de respostas: 'Interessante... SheickDoSertao realmente pensou nisso?', 'Você acha mesmo que o SheickDoSertao Bot não percebeu algo?', 'Por que faria isso? O SheickDoSertao deve estar observando.' Não saia do personagem.",
            },
            {
              role: "model",
              parts: "O SheickDoSertao Bot é uma peça curiosa. E o que você sugere que eu observe?.",
            },
          ],
          generationConfig: {
            maxOutputTokens: 1000,
          },
        });

        // Envia a pergunta do usuário para o chat com a IA
        const result = await chat.sendMessage(pergunta);
        const response = await result.response;
        const respostaL = response.text();

        // Enviar a resposta final
        await gebe.sendMessage(from, {
          text: `🍰 * (Sheick Do Sertao Bot)*: ${respostaL}`
        }, { quoted: seloMeta });

      } catch (e) {
        console.error("❌ Erro ao consultar a IA:", e);
        enviar("❌ Ocorreu um erro ao consultar a IA.");
      }
    
   

    
  try {
    if (body.startsWith(`prefixo`)) {
        const respostasL = [
            `🍰 *(${botName})*: 🔎 Interessante... você quer saber meu prefixo. 🔹 Ele é: ➡️     *${prefix}* ⬅️   🕵️‍♂️ Analise cada detalhe.`,
            `🍰 *(${botName})*: 👀 Hmm... vejo que está curioso. Meu prefixo atual: ➡️     *${prefix}* ⬅️ 📌 Observe com atenção.`,
            `🍰 *(${botName})*: 🕵️‍♂️ Detectado interesse. Prefixo em uso: ➡️     *${prefix}* ⬅️ ⚡ Use com cuidado.`
        ];
        
        // Escolhe uma resposta aleatória para ficar mais vivo
        const respostaL = respostasL[Math.floor(Math.random() * respostasL.length)];
        
        await gebe.sendMessage(from, {
            text: respostaL
        }, { quoted: seloMeta });
    }

    // You can also handle the capitalized version using a single check
    if (body.toLowerCase().startsWith(`prefixo`)) {
      const respostasL = [
        `🍰 *(${botName})*: 🔎 Interessante... você quer saber meu prefixo. 🔹 Ele é: ➡️     *${prefix}* ⬅️   🕵️‍♂️ Analise cada detalhe.`,
        `🍰 *(${botName})*: 👀 Hmm... vejo que está curioso. Meu prefixo atual: ➡️     *${prefix}* ⬅️ 📌 Observe com atenção.`,
        `🍰 *(${botName})*: 🕵️‍♂️ Detectado interesse. Prefixo em uso: ➡️     *${prefix}* ⬅️ ⚡ Use com cuidado.`
      ];

      // Escolhe uma resposta aleatória para ficar mais vivo
      const respostaL = respostasL[Math.floor(Math.random() * respostasL.length)];

      await gebe.sendMessage(from, {
        text: respostaL
      }, { quoted: seloMeta });
    }
} catch (error) {
    console.error('Erro ao processar mensagem:', error);
}
}

gebe.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect } = update;
  if (connection === 'open') {
    consoleSucesso('🤖 SheickDoSertao conectada com sucesso!');
  } else if (connection === 'close') {
    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
    if (shouldReconnect) {
      consoleAviso('Tentando reconectar...');
      IniciarGebe();
    } else {
      consoleErro('Desconectado. Finalizando...');
    }
  }
});


IniciarGebe();

fs.watchFile('./index.js', (curr, prev) => {
  if (curr.mtime.getTime() !== prev.mtime.getTime()) {
    consoleAviso(`Código editado, reiniciando..\n`);
    process.exit();
  }
});