import appRouter from "@/lib/api";
import { handle } from "hono/vercel";

export const GET = handle(appRouter);

export const POST = handle(appRouter);

export const DELETE = handle(appRouter);

export const PUT = handle(appRouter);
