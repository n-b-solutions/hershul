import axios from "axios";
import axiosRetry from "axios-retry";

import { eBulbColorNum, eBulbStatusNum } from "../types/room.type";
import { eBulbColor, eBulbStatus } from "../../lib/types/room.type";

// Configure axios to use axios-retry
axiosRetry(axios, {
  retries: 5, // Number of retries
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Exponential backoff (1s, 2s, 3s, etc.)
  },
  retryCondition: (error) => {
    // Retry on ECONNRESET errors
    return error.code === "ECONNRESET";
  },
});

/**
 * Service for updating bulb status using ControlByWeb.
 */
const ControlByWebService = {
  /**
   * Updates the bulb status using ControlByWeb.
   *
   * @param ipAddress - The IP address of the ControlByWeb device.
   * @param bulbStatus - The status of the bulb, represented as a key of `eBulbStatusNum`.
   * @param color - (Optional) The color of the bulb, represented as a key of `eBulbColorNum`.
   * @returns A promise that resolves when the update is complete.
   * @throws {ApiError} If the update fails.
   */
  updateUsingControlByWeb: async (
    ipAddress: string,
    bulbStatus: keyof typeof eBulbStatusNum,
    color?: keyof typeof eBulbColorNum
  ): Promise<void> => {
    const bulbStatusNum = eBulbStatusNum[bulbStatus];
    const colorNum = color ? eBulbColorNum[color] : 1;
    const url = `http://${ipAddress}/state.xml?relay${colorNum}=${bulbStatusNum}`;
    await axios.get(url);
    console.log(`Updating bulb status to ${bulbStatusNum} for IP ${ipAddress}`);
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
  },
};

export default ControlByWebService;
