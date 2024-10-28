import { eBulbStatus, RoomType } from "../../lib/types/room.type";
import MinyanModel from "../models/minyan.model";
import RoomModel from "../models/room.model";
import {
  GeoLocation,
  Zmanim,
  HavdalahEvent,
  HDate,
  Location,
} from "@hebcal/core";
import { getQueryDateType, getRoshChodeshCond } from "../helpers/minyan.helper";
import { MinyanType } from "../../lib/types/minyan.type";
import { ApiError } from "../../lib/utils/api-error.util";
import { convertMinyanDocument } from "../utils/convert-document.util";

const ScheduleService = {
  get: async (): Promise<MinyanType[]> => {
    try {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0); // start of day
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999); // end of day
      const calendarCond = {
        dateType: "calendar",
        "specificDate.date": {
          $gte: startOfDay.toISOString(),
          $lt: endOfDay.toISOString(),
        },
      };
      const dateType = await getQueryDateType(today);
      const dateTypeCond = {
        $and: [
          { dateType },
          {
            "inactiveDates.date": {
              $not: {
                $gte: startOfDay,
                $lt: endOfDay,
              },
            },
          },
        ],
      };
      const roshChodeshCond = await getRoshChodeshCond(dateType, today);

      const query = {
        $or: [
          calendarCond, // Assuming calendarCond is always populated
          dateTypeCond, // Assuming dateTypeCond is always populated
          ...(Object.keys(roshChodeshCond).length > 0 ? [roshChodeshCond] : []), // Conditional check for roshChodeshCond
        ],
      };

      const minyansForSchedule = await MinyanModel.find(query)
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
  updateRoomStatuses: async (): Promise<RoomType[]> => {
    // TODO: Refactor this method to use a more efficient algorithm
    const now = new Date();
    const updates: RoomType[] = [];

    const minyans = await MinyanModel.find();
    const roomStatusMap = new Map<string, eBulbStatus>();

    for (const minyan of minyans) {
      const roomId = minyan.roomId.toString();
      const startDate = new Date(minyan.startDate.time);
      const endDate = new Date(minyan.endDate.time);
      const blinkMinutes = Number(minyan.blink?.secondsNum);
      const blurStartTime = new Date(
        startDate.getTime() - blinkMinutes * 60000
      );

      if (now >= blurStartTime && now < startDate) {
        if (!minyan.steadyFlag) {
          roomStatusMap.set(roomId, eBulbStatus.blink);
        }
      } else if (now >= startDate && now <= endDate) {
        if (!minyan.steadyFlag) {
          roomStatusMap.set(roomId, eBulbStatus.on);
        }
      } else {
        if (minyan.steadyFlag) {
          minyan.steadyFlag = false;
          roomStatusMap.set(roomId, eBulbStatus.off);
          await minyan.save();
        }
      }
    }

    const rooms = await RoomModel.find();

    for (const room of rooms) {
      const currentStatus = roomStatusMap.get(room?._id?.toString() || "");
      if (currentStatus && room.bulbStatus !== currentStatus) {
        room.bulbStatus = currentStatus;
        await RoomModel.findByIdAndUpdate(room._id, {
          $set: { bulbStatus: currentStatus },
        });
      }
      updates.push(room);
    }

    return updates;
  },

  logBeforeShkiah: async (): Promise<void> => {
    // TODO: Refactor this method to use a more efficient algorithm
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
      // Calculate shkiah (sunset) time for Friday
      const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
      const zmanim = new Zmanim(gloc, now, false);
      const shkiah = zmanim.shkiah();
      // Calculate 30 minutes before shkiah
      const shkiahMinus30 = new Date(shkiah.getTime() - 30 * 60000);

      if (now >= shkiahMinus30 && now <= shkiah) {
        const rooms = await RoomModel.find();
        for (const room of rooms) {
          if (room.bulbStatus !== eBulbStatus.off) {
            room.bulbStatus = eBulbStatus.off;
            await room.save();
          }
        }
        console.log("All room statuses have been set to 'off'!");
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

      // Convert HDate to Date object if HDate has a method to get Date object
      const havdalahTimeLocal = havdalahEvent.getDate();
      // Add conversion method or utility function here

      function convertHDateToDate(hDate) {
        // Example conversion logic (adjust according to actual HDate properties)

        return new Date(
          hDate.getYear(),
          hDate.getMonth() - 1,
          hDate.getDay(),
          hDate.getHours(),
          hDate.getMinutes()
        );
      }

      const havdalahTime = convertHDateToDate(havdalahTimeLocal);

      if (now > havdalahTime) {
        const rooms = await RoomModel.find();
        for (const room of rooms) {
          if (room.bulbStatus !== eBulbStatus.off) {
            room.bulbStatus = eBulbStatus.off;
            await room.save();
          }
        }
        console.log("All room statuses have been set to 'off'!");
      }
    }
  },
};
export default ScheduleService;
