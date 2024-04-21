"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeRequest = void 0;
const Types_1 = require("./Types");
const ws_1 = __importDefault(require("ws"));
const node_net_1 = __importDefault(require("node:net"));
const Packets_1 = __importStar(require("./Packets"));
const wsproxy_1 = require("./wsproxy");
const wss = new ws_1.default.Server({ noServer: true }); // This is for handling upgrades incase the server doesn't handle them before passing it to us
// Accepts either routeRequest(ws) or routeRequest(request, socket, head) like bare
async function routeRequest(wsOrIncomingMessage, socket, head) {
    if (!(wsOrIncomingMessage instanceof ws_1.default) && socket && head) { // Wsproxy is handled here because if we're just passed the websocket then we don't even know it's URL
        // Compatibility with bare like "handle upgrade" syntax
        wss.handleUpgrade(wsOrIncomingMessage, socket, head, (ws) => {
            if (!wsOrIncomingMessage.url?.endsWith("/")) { // if a URL ends with / then its not a wsproxy connection, its wisp
                (0, wsproxy_1.handleWsProxy)(ws, wsOrIncomingMessage.url);
                return;
            }
            routeRequest(ws);
        });
        return;
    }
    if (!(wsOrIncomingMessage instanceof ws_1.default))
        return; // something went wrong, abort
    const ws = wsOrIncomingMessage; // now that we are SURE we have a Websocket object, continue...
    const connections = new Map();
    ws.on("message", (data, isBinary) => {
        try {
            // Ensure that the incoming data is a valid WebSocket message
            if (!Buffer.isBuffer(data) && !(data instanceof ArrayBuffer)) {
                console.error("Invalid WebSocket message data");
                return;
            }
            const wispFrame = Packets_1.default.wispFrameParser(Buffer.from(data));
            // Routing
            if (wispFrame.type == Types_1.CONNECT_TYPE.CONNECT) {
                // CONNECT frame data
                const connectFrame = Packets_1.default.connectPacketParser(wispFrame.payload);
                // Initialize and register Socket that will handle this stream
                const client = new node_net_1.default.Socket();
                client.connect(connectFrame.port, connectFrame.hostname);
                connections.set(wispFrame.streamID, {
                    client: client,
                    buffer: 127,
                });
                // Send Socket's data back to client
                client.on("data", function (data) {
                    ws.send(Packets_1.default.dataPacketMaker(wispFrame, data));
                });
                // close stream if there is some network error
                client.on("error", function () {
                    console.error("Something went wrong");
                    ws.send(Packets_1.default.closePacketMaker(wispFrame, 0x03)); // 0x03 in the WISP protocol is defined as network error
                    connections.delete(wispFrame.streamID);
                });
            }
            if (wispFrame.type == Types_1.CONNECT_TYPE.DATA) {
                const stream = connections.get(wispFrame.streamID);
                stream.client.write(wispFrame.payload);
                stream.buffer--;
                if (stream.buffer == 0) {
                    stream.buffer = 127;
                    ws.send((0, Packets_1.continuePacketMaker)(wispFrame, stream.buffer));
                }
            }
            if (wispFrame.type == Types_1.CONNECT_TYPE.CLOSE) {
                // its joever
                console.log("Client decided to terminate with reason " + new DataView(wispFrame.payload.buffer).getUint8(0));
                connections.get(wispFrame.streamID).client.destroy();
                connections.delete(wispFrame.streamID);
            }
        }
        catch (e) {
            ws.close(); // something went SUPER wrong, like its probably not even a wisp connection
            console.error("WISP incoming message handler error: ");
            console.error(e);
            // cleanup
            for (const { client } of connections.values()) {
                client.destroy();
            }
            connections.clear();
        }
    });
    // Close all open sockets when the WebSocket connection is closed
    ws.on("close", () => {
        for (const { client } of connections.values()) {
            client.destroy();
        }
        connections.clear();
    });
    // SEND the initial continue packet with streamID 0 and 127 queue limit
    ws.send(Packets_1.default.continuePacketMaker({ streamID: 0 }, 127));
}
exports.routeRequest = routeRequest;
exports.default = {
    routeRequest,
};
//# sourceMappingURL=ConnectionHandler.js.map