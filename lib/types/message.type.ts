import { RoomType } from "./room.type";

export interface MessageType {
  id: string;
  name: string;
  audioUrl: string;
  selectedRoom: string | RoomType;
}
