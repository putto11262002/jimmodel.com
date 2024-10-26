export type JsonScalarValue = string | number | boolean | null;

export type JsonArray = JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue;
}

export type JsonValue = JsonScalarValue | JsonArray | JsonObject;
