import { eBulbColor, eBulbStatus } from "../../lib/types/room.type";
import MinyanModel from "../models/minyan.model";
import {
  GeoLocation,
  Zmanim,
  HavdalahEvent,
  HDate,
  Location,
} from "@hebcal/core";
import { MinyanType } from "../../lib/types/minyan.type";
import { ApiError } from "../../lib/utils/api-error.util";
import { convertMinyanDocument } from "../utils/convert-document.util";
import RoomService from "./room.service";
import { convertHDateToDate } from "../utils/convert-date.util";
import MinyanService from "./minyan.service";
import { getMongoConditionForActiveMinyansByDate } from "../helpers/minyan.helper";

const ScheduleService = {
  get: async (): Promise<MinyanType[]> => {
    try {
      const today = new Date();
      const conditions = await getMongoConditionForActiveMinyansByDate(today);
      const minyansForSchedule = await MinyanModel.find(conditions)
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId")
        .lean(true);

      return minyansForSchedule.map(convertMinyanDocument);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  updateRoomStatuses: async (): Promise<void> => {
    try {
      const now = new Date();
      const nowTime = new Date(0, 0, 0, now.getHours(), now.getMinutes(), now.getSeconds());

      // Get all the minyans
      const conditions = await getMongoConditionForActiveMinyansByDate(now);
      const minyans = await MinyanModel.find(conditions);
      const roomStatusMap = new Map<string, eBulbStatus>();

      // Process minyans to determine room statuses
      await Promise.all(
        minyans.map(async (minyan) => {
          const roomId = minyan.roomId?.toString();
          const startDate = new Date(minyan.startDate.time);
          const endDate = new Date(minyan.endDate.time);
          const blinkMinutes = Number(minyan.blink?.secondsNum);
          const blurStartTime = new Date(startDate.getTime() - blinkMinutes * 60000);

          const startTime = new Date(0, 0, 0, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
          const endTime = new Date(0, 0, 0, endDate.getHours(), endDate.getMinutes(), endDate.getSeconds());
          const blurStartTimeOnly = new Date(0, 0, 0, blurStartTime.getHours(), blurStartTime.getMinutes(), blurStartTime.getSeconds());

          // Check if any action occurred in the current minute
          if (nowTime >= blurStartTimeOnly && nowTime < startTime) {
            if (!minyan.steadyFlag) {
              roomStatusMap.set(roomId, eBulbStatus.blink);
            }
          } else if (nowTime >= startTime && nowTime <= endTime) {
            if (!minyan.steadyFlag) {
              roomStatusMap.set(roomId, eBulbStatus.on);
            }
          } else {
            if (!roomStatusMap.get(roomId)) {
              roomStatusMap.set(roomId, eBulbStatus.off);
            }
            if (minyan.steadyFlag) {
              roomStatusMap.set(roomId, eBulbStatus.off);
              await MinyanService.put("steadyFlag", "", false, minyan.id);
            }
          }
        })
      );

      // Update room statuses based on the roomStatusMap
      const rooms = await RoomService.get();
      await Promise.all(
        rooms.map(async (room) => {
          const roomId = room.id?.toString();
          const currentStatus = roomStatusMap.get(roomId || "");

          if (currentStatus) {
            await RoomService.updateBulbStatus(
              currentStatus,
              eBulbColor.white,
              roomId
            );
          }
        })
      );
    } catch (error) {
      console.error("Error updating room statuses:", error);
    }
  },

  logBeforeShkiah: async (): Promise<void> => {
    try {
      const now = new Date();
      const today = now.getDay();

      const latitude = process.env.VITE_LATITUDE
        ? parseFloat(process.env.VITE_LATITUDE)
        : 40.7128; // Default to New York City latitude
      const longitude = process.env.VITE_LONGITUDE
        ? parseFloat(process.env.VITE_LONGITUDE)
        : -74.006; // Default to New York City longitude
      const tzid = process.env.VITE_TZID || "America/New_York";

      const location = new Location(latitude, longitude, false, tzid);

      if (today === 5) {
        // Friday
        const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
        const zmanim = new Zmanim(gloc, now, false);
        const shkiah = zmanim.shkiah();
        const shkiahMinus30 = new Date(shkiah.getTime() - 30 * 60000);

        if (now >= shkiahMinus30 && now <= shkiah) {
          await RoomService.updateAllRoomsToOffStatus();
        }
      } else if (today === 6) {
        // Saturday
        const havdalahDate = new HDate();
        const mask = 0;
        const eventTime = new Date();

        const havdalahMins = process.env.VITE_HAVDALAMINS
          ? parseInt(process.env.VITE_HAVDALAMINS)
          : 50;
        const linkedEvent = undefined;
        const options = undefined;

        const havdalahEvent = new HavdalahEvent(
          havdalahDate,
          mask,
          eventTime,
          location,
          havdalahMins,
          linkedEvent,
          options
        );

        const havdalahTimeLocal = havdalahEvent.getDate();
        const havdalahTime = convertHDateToDate(havdalahTimeLocal);

        if (now > havdalahTime) {
          await RoomService.updateAllRoomsToOffStatus();
        }
      }
    } catch (error) {
      console.error("Error in logBeforeShkiah:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },
};
export default ScheduleService;
