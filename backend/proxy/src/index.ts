import "newrelic";
import express from "express";
import cors from 'cors'
import http from "http";
import WebSocket from "ws";

import { logging } from './middleware';
import { download, wellKnown, cashlinks } from './routes';
import { GrpcHandler, WebSocketHandler } from "./service";
import { log } from "./utils/logger";
import { handleRequest } from "./service/handlerHTTP";
import { unexpress } from "./middleware/unexpress";

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || 'https://api.codeinfra.net:443';
const newRelicEnabled = process.env.NEW_RELIC_ENABLED === 'true';
const mode = process.env.NODE_ENV || 'development';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let id = 0; // ID generator
const newId = () => id++;

// Middleware
app.use(cors());
app.use(express.raw({type: '*/*', limit: '1mb'}));
app.use(logging);
app.use(unexpress);

// Routes
app.use('/', cashlinks);
app.use('/download', download);
app.use('/.well-known', wellKnown);

// Health check
app.get('/', (req, res, next) => { res.json({status: 200}) })

// Start service (bidi WS envelopes to GRPC protobufs over HTTP/1)
wss.on("connection", (ws: any, req: any) => {
  const id = newId(); // Assign id to the WebSocket (for logging)
  log.ws_opened({ id, ip: req.socket.remoteAddress });

  // There's a lot of complexity burried in these two seemingly small modules,
  // be careful when refactoring (async iterators, async generators, async queues, etc.)

  const service = new GrpcHandler(id, { baseUrl }); 
  const handler = new WebSocketHandler(ws as WebSocket, service);
  handler.listen();

  ws.on("close", () => {
    log.ws_closed({ id, handler: `${handler.serviceName}.${handler.methodName}` }); 
  });
});

app.post('/v1/api', async (req, res, next) => {
  const id = newId(); // Assign id to the request (for logging)

  // Reusing the GrpcHandler approach from the WebSocket handler
  const service = new GrpcHandler(id, { baseUrl }); 
  await handleRequest(service, req, res);
});

server.listen(port, () => {
  console.log(`\n🚀 Server ready at: http://localhost:${port}\n`);
  console.log(`\t* Running in ${mode} mode`);
  console.log(`\t* NewRelic enabled: ${newRelicEnabled}`);
  console.log(`\t* Log level: ${log.level}\n`);
});