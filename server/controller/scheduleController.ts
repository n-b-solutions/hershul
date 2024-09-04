import MinyanListModel from "../models/minyanListModel";
import RoomStatusModel from "../models/roomStatusModel";

interface Room {
  nameRoom: string;
  status: string;
}


const ScheduleController = {
  updateRoomStatuses: async (): Promise<Room[]> => {
    const now = new Date();
    const updates: Room[] = [];

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
      activeMinyan.save();
      
    }
    const room = await RoomStatusModel.findOne({ nameRoom: roomName });

    if (room) {
      room.status = newStatus;
      await room.save();
      if(activeMinyan)
        console.log(room);
        
    }
    return await RoomStatusModel.find();
  },
};

export default ScheduleController;
