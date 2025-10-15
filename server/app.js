const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { initializeApp, cert } = require("firebase-admin/app");

const HTTP_PORT = 8080;

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, port: HTTP_PORT });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    const reqUrl = req.url
      .replaceAll(/\[/g, "%5B")
      .replaceAll(/]/g, "%5D")
      .replaceAll("%5b", "%5B")
      .replaceAll("%5d", "%5D")
      .replaceAll("@", "%40");
    handle(req, res, parse(reqUrl, true));
  });
  const env = process.env.NODE_ENV;
  const emulator = process.env.FIRESTORE_EMULATOR_HOST;
  const projectId = process.env.NEXT_PUBLIC_TI_PROJECT;
  if (env === "production" || !emulator) {
    console.log("Using production Firestore instance");
    const serviceAccount = require("./twilight-imperium-360307-ea7cce25efeb.json");

    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    console.log(
      `Using Firestore Emulator on ${emulator} w/ project ${projectId}`
    );
    initializeApp({ projectId });
  }

  server.listen(HTTP_PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${HTTP_PORT}`);
  });
});
