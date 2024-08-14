import { ClientRequestOptions, ClientResponse, hc } from "hono/client";
import { AppRouter } from ".";
import HttpError from "../errors/http-error";
import { StatusCode } from "hono/utils/http-status";

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

export type ResponseJsonType<
  T extends (
    args: any,
    opts: ClientRequestOptions<unknown> | undefined,
  ) => Promise<ClientResponse<unknown, StatusCode, "json">>,
> = Awaited<ReturnType<Awaited<ReturnType<T>>["json"]>>;
