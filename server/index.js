import express from "express";
import {
    createServer
} from "http";
import {
    uvPath
} from "@titaniumnetwork-dev/ultraviolet";
import {
    epoxyPath
} from "@mercuryworkshop/epoxy-transport";
import {
    baremuxPath
} from "@mercuryworkshop/bare-mux";
import {
    join
} from "path";
import bodyParser from "body-parser";
import {
    hostname
} from "os";
import wisp from "wisp-server-node";
import {
    Server
} from "socket.io";
import {
    fileURLToPath
} from "url";
import CryptoJS from "crypto-js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const publicPath = join(__dirname, "../public");
const locked = false; //set this to true if you want to use a password when trying to enter the site
const h = "uBNusnsaw93Sfaswd26123";
const app = express();
const server = createServer();

app.use(bodyParser.json());
let messages = [];
function k() {
  return CryptoJS.lib.WordArray.random(16).toString();
}
function e(m, k) {
  return CryptoJS.AES.encrypt(m,k).toString();
}
function d(m, k) {
  return CryptoJS.AES.decrypt(m,k).toString(CryptoJS.enc.Utf8);
}
function ek(k) {
  return CryptoJS.AES.encrypt(k, h).toString();
}
function dk(k) {
  return CryptoJS.AES.decrypt(k, h).toString(CryptoJS.enc.Utf8);
}
function filterWords(message, wordList) {
    const words = message.split(/\s+/);

    function containsBadWord(word) {
        return wordList.some((badWord) => word.toLowerCase().includes(badWord));
    }
    const containsPhrase = words.some((word) => containsBadWord(word));
    if (containsPhrase) {
        return false;
    }
    return true;
}

function filterMessage(message) {
    const filteredWords = [
        "nigga",
        "nigger",
        "n1gga",
        "border hopper",
        "n1gg@",
        "nig",
        "ky and s",
        "k and y and s",
        "ky$",
        "kill yourself",
        "kys",
        "jump off a cliff",
        "kys",
        "killyourself",
        "faggot",
        "killyour$elf",
        "slut",
        "$lut",
        "whore",
        "fag",
        "wh0re",
        "digger",
        "ni@@a",
        "porn",
        "pussy",
        "pornhub",
        "penis",
        "pornkiller",
        "cumslut",
        "whore",
        "eater",
        "kidtoucher",
        "pedo",
        "n1gger",
        "n1gg3r",
        "n1&&3r",
        "chink",
        "chigger",
        "chingchong"
    ];

    for (const word of filteredWords) {
      if (message.toLowerCase().includes(word)) {
          return true;
      }
  }
    return false;
}
app.post("/sendmessage", (req, res) => {
  const {
      username,
      message,
      timestamp
  } = req.body;

  const isFiltered = filterMessage(message);

  if (isFiltered) {
      return res.status(400).send("Message contains prohibited words, USER: " + username);
  }

  const ct = Date.now();

    // Allow a time difference of up to 5 seconds
    const diff = 1000;

    if (Math.abs(ct - timestamp) > diff) {
        return res.status(403).send("Invalid timestamp or attempt to recreate the send event.");
    }

    const ky = k();
    const m = e(message, ky);
    const r = ek(ky);
    const newMessage = {
      username,
      mess: m,
      ke: r,
      timestamp
    };
      messages.push(newMessage);
      res.status(201).send(newMessage);
});

app.get("/messages", (req, res) => {
  const dm = messages.map(msg => {
    const ke = dk(msg.ke);
    const f = d(msg.mess, ke)
      return {
          username: msg.username,
          message: f,
          timestamp: msg.timestamp
      };
  });
  res.send(dm);
});
app.use(express.static(publicPath));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

app.get("/", (_req, res) => {
    res.sendFile(join(publicPath, "index.html"));
});

app.use((_req, res) => {
    res.status(404).sendFile(join(publicPath, "404.html"));
});

server.on("request", (req, res) => {
    if (!req.url.endsWith("/wisp/")) {
        app(req, res);
    }
});

server.on("upgrade", (req, socket2, head) => {
    if (req.url.endsWith("/wisp/")) {
        wisp.routeRequest(req, socket2, head);
    } else {
        socket2.end();
    }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

server.listen(port, () => {
    console.log("Server is listening on port", port);
});



process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close();
    messages = []
    process.exit(0);
}