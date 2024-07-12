import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

export const validationMiddleware = (
  ...params: Parameters<typeof zValidator>
) =>
  zValidator(params[0], params[1], (result, c) => {
    if (!result.success) {
      throw new HTTPException(400, { message: "invalid input" });
    }
  });
