import "https://deno.land/std/dotenv/mod.ts";

import indexerLoop from "./indexer.js";
import server from "./server.js";

const PORT = parseInt(Deno.env.get("PORT") || "8000");
const SUBSTRATE_ENDPOINT = Deno.env.get("SUBSTRATE_ENDPOINT") || "wss://node-rpc.cybros.network";
const KV_PATH = Deno.env.get("KV_PATH") || "./data/db";

const kv = await Deno.openKv(KV_PATH);

await Promise.all([
  indexerLoop(kv, SUBSTRATE_ENDPOINT),
  server(kv, PORT),
]);
