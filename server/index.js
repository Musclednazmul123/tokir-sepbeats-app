// @ts-check
import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import "dotenv/config";
import validateHMAC from "./middleware/validate-hmac.js";
import route from "./web/route.js";
import api_route from "./web/api.js";
import bodyParser from "body-parser";
import cors from "cors";
import OAuth from './middleware/OAuth.js';
import EventsHelper from "./helpers/EventsHelper.js";

const PORT = parseInt(process.env.PORT || "3822", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});



// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: async (topic, shop, body) => {
    delete ACTIVE_SHOPIFY_SHOPS[shop]
  },
});

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();
  const serveStatic = await import("serve-static").then(
    ({ default: fn }) => fn
  );

  app.use('/pages', express.static('server/public/webapi'));

  const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

  route.use(OAuth);
  app.disable('x-powered-by');
  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));
  app.post("/webhook/*", validateHMAC);
  app.post("/webhook/customers/data_request", async (req, res) => {
    return res.status(200).end();
  });
  app.post("/webhook/customers/redact", async (req, res) => {
    return res.status(200).end();
  });
  app.post("/webhook/shop/redact", async (req, res) => {
    return res.status(200).end();
  });
  app.post("/webhook/callback/app/uninstall", async (req, res) => {
    const topic = req.get("x-shopify-topic");
    const shop = req.get("X-Shopify-Shop-Domain");
    console.log("webhook received at /webhook/callback/app/uninstall for "+topic+" shop: "+shop);
    EventsHelper.emit("shop/uninstalled", {shop: shop});
    return res.status(200).send("Ok");
  });
  
  app.use(cors());
  app.use(express.json({limit: '250mb'}));
  app.use(bodyParser.json({ limit: "250mb" }));
  app.use(bodyParser.urlencoded({ limit: "250mb", extended: true, parameterLimit: 9999999999999 }));
  app.use(route);
  app.use(api_route);


  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  let vite;
  if (!isProd) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    app.use(compression());
    app.use(serveStatic(resolve("public")));
    app.use(serveStatic(resolve("public/build")));
    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/public/build/index.html`));
    });
  }
  
  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => {
    app.listen(PORT);
    console.log(`Server is running at ${process.env.HOST} via PORT ${PORT}`);
  });
}