import MinyanListModel from "../models/minyanListModel";
import RoomStatusModel from "../models/roomStatusModel";
interface Room {
    nameRoom: string;
    status: string;
}
const ScheduleController = {
    updateRoomStatuses: async (): Promise<Room[]> => {
        const now = new Date();
        const updates: Room[] = []; // רשימת העדכונים

        const minyans = await MinyanListModel.find();
        const roomStatusMap = new Map<string, 'on' | 'off'>();
        
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
                 // הוספת החדר המעדכן לרשימת העדכונים
            }
            updates.push(room);
        }

        return updates; // החזרת רשימת החדרים המעדכנים
    },
};

export default ScheduleController;
