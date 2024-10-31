import axios from "axios";

import { eBulbColorNum, eBulbStatusNum } from "../types/room.type";
import { ApiError } from "../../lib/utils/api-error.util";

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
};

export default ControlByWebService;
