import { EventMap } from "@/lib/event-hub";

export const USER_IMAGE_UPDATED_EVENT = Symbol("USER_IMAGE_UPDATED_EVENT");

export interface UserEventMap extends EventMap {
  [USER_IMAGE_UPDATED_EVENT]: { userId: string; fileId: string };
}
