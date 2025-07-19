import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { failure } from "../utils/response";
import { GenericCode } from "../utils/responseCodes";

export function validate(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      }

      return res
        .status(400)
        .json(
          failure(GenericCode.BAD_REQUEST, "Validation failed", fieldErrors)
        );
    }

    req.body = result.data;
    next();
  };
}
