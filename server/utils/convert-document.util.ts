import { MinyanType } from "../../lib/types/minyan.type";
import { RoomType } from "../../lib/types/room.type";
import { MinyanDocument } from "../types/minyan.type";
import { RoomDocument, RoomServerType } from "../types/room.type";
import { convertObjectIdTostring } from "./convert-object-id.util";
import { convertIdsKeys } from "./convert-keys.util";
import { MessageDocument } from "../types/message.type";
import { MessageType } from "../../lib/types/message.type";
import { LuachMinyanDocument } from "../types/luach-minyan.type";
import { LuachMinyanType } from "../../lib/types/luach-minyan.type";

export const convertDocument = <TDocument, T>(document: TDocument): T =>
  convertObjectIdTostring(convertIdsKeys(document));

export const convertMinyanDocument = (
  minyanDocument: MinyanDocument
): MinyanType => convertDocument<MinyanDocument, MinyanType>(minyanDocument);

export const convertRoomDocument = (roomDocument: RoomDocument): RoomType => {
  const room = convertDocument<RoomDocument, RoomType & { ipAddress?: string }>(
    roomDocument
  );
  delete room.ipAddress;
  return room;
};

export const convertRoomDocumentToServerType = (
  roomDocument: RoomDocument
): RoomServerType => {
  const room = convertDocument<RoomDocument, RoomServerType>(roomDocument);
  return room;
};

export const convertMessageDocument = (
  messageDocument: MessageDocument
): MessageType =>
  convertDocument<MessageDocument, MessageType>(messageDocument);

export const convertLuachMinyanDocument = (
  luachMinyanDocument: LuachMinyanDocument
): LuachMinyanType =>
  convertDocument<LuachMinyanDocument, LuachMinyanType>(luachMinyanDocument);
