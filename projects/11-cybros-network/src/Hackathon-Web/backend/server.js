import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
import {
  KEY_LATEST_JOB,
  KEY_PREFIX_JOB,
  KEY_PREFIX_JOB_LIKE_COUNT,
  KEY_PROCESSED_HEIGHT,
  KEY_QUEUE_SIZE,
} from "./indexer.js";

export default async function server(kv, port) {
  const app = new Application();
  const router = new Router();

  router.get("/status", async (ctx, next) => {
    const q = await kv.getMany([KEY_PROCESSED_HEIGHT, KEY_QUEUE_SIZE, KEY_LATEST_JOB]);
    ctx.response.body = JSON.stringify({
      height: q[0].value || 0,
      queueSize: q[1].value || 0,
      latestJobId: q[2].value || 0,
    });
    await next();
  });

  router.get("/job/:id", async (ctx, next) => {
    const qj = (await kv.get([...KEY_PREFIX_JOB, ctx.params.id])).value;
    if (!qj) {
      ctx.response.body = "{}";
      ctx.response.status = Status.NotFound;
      await next();
      return;
    }
    qj.likeCount = (await kv.get([...KEY_PREFIX_JOB_LIKE_COUNT, ctx.params.id])).value || 0;
    ctx.response.body = JSON.stringify(qj);
    await next();
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
  console.log("Starting server...");
  await app.listen({ port });
}
