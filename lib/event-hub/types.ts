export type EventName = string | symbol;
export type EventMap = Record<EventName, any>;

export type EventMapKey<T> = keyof T;

export type Handler<T = unknown> = (params: T) => void;

export type WildcardHandler<T> = (
  type: EventMapKey<T>,
  event: T[keyof T]
) => void;

export interface EventHub<T extends EventMap> {
  on<K extends EventMapKey<T>>(eventName: K, fn: Handler<T[K]>): void;
  onAny(fn: WildcardHandler<T>): void;
  off<K extends EventMapKey<T>>(eventName: K, fn: Handler<T[K]>): void;
  emit<K extends EventMapKey<T>>(eventName: K, params: T[K]): void;
}

export interface ReadonlyEventHub<T extends EventMap> {
  on<K extends EventMapKey<T>>(eventName: K, fn: Handler<T[K]>): void;
  onAny(fn: WildcardHandler<T>): void;
  off<K extends EventMapKey<T>>(eventName: K, fn: Handler<T[K]>): void;
}
