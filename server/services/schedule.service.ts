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
      const nowHours = now.getHours();
      const nowMinutes = now.getMinutes();
      const nowSeconds = now.getSeconds();

      // Get all the minyans
      const conditions = await getMongoConditionForActiveMinyansByDate(now);
      const minyans = await MinyanModel.find(conditions);
      const roomStatusObj: { [key: string]: eBulbStatus } = {};

      // Process minyans to determine room statuses
      await Promise.all(
        minyans.map(async (minyan) => {
          const roomId = minyan.roomId?.toString();
          const startDate = new Date(minyan.startDate.time);
          const endDate = new Date(minyan.endDate.time);
          const blinkSeconds = Number(minyan.blink?.secondsNum);

          const startHours = startDate.getHours();
          const startMinutes = startDate.getMinutes();
          const startSeconds = startDate.getSeconds();
          const endHours = endDate.getHours();
          const endMinutes = endDate.getMinutes();
          const endSeconds = endDate.getSeconds();
          const blinkStartTime = new Date(
            endDate.getTime() - blinkSeconds * 1000
          );
          const blinkStartHours = blinkStartTime.getHours();
          const blinkStartMinutes = blinkStartTime.getMinutes();
          const blinkStartSeconds = blinkStartTime.getSeconds();

          // Check if any action occurred in the current minute
          if (
            (nowHours > blinkStartHours ||
              (nowHours === blinkStartHours &&
                (nowMinutes > blinkStartMinutes ||
                  (nowMinutes === blinkStartMinutes &&
                    nowSeconds >= blinkStartSeconds)))) &&
            (nowHours < endHours ||
              (nowHours === endHours &&
                (nowMinutes < endMinutes ||
                  (nowMinutes === endMinutes && nowSeconds < endSeconds))))
          ) {
            if (!minyan.steadyFlag) {
              roomStatusObj[roomId] = eBulbStatus.blink;
            }
          } else if (
            (nowHours > startHours ||
              (nowHours === startHours &&
                (nowMinutes > startMinutes ||
                  (nowMinutes === startMinutes &&
                    nowSeconds >= startSeconds)))) &&
            (nowHours < endHours ||
              (nowHours === endHours &&
                (nowMinutes < endMinutes ||
                  (nowMinutes === endMinutes && nowSeconds < endSeconds))))
          ) {
            if (!roomStatusObj[roomId]) {
              roomStatusObj[roomId] = eBulbStatus.on;
            }
            if (minyan.steadyFlag) {
              roomStatusObj[roomId] = eBulbStatus.on;
              await MinyanService.put("steadyFlag", "", true, minyan.id);
            }
          } else if (
            (nowHours > endHours ||
              (nowHours === endHours &&
                (nowMinutes > endMinutes ||
                  (nowMinutes === endMinutes && nowSeconds >= endSeconds))))
          ) {
            if (!roomStatusObj[roomId]) {
              roomStatusObj[roomId] = eBulbStatus.off;
            }
            if (minyan.steadyFlag) {
              roomStatusObj[roomId] = eBulbStatus.off;
              await MinyanService.put("steadyFlag", "", false, minyan.id);
            }
          }
        })
      );

      // Update room statuses based on the roomStatusObj
      const rooms = await RoomService.get();
      await Promise.all(
        rooms.map(async (room) => {
          const roomId = room.id?.toString();
          const currentStatus = roomStatusObj[roomId || ""];
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
      console.error("Error updating room statuses:", (error as Error)?.message);
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
