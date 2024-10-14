export const isObject = (obj: object) => {
  return !!obj && obj.constructor === Object;
};
