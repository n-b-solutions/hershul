import { Types } from "mongoose";
import { isObject } from "./object.util";

/**
 * Convert ObjectId field values inside an object to String type values
 * (includes nested ObjectId fields)
 * @param obj Object - The Object to be converted.
 * @param convertedObj Object - The converted Object result
 * @return none
 */
export const convertObjectIdTostring = (obj: any, convertedObj = {}): any => {
  if (obj instanceof Types.ObjectId) {
    return obj.toString();
  }
  if (!isObject(obj)) {
    return obj;
  }
  Object.entries(obj as object).forEach(([key, value]) => {
    convertedObj[key] = convertObjectIdTostring(value);
  });
  return convertedObj;
};
