import { Hono } from "hono";
import modelRouter from "./model";
import jobRouter from "./job";
import userRouter from "./user";
import { HTTPException } from "hono/http-exception";
import ConstraintViolationError from "../errors/contrain-violation-error";

const app = new Hono({}).basePath("/api");

const appRouter = app
  .route("/", modelRouter)
  .route("/", jobRouter)
  .route("/", userRouter)
  .onError((err, c) => {
    console.error(err);

    if (err instanceof HTTPException) {
      c.status(err.status);
      return c.json({ message: err.message });
    }

    if (err instanceof ConstraintViolationError) {
      c.status(400);
      return c.json({ message: err.message });
    }

    c.status(500);
    return c.json({ message: "Something went wrong. Please try again later." });
  });

export type AppRouter = typeof appRouter;

export default app;
