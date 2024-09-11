import MinyanListModel from "../models/minyanListModel";
import RoomStatusModel from "../models/roomStatusModel";
import {
  GeoLocation,
  Zmanim,
  HavdalahEvent,
  HDate,
  Location,
} from "@hebcal/core";

interface Room {
  nameRoom: string;
  status: string;
}

const ScheduleController = {
  updateRoomStatuses: async (): Promise<Room[]> => {
    const now = new Date();
    const updates: Room[] = [];
    console.log("updateRoomStatuses");

    const minyans = await MinyanListModel.find();
    const roomStatusMap = new Map<string, "on" | "off" | "blur">();

    for (const minyan of minyans) {
      const roomName = minyan.room;
      const startDate = new Date(minyan.startDate);
      const endDate = new Date(minyan.endDate);
      const blinkMinutes = Number(minyan.blink);
      const blurStartTime = new Date(
        startDate.getTime() - blinkMinutes * 60000
      );

      if (now >= blurStartTime && now < startDate) {
        if (!minyan.steadyFlag) {
          roomStatusMap.set(roomName, "blur");
        }
      } else if (now >= startDate && now <= endDate) {
        if (!minyan.steadyFlag) {
          roomStatusMap.set(roomName, "on");
        }
      } else {
        if (minyan.steadyFlag) {
          minyan.steadyFlag = false;
          roomStatusMap.set(roomName, "off");
          await minyan.save();
        }
      }
    }

    const rooms = await RoomStatusModel.find();

    for (const room of rooms) {
      const currentStatus = roomStatusMap.get(room.nameRoom);
      if (currentStatus && room.status !== currentStatus) {
        room.status = currentStatus;
        await room.save();
      }
      updates.push(room);
    }

    return updates;
  },

  setRoomSteadyFlagAndStatus: async (
    roomName: string,
    newStatus: "on" | "off" | "blur"
  ): Promise<Room[]> => {
    const now = new Date();
    const minyans = await MinyanListModel.find({ room: roomName });

    let activeMinyan = minyans.find(
      (minyan) => now >= minyan.startDate && now <= minyan.endDate
    );
    console.log(activeMinyan);

    if (activeMinyan) {
      activeMinyan.steadyFlag = true;
      await activeMinyan.save();
    }
    const room = await RoomStatusModel.findOne({ nameRoom: roomName });

    if (room) {
      room.status = newStatus;
      await room.save();
      if (activeMinyan) console.log(room);
    }
    return await RoomStatusModel.find();
  },

  logBeforeShkiah: async () => {
    const now = new Date();
    const today = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday

    const latitude = process.env.LATITUDE
      ? parseFloat(process.env.LATITUDE)
      : 40.7128; // Default to New York City latitude
    const longitude = process.env.LONGITUDE
      ? parseFloat(process.env.LONGITUDE)
      : -74.006; // Default to New York City longitude
    const tzid = process.env.TZID || "America/New_York";

    const location = new Location(latitude, longitude, false, tzid);

    if (today === 5) {
      // Friday
      // Calculate shkiah (sunset) time for Friday
      const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
      const zmanim = new Zmanim(gloc, now, false);
      const shkiah = zmanim.shkiah();
      // Calculate 30 minutes before shkiah
      const shkiahMinus30 = new Date(shkiah.getTime() - 30 * 60000); // 30 minutes before shkiah

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

      const havdalahMins = process.env.HAVDALAMINS?parseInt(process.env.HAVDALAMINS):50
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
      const havdalahTimeLocal = havdalahEvent.getDate(); // assuming this returns an HDate object

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
