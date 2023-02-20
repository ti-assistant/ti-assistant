const { createServer } = require("http");
const WebSocket = require("ws");
const { parse } = require("url");
const next = require("next");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer((req, res) =>
    handle(req, res, parse(req.url, true))
  );
  const wss = new WebSocket.Server({ noServer: true });

  const serviceAccount = require("./twilight-imperium-360307-77d3ff625ffc.json");

  initializeApp({
    credential: cert(serviceAccount),
  });

  wss.on("connection", async function connection(ws) {
    // console.log('incoming connection', ws);
    ws.onclose = () => {
      console.log("connection closed", wss.clients.size);
    };

    ws.onmessage = (message) => {
      console.log("Received message: ", message.data);
    };

    ws.send("Just testing");
  });

  server.on("upgrade", function (req, socket, head) {
    const { pathname } = parse(req.url, true);
    if (pathname !== "/_next/webpack-hmr") {
      wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit("connection", ws, req);
      });
    }
  });

  server.listen(8080, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:8080 and ws://localhost:8080`);
  });
});
