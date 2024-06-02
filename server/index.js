import express from "express";
import { createServer } from "http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux";
import { join } from "path";
import bodyParser from "body-parser";
import { hostname } from "os";
import wisp from "wisp-server-node";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const publicPath = join(__dirname, "../public");
const locked = false; //set this to true if you want to use a password when trying to enter the site

const app = express();
const server = createServer();

app.use(bodyParser.json());
let messages = [];
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
    "ky$",
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
    "pornhub",
    "penis"
  ];
 
  for (const word of filteredWords) {
    if (message.toLowerCase().includes(word)) {
      return null;
    }
  }
  return message;
}
app.post("/sendmessage", (req, res) => {
  const { username, message } = req.body;
  const filteredMessage = filterMessage(message);
  if (!filteredMessage) {
    return res.status(400).send("Message contains prohibited words");
  }
  
  const newMessage = { username, message: filteredMessage };
  messages.push(newMessage);
  res.status(201).send(newMessage);
});

app.get("/messages", (req, res) => {
  res.send(messages);
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
