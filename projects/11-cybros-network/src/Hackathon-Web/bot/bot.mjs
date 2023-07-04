import { CHANNEL_ID } from "./app.mjs";
import { Events } from "discord.js";
import PQueue from "p-queue";
import pDebounce from "p-debounce";
import axios from "axios";
import { Keyring } from "@polkadot/api";

const POOL_ID = "102";
const POOL_ID_LIKE = 101;
const CHARLIE_PUB = "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y";

const reactionQueue = new PQueue({ concurrency: 1 });
const reactionSendQueue = new PQueue({ concurrency: 1 });
const messageSendQueue = new PQueue({ concurrency: 1 });

export async function botMain(api, client) {
  const ch = await client.channels.fetch(CHANNEL_ID);
  const keyring = new Keyring({ type: "sr25519" });
  // todo: read account from envvars
  const charlie = keyring.createFromUri("//Charlie");

  const reactionCallbacks = {};
  const getReactionCallback = (k) => {
    if (reactionCallbacks[k]) {
      return reactionCallbacks[k];
    }
    reactionCallbacks[k] = pDebounce(async (reaction) => {
      try {
        const r = await reaction.fetch();
        let c = 0;
        for (const i of r.message.reactions.cache.values()) {
          c += i.count || 0;
        }
        await reactionSendQueue.add(async () => {
          const jobId = r.message.embeds?.[0].data?.fields?.[0]?.value;
          if (!jobId) return;

          // todo: should use e2e encryption in production
          const tx = api.tx.offchainComputing.createJob(
            POOL_ID_LIKE,
            1,
            1,
            false,
            JSON.stringify({
              e2e: false,
              data: JSON.stringify({
                jobId,
                likes: c,
              }),
            }),
            null
          );
          try {
            const t = await tx.signAndSend(charlie);
            console.log(`Tx sent: ${t}`);
          } catch (e) {
            console.error(e);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }, 3000);
    return reactionCallbacks[k];
  };

  const onReaction = async (reaction) => {
    if (reaction.message.channelId !== CHANNEL_ID) return;
    return reactionQueue.add(() => {
      getReactionCallback(reaction.message.id)(reaction).catch(console.error);
      return Promise.resolve();
    });
  };

  client.on(Events.MessageReactionAdd, onReaction);
  client.on(Events.MessageReactionRemove, onReaction);
  return chainListener(api, client, ch);
}

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

async function chainListener(api, client, ch) {
  let targetHeight = (await api.derive.chain.bestNumberFinalized()).toNumber();
  let processedHeight = targetHeight - 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (targetHeight < processedHeight) {
      await sleep(1000);
      targetHeight = (await api.derive.chain.bestNumberFinalized()).toNumber();
      continue;
    }
    console.log(`Processed #${processedHeight}, target #${targetHeight}`);

    const curr = processedHeight + 1;
    const hash = await api.rpc.chain.getBlockHash(curr);
    const apiAt = await api.at(hash);
    const events = (await apiAt.query.system.events()).toHuman();

    for (const e of events) {
      if (e.event.section !== "offchainComputing") continue;
      if (e.event.data?.poolId !== POOL_ID) continue;
      const data = e.event.data;
      switch (e.event.method) {
        case "JobResultUpdated":
          if (data.result !== "Success") continue;
          messageSendQueue
            .add(async () => {
              const { data: dataUrl } = JSON.parse(data.output);
              await sendResultToDiscord(data, dataUrl, 0, api, client, ch);
            })
            .catch(console.error);
          break;
        default:
          break;
      }
    }

    processedHeight = curr;
    if (targetHeight <= processedHeight) {
      targetHeight = (await api.derive.chain.bestNumberFinalized()).toNumber();
    }
  }
}

async function sendResultToDiscord(
  job,
  metadataUrl,
  attemptCount,
  api,
  client,
  ch
) {
  if (attemptCount >= 50)
    throw new Error(
      `Last attempt failed to get data from ${metadataUrl} for job #${job.jobId}`
    );
  await sleep(6000);
  try {
    const res = await axios.get(metadataUrl);
    if (res.status !== 200)
      throw new Error(
        `Failed to get data from ${metadataUrl} for job #${job.jobId}, retrying in 6s...`
      );
    await sleep(3000);

    ch.send({
      embeds: [
        {
          title: `Job #${job.jobId}`,
          url: res.data.proof,
          image: {
            url: res.data.image,
          },
          fields: [
            {
              name: "jobId",
              value: job.jobId,
            },
            {
              name: "metadata",
              value: metadataUrl,
            },
          ],
          description: "Check https://cybros.network/ for more information.",
        },
      ],
    })
      .then(() => {
        console.log(`Sent message for job #${job.jobId}!`);
      })
      .catch((e) => {
        console.error("Failed to send message to channel:", e);
      });
    console.log(res.data);
  } catch (e) {
    console.error({ jobId: job.jobId, metadataUrl, attemptCount }, e);
    return sendResultToDiscord(
      job,
      metadataUrl,
      attemptCount + 1,
      api,
      client,
      ch
    );
  }
}
