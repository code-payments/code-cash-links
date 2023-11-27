import "newrelic";
import express from "express";
import cors from 'cors'
import http from "http";
import WebSocket from "ws";

import { logging } from './middleware';
import { download, wellKnown, cashlinks } from './routes';
import { GrpcHandler, WebSocketHandler } from "./service";
import { log } from "./utils/logger";

const app = express();
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || 'https://api.codeinfra.net:443';
const newRelicEnabled = process.env.NEW_RELIC_ENABLED === 'true';
const mode = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.raw({type: '*/*', limit: '1mb'}));
app.use(logging);

// Routes
app.use('/', cashlinks);
app.use('/download', download);
app.use('/.well-known', wellKnown);

// Health check
app.get('/', (req, res, next) => { res.json({status: 200}) })

// Start service (bidi WS envelopes to GRPC protobufs over HTTP/1)

let id = 0; // WebSocket id generator (why is this not a built-in WebSocket feature?)
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws: any, req: any) => {
  ws.id = id++; // Assign id to the WebSocket
  log.ws_opened({ id: ws.id, ip: req.socket.remoteAddress });

  // There's a lot of complexity burried in these two seemingly small modules,
  // be careful when refactoring (async iterators, async generators, async queues, etc.)

  const service = new GrpcHandler(ws.id, { baseUrl }); 
  const handler = new WebSocketHandler(ws as WebSocket, service);
  handler.listen();

  ws.on("close", () => {
    log.ws_closed({ id: ws.id, handler: `${handler.serviceName}.${handler.methodName}` }); 
  });
});

server.listen(port, () => {
  console.log(`\n🚀 Server ready at: http://localhost:${port}\n`);
  console.log(`\t* Running in ${mode} mode`);
  console.log(`\t* NewRelic enabled: ${newRelicEnabled}`);
  console.log(`\t* Log level: ${log.level}\n`);
});