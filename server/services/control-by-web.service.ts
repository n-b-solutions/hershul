import axios from "axios";

import { eBulbColorNum, eBulbStatusNum } from "../types/room.type";
import { ApiError } from "../../lib/utils/api-error.util";
import { eBulbStatus } from "../../lib/types/room.type";

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
    try {
      const bulbStatusNum = eBulbStatusNum[bulbStatus];
      const colorNum = color ? eBulbColorNum[color] : 1;
      const url = `http://${ipAddress}/state.xml?relay${colorNum}=${bulbStatusNum}`;
      await axios.get(url);
      console.log(
        `Updating bulb status to ${bulbStatusNum} for IP ${ipAddress}`
      );
    } catch (error) {
      console.error("Error updating using ControlByWeb:", error);
      throw new ApiError(500, (error as Error).message);
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
    status: keyof typeof eBulbStatusNum;
    color?: keyof typeof eBulbColorNum;
  }> => {
    try {
      const url = `http://${ipAddress}/state.xml`;
      const response = await axios.get(url);
      let status: keyof typeof eBulbStatusNum | undefined;
      let color: keyof typeof eBulbColorNum | undefined;

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
            ) as keyof typeof eBulbStatusNum;
            color = colorKey as keyof typeof eBulbColorNum;
            break;
          }
        }
      }

      if (!status) {
        status = eBulbStatus.off; //  no relay is active
      }

      return { status, color };
    } catch (error) {
      console.error(
        "Error getting bulb status by IP from ControlByWeb:",
        error
      );
      throw new ApiError(500, (error as Error).message);
    }
  },

  /**
   * Polls the ControlByWeb device for changes in bulb status.
   *
   * @param ipAddress - The IP address of the ControlByWeb device.
   * @param interval - The polling interval in milliseconds.
   * @param callback - The callback function to call when the bulb status changes.
   */
  pollBulbStatus: (
    ipAddress: string,
    interval: number,
    callback: (_status: keyof typeof eBulbStatusNum, _color?: keyof typeof eBulbColorNum) => void
  ): void => {
    let previousStatus: keyof typeof eBulbStatusNum | undefined;
    let previousColor: keyof typeof eBulbColorNum | undefined;

    setInterval(async () => {
      try {
        const { status, color } = await ControlByWebService.getBulbStatusByIp(ipAddress);
        if (status !== previousStatus || color !== previousColor) {
          previousStatus = status;
          previousColor = color;
          callback(status, color);
        }
      } catch (error) {
        console.error("Error polling bulb status from ControlByWeb:", error);
      }
    }, interval);
  },
};

export default ControlByWebService;
