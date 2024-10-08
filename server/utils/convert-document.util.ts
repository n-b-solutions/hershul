import { MinyanType } from "../../lib/types/minyan.type";
import { RoomType } from "../../lib/types/room.type";
import { MinyanDocument } from "../types/minyan.type";
import { RoomDocument } from "../types/room.type";
import { convertObjectIdTostring } from "./consert-object-id.util";

export const convertMinyanDocument = (minyanDocument: MinyanDocument): MinyanType => {
    const {_id, ...minyan} = convertObjectIdTostring(minyanDocument, {});
    return {...minyan, id: _id}

}
export const convertRoomDocument = (roomDocument: RoomDocument): RoomType => {
    const {_id, ...room} = convertObjectIdTostring(roomDocument, {});
    return {...room, id: _id}
}