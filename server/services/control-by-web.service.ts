import axios from "axios";
import fs from "fs";
import path from "path";
import { eBulbStatus, eBulbColor } from "../../lib/types/room.type";
import { eBulbColorNum, eBulbStatusNum } from "../types/room.type";

const isProd = process.env.NODE_ENV === "production";
const fakeUpdatesFilePath = path.join(process.cwd(), "fake-updates.json");

const readFakeUpdates = () => {
  if (fs.existsSync(fakeUpdatesFilePath)) {
    const data = fs.readFileSync(fakeUpdatesFilePath, "utf-8");
    return JSON.parse(data);
  }
  return {};
};

const writeFakeUpdates = (updates: any) => {
  fs.writeFileSync(fakeUpdatesFilePath, JSON.stringify(updates, null, 2));
};

const ControlByWebService = {
  /**
   * Updates the bulb status using ControlByWeb.
   *
   * @param ipAddress - The IP address of the ControlByWeb device.
   * @param bulbStatus - The status of the bulb, represented as a key of `eBulbStatusNum`.
   * @param color - (Optional) The color of the bulb, represented as a key of `eBulbColorNum`.
   * @param blinkDuration - (Optional) The total duration in seconds for which the bulb should blink.
   * @returns A promise that resolves when the update is complete.
   * @throws {ApiError} If the update fails.
   */
  updateUsingControlByWeb: async (
    ipAddress: string,
    bulbStatus: keyof typeof eBulbStatusNum,
    color?: keyof typeof eBulbColorNum,
    blinkDuration?: number
  ): Promise<void> => {
    const bulbStatusNum = eBulbStatusNum[bulbStatus];
    const colorNum = color ? eBulbColorNum[color] : 1;

    if (bulbStatus === eBulbStatus.blink && blinkDuration) {
      const blinkInterval = 1000; // 1 second interval for blinking
      const endTime = Date.now() + blinkDuration * 1000;

      while (Date.now() < endTime) {
        if (isProd) {
          await axios.get(`http://${ipAddress}/state.xml?relay${colorNum}=1`);
          await new Promise((resolve) => setTimeout(resolve, blinkInterval));
          await axios.get(`http://${ipAddress}/state.xml?relay${colorNum}=0`);
          await new Promise((resolve) => setTimeout(resolve, blinkInterval));
        } else {
          const fakeUpdates = readFakeUpdates();
          fakeUpdates[ipAddress] = { status: "on", color };
          writeFakeUpdates(fakeUpdates);
          await new Promise((resolve) => setTimeout(resolve, blinkInterval));
          fakeUpdates[ipAddress] = { status: "off", color };
          writeFakeUpdates(fakeUpdates);
          await new Promise((resolve) => setTimeout(resolve, blinkInterval));
        }
      }
    } else {
      if (isProd) {
        const url = `http://${ipAddress}/state.xml?relay${colorNum}=${bulbStatusNum}`;
        await axios.get(url);
        console.log(
          `Updating bulb status to ${bulbStatusNum} for IP ${ipAddress}`
        );
      } else {
        const fakeUpdates = readFakeUpdates();
        fakeUpdates[ipAddress] = { status: bulbStatus, color };
        writeFakeUpdates(fakeUpdates);
        console.log(
          `Fake update: Setting bulb status to ${bulbStatus} and color to ${color} for IP ${ipAddress}`
        );
      }
    }
  },

  /**
   * Gets the current bulb status and color from ControlByWeb by IP address.
   *
   * @param ipAddress - The IP address of the ControlByWeb device.
   * @returns A promise that resolves with an object containing the current status and color of the bulb.
   * @throws {ApiError} If the request fails.
   */
  getBulbStatusByIp: async (
    ipAddress: string
  ): Promise<{
    status: eBulbStatus;
    color?: eBulbColor;
  }> => {
    if (isProd) {
      const url = `http://${ipAddress}/state.xml`;
      const response = await axios.get(url);
      let status: eBulbStatus | undefined = undefined;
      let color: eBulbColor | undefined = undefined;

      for (const colorKey in eBulbColorNum) {
        const colorNum = eBulbColorNum[colorKey as keyof typeof eBulbColorNum];
        const relayStatusMatch = response.data.match(
          new RegExp(`<relay${colorNum}>(\\d+)</relay${colorNum}>`)
        );
        if (relayStatusMatch && relayStatusMatch[1]) {
          const statusNum = parseInt(relayStatusMatch[1], 10);
          if (statusNum !== 0) {
            status = Object.keys(eBulbStatusNum).find(
              (key) =>
                eBulbStatusNum[key as keyof typeof eBulbStatusNum] === statusNum
            ) as eBulbStatus;
            color = colorKey as eBulbColor;
            break;
          }
        }
      }

      if (!status) {
        status = eBulbStatus.off; // no relay is active
      }

      return { status, color };
    } else {
      const fakeUpdates = readFakeUpdates();
      const fakeUpdate = fakeUpdates[ipAddress];
      if (fakeUpdate) {
        return { status: fakeUpdate.status, color: fakeUpdate.color };
      } else {
        const defaultStatus = eBulbStatus.off;
        const defaultColor = undefined;
        fakeUpdates[ipAddress] = { status: defaultStatus, color: defaultColor };
        writeFakeUpdates(fakeUpdates);
        return { status: defaultStatus, color: defaultColor };
      }
    }
  },
};

export default ControlByWebService;
