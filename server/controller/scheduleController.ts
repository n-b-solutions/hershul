import MinyanListModel from "../models/minyanListModel";
import RoomStatusModel from "../models/roomStatusModel";

const ScheduleController = {
    updateRoomStatuses: async () => {
        const now = new Date();
        
        const minyans = await MinyanListModel.find();
        const roomStatusMap = new Map();
        for (const minyan of minyans) {
            const roomName = minyan.room;

            if (now >= minyan.startDate && now <= minyan.endDate) {
                roomStatusMap.set(roomName, 'on');
            }
        }

        const rooms = await RoomStatusModel.find();
        
        for (const room of rooms) {
            const currentStatus = roomStatusMap.get(room.nameRoom) || 'off';
            
            if (room.status !== currentStatus) {
                room.status = currentStatus;
                await room.save();
                console.log(`Room ${room.nameRoom} status updated to: ${room.status}`);
            }
        }
    },
};

export default ScheduleController;
