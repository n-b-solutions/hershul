import path from "path";
import fs from "fs";
import { exec, execSync } from "child_process";
import { config } from "dotenv";
import { FileLogger } from "../utils/file-logger.util";

config();

const logger = new FileLogger({ prefix: "PlayAudio", level: "ALL" });

//#region Move to another file and fix.

const listAudioDevicesWindows = () => {
  const command =
    'powershell "Import-Module AudioDeviceCmdlets; Get-AudioDevice -List"';
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error listing audio devices: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error listing audio devices: ${stderr}`);
      return;
    }
    console.log("Available audio devices:", stdout);
  });
};

const listAudioDevicesLinux = () => {
  exec("aplay -l", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error listing audio devices: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error listing audio devices: ${stderr}`);
      return;
    }
    console.log("Available audio devices:", stdout);
  });
};

const listAudioDevicesMac = () => {
  exec("system_profiler SPAudioDataType", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error listing audio devices: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error listing audio devices: ${stderr}`);
      return;
    }
    console.log("Available audio devices:", stdout);
  });
};

export const listAudioDevices = () => {
  if (process.platform === "win32") {
    listAudioDevicesWindows();
  } else if (process.platform === "darwin") {
    listAudioDevicesMac();
  } else if (process.platform === "linux") {
    listAudioDevicesLinux();
  }
};
//#endregion Move to another file and fix.

const isCommandAvailable = (command: string): boolean => {
  try {
    execSync(`command -v ${command}`); // Use 'command -v' for Unix-like systems
    return true;
  } catch {
    return false;
  }
};

const getLinuxAudioPlayer = (): string => {
  if (isCommandAvailable("aplay")) {
    return "aplay";
  } else if (isCommandAvailable("paplay")) {
    return "paplay";
  } else {
    throw new Error("No suitable audio player found on Linux");
  }
};

export const playAudio = (
  audioUrl: string,
  deviceIndex: number = 0,
  deviceName?: string
) => {
  try {
    const audioPath = path.join(process.cwd(), audioUrl);
    if (!fs.existsSync(audioPath)) {
      logger.error(`Audio file does not exist: ${audioPath}`);
      return;
    }

    let command: string;

    if (process.platform === "win32") {
      const mplayerPath = process.env.VITE_MPLAYER_PATH || "mplayer";
      command = `${mplayerPath} -ao dsound:device=${deviceIndex} ${audioPath}`;
    } else if (process.platform === "darwin") {
      if (deviceName) {
        logger.warn(
          "Device selection is not supported on macOS with afplay. Using default device."
        );
      }
      command = `afplay ${audioPath}`;
    } else {
      const linuxPlayer = getLinuxAudioPlayer();
      if (linuxPlayer === "aplay" && deviceName) {
        command = `${linuxPlayer} -D ${deviceName} ${audioPath}`;
      } else if (linuxPlayer === "paplay" && deviceName) {
        command = `${linuxPlayer} --device=${deviceName} ${audioPath}`;
      } else {
        command = `${linuxPlayer} ${audioPath}`;
      }
    }

    logger.debug(`Executing command: ${command}`);
    const startTime = Date.now();

    exec(command, (error, stdout, stderr) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      logger.debug(`Command execution time: ${duration}ms`);

      if (error) {
        logger.error(`Error playing audio: ${error.message}`);
        return;
      }
      if (stderr) {
        logger.error(`Player stderr: ${stderr}`);
        return;
      }
      logger.debug(`Audio played successfully: ${audioPath}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    } else {
      logger.error(`Unknown error: ${error}`);
    }
  }
};
