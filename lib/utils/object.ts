type FlatObject = { [key: string]: any };
export function flattenObject(
  obj: Record<string, any>,
  parentKey: string = "",
  result: FlatObject = {}
): FlatObject {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          // Handle arrays by using index for keys
          obj[key].forEach((item, index) => {
            flattenObject(item, `${newKey}[${index}]`, result);
          });
        } else {
          // Recursively flatten objects
          flattenObject(obj[key], newKey, result);
        }
      } else {
        // If it's a primitive value, add to the result
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}
