import http from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import path from "path";
import express from 'express';

const httpServer = http.createServer();

const app = express();
const PORT = process.env.PORT || 8080

app.use(express.static('src/public/'))
app.get("/", (_req, res) => {
	res.sendFile(path.resolve("src/public/", "index.html"));
  });
const bareServer = createBareServer('/mathhelp/');

httpServer.on('request', (req, res) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeRequest(req, res);
	} else {
		app(req, res);
	}
});

httpServer.on('upgrade', (req, socket, head) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeUpgrade(req, socket, head);
	} else {
		socket.end();
	}
});

httpServer.on('listening', () => {
	console.log('arc online');
});

httpServer.listen({
	port: PORT,
});