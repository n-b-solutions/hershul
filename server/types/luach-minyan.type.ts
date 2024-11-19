import { ObjectId } from "mongodb";

import { MinyanDocument } from "./minyan.type";
import {
  eJewishTimeOfDay,
  eRelativeTime,
} from "../../lib/types/luach-minyan.type";
export interface LuachMinyanDocument
  extends Omit<MinyanDocument, "startDate" | "endDate"> {
  timeOfDay: {
    value: eJewishTimeOfDay;
    messageId?: ObjectId;
  };
  relativeTime: eRelativeTime;
  duration: {
    value: number;
    messageId?: ObjectId;
  };
}
