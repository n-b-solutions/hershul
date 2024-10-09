import { Types } from "mongoose";
import { isObject } from "./object.util";

/**
 * Convert ids keys
 * (includes nested fields)
 * 1. convert _id key to id
 * 2. cut the end of populate key that end with 'Id' 
 * @param obj Object - The Object to be converted.
 * @param currentKey string - The key to convert
 * @return converted object
 */
export const convertIdsKeys = (obj: any, currentKey?: string): any => {
  let convertedKey = currentKey;
  if (currentKey?.endsWith("Id") && !(obj instanceof Types.ObjectId)) {
    convertedKey = currentKey.slice(0, -2);
  }
  if (currentKey?.startsWith("_id")) {
    convertedKey = currentKey.slice(1);
  }
  if (!isObject(obj)) {
    return convertedKey ? { [convertedKey]: obj } : obj;
  }
  let convertedObj;
  Object.entries(obj as object).forEach(
    ([key, value]) =>
      (convertedObj = { ...convertedObj, ...convertIdsKeys(value, key) })
  );
  return convertedKey ? { [convertedKey]: convertedObj } : convertedObj;
};
