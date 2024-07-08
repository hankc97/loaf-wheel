import { InspectOptions, inspect } from "util";

export const repr = (obj: unknown, options?: InspectOptions): string =>
  typeof obj === "string"
    ? obj
    : inspect(obj, {
        compact: true,
        sorted: true,
        ...(options ?? {}),
      });
