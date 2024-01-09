const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { initializeApp, cert } = require("firebase-admin/app");

const HTTP_PORT = 8080;

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, port: HTTP_PORT });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer((req, res) =>
    handle(req, res, parse(req.url, true))
  );
  const env = process.env.NODE_ENV;
  const emulator = process.env.FIRESTORE_EMULATOR_HOST;
  if (env === "production" || !emulator) {
    console.log("Using production Firestore instance");
    const serviceAccount = require("./twilight-imperium-360307-77d3ff625ffc.json");

    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    console.log(`Using Firestore Emulator on ${emulator}`);
    initializeApp();
  }

  server.listen(HTTP_PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${HTTP_PORT}`);
  });
});
