import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { botMain } from "./bot.mjs";
import { cryptoWaitReady } from "@polkadot/util-crypto";

const SUBSTRATE_ENDPOINT =
  process.env.SUBSTRATE_ENDPOINT || "wss://node-rpc.cybros.network";

export const CHANNEL_ID = "1124361718299119786";

function initPolkadotApi() {
  return new Promise((resolve, reject) => {
    const rpcProvider = new WsProvider(SUBSTRATE_ENDPOINT);
    const api = new ApiPromise({
      provider: rpcProvider,
      throwOnConnect: true,
      throwOnUnknown: true,
    });
    api.on("error", (e) => {
      console.error(e);
      reject(e);
      process.exit(255);
    });
    api.on("disconnected", (e) => {
      console.error("polkadotJS disconnected", e);
      process.exit(255);
    });
    api.isReady.then(() => resolve(api)).catch((e) => reject(e));
  });
}

async function main() {
  await cryptoWaitReady();
  const api = await initPolkadotApi();
  console.log("Connected to substrate RPC");
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });

  client.once(Events.ClientReady, (c) => {
    console.log(`Bot logged in as ${c.user.tag}`);
    botMain(api, client).catch((e) => {
      console.error(e);
      process.exit(255);
    });
  });
  await client.login(process.env.DISCORD_TOKEN);
}

main().catch((e) => {
  console.error(e);
  process.exit(255);
});
