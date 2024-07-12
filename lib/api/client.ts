import { hc } from "hono/client";
import { ofetch } from "ofetch";
import { AppRouter } from ".";

const client = hc<AppRouter>(
  typeof window === "undefined" ? process.env.SERVER_BASE_URL! : "/",
  {
    async fetch(input, requestInit, Env, executionCtx) {
      const res = await fetch(input, requestInit);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res;
    },
  },
);
export default client;
