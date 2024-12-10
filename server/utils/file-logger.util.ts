import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";

import {
  LoggerOptions,
  LogLevel,
  LogLevelNumber,
} from "../../client/src/lib/logger";

const logDir = join(process.cwd(), "logs");
const logFile = join(logDir, "app.log");

// Ensure the log directory exists
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const logStream = createWriteStream(logFile, { flags: "a" });

export class FileLogger {
  protected prefix: string;
  protected level: keyof typeof LogLevel;
  protected showLevel: boolean;

  private levelNumber: number;

  constructor({
    prefix = "",
    level = LogLevel.ALL,
    showLevel = true,
  }: LoggerOptions) {
    this.prefix = prefix;
    this.level = level;
    this.levelNumber = LogLevelNumber[this.level];
    this.showLevel = showLevel;
  }

  debug = (...args: unknown[]): void => {
    if (this.canWrite(LogLevel.DEBUG)) {
      this.write(LogLevel.DEBUG, ...args);
    }
  };

  warn = (...args: unknown[]): void => {
    if (this.canWrite(LogLevel.WARN)) {
      this.write(LogLevel.WARN, ...args);
    }
  };

  error = (...args: unknown[]): void => {
    if (this.canWrite(LogLevel.ERROR)) {
      this.write(LogLevel.ERROR, ...args);
    }
  };

  private canWrite(level: keyof typeof LogLevel): boolean {
    return this.levelNumber >= LogLevelNumber[level];
  }

  private write(level: keyof typeof LogLevel, ...args: unknown[]): void {
    let prefix = this.prefix;

    if (this.showLevel) {
      prefix = `- ${level} ${prefix}`;
    }

    const message = `${new Date().toISOString()} ${prefix} ${args.join(" ")}\n`;

    if (level === LogLevel.ERROR) {
      console.error(message);
    } else {
      console.log(message);
    }

    logStream.write(message);
  }
}
