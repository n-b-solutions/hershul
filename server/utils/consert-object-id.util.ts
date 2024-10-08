import { Types } from "mongoose";
/**
 * Convert ObjectId field values inside an object to String type values
 * (includes array of ObjectIds and nested ObjectId fields)
 * @param obj Object - The Object to be converted.
 * @return none
 */
export const convertObjectIdTostring = <DocT = any, T = DocT>(
  obj: DocT,
  convertedObj: T
): any => {
  if (obj == null || typeof obj !== "object") {
    return convertedObj || obj;
  }
  if (obj instanceof Types.ObjectId) {
    return obj.toString();
  }
  Object.entries(obj as object).forEach(
    ([key, value]) =>
      (convertedObj[key] = convertObjectIdTostring(value, convertedObj))
  );
};
