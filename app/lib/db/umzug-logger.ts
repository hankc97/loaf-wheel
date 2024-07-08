import { Logger } from "../logging/logging";
import { repr } from "../logging/repr";

export class UmzugLogger {
  constructor(private readonly logger: Logger) {}

  public info(message: Record<string, unknown>): void {
    this.logger.info(UmzugLogger.getMessage(message));
  }

  public warn(message: Record<string, unknown>): void {
    this.logger.warn(UmzugLogger.getMessage(message));
  }

  public error(message: Record<string, unknown>): void {
    this.logger.error(UmzugLogger.getMessage(message));
  }

  public debug(message: Record<string, unknown>): void {
    this.logger.debug(() => UmzugLogger.getMessage(message));
  }

  private static getMessage(record: Record<string, unknown>): string {
    const { message, event } = record as { message?: string; event?: string };
    const msgs = [message, event].filter((s) => s);
    return msgs.length ? msgs.join("; ") : repr(record);
  }
}
