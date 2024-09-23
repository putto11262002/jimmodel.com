import mitt from "mitt";
import { EventHub, EventMap, WildcardHandler } from "./types";

export class MittEventHub<T extends EventMap> implements EventHub<T> {
  private mitt = mitt<T>();
  constructor() {
    if (process.env.NODE_ENV !== "production") {
      this.onAny((type, event) => {
        console.log(`\x1b[1m[${type.toString()}]\x1b[0m`, event);
      });
    }
  }
  on<K extends keyof T>(eventName: K, fn: (params: T[K]) => void): void {
    return this.mitt.on(eventName, fn);
  }

  onAny(fn: WildcardHandler<T>): void {
    this.mitt.on("*", fn);
  }

  off<K extends keyof T>(eventName: K, fn: (params: T[K]) => void): void {
    return this.mitt.off(eventName, fn);
  }

  emit<K extends keyof T>(eventName: K, params: T[K]): void {
    return this.mitt.emit(eventName, params);
  }
}
