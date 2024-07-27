import { hc } from "hono/client";
import { ofetch } from "ofetch";
import { AppRouter } from ".";
import HttpError from "../errors/http-error";

const client = hc<AppRouter>(
  typeof window === "undefined" ? process.env.SERVER_BASE_URL! : "/",
  {
    async fetch(input, requestInit, Env, executionCtx) {
      const res = await fetch(input, requestInit);
      if (!res.ok) {
        const body = await res.json();
        const error = new HttpError(body.message, res.status);
        throw error;
      }
      return res;
    },
  },
);
export default client;
