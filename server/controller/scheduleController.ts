import { Request, Response } from "express";

import MinyanListModel from "../models/minyanListModel";
import RoomStatusModel from "../models/roomStatusModel";
import {
  GeoLocation,
  Zmanim,
  HavdalahEvent,
  HDate,
  Location,
} from "@hebcal/core";
import { getQueryDateType } from "../helper/function-minyans";

interface Room {
  nameRoom: string;
  status: string;
}

const ScheduleController = {
  get: async (req: Request, res: Response): Promise<void> => {
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
      const minyansForSchedule = await MinyanListModel.find({
        $or: [calendarCond, dateTypeCond],
      })
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId")
        .lean(true);

        const formattedList = minyansForSchedule.map((minyan) => ({
          startDate: {
            time: minyan.startDate.time,
            message: minyan.startDate.messageId, // populated message details
          },
          endDate: {
            time: minyan.endDate.time,
            message: minyan.endDate.messageId, // populated message details
          },
          blink: minyan.blink
            ? {
                secondsNum: minyan.blink.secondsNum,
                message: minyan.blink.messageId, // populated message details
              }
            : null,
          dateType: minyan.dateType,
          room: minyan.roomId,
          id: minyan.id,
          specificDate: minyan.specificDate
            ? {
                date: minyan.specificDate.date,
                isRoutine: minyan.specificDate.isRoutine,
              }
            : null,
          inactiveDates: minyan.inactiveDates, // Include inactiveDates here
        }));
        
      res.status(200).send(formattedList);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  updateRoomStatuses: async (): Promise<Room[]> => {
    const now = new Date();
    const updates: Room[] = [];

    const minyans = await MinyanListModel.find();
    const roomStatusMap = new Map<string, "on" | "off" | "blink">();

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
          roomStatusMap.set(roomId, "blink");
        }
      } else if (now >= startDate && now <= endDate) {
        if (!minyan.steadyFlag) {
          roomStatusMap.set(roomId, "on");
        }
      } else {
        if (minyan.steadyFlag) {
          minyan.steadyFlag = false;
          roomStatusMap.set(roomId, "off");
          await minyan.save();
        }
      }
    }

    const rooms = await RoomStatusModel.find();

    for (const room of rooms) {
      const currentStatus = roomStatusMap.get(room?._id?.toString() || "");
      if (currentStatus && room.status !== currentStatus) {
        room.status = currentStatus;
        await RoomStatusModel.findByIdAndUpdate(room._id, {
          $set: { status: currentStatus },
        });
      }
      updates.push(room);
    }

    return updates;
  },
  logBeforeShkiah: async () => {
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
        const rooms = await RoomStatusModel.find();
        for (const room of rooms) {
          if (room.status !== "off") {
            room.status = "off";
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
        const rooms = await RoomStatusModel.find();
        for (const room of rooms) {
          if (room.status !== "off") {
            room.status = "off";
            await room.save();
          }
        }
        console.log("All room statuses have been set to 'off'!");
      }
    }
  },
};
export default ScheduleController;
