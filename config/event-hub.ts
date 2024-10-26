import { EventHub, MittEventHub } from "@/lib/event-hub";
import { JobEventMap } from "@/lib/usecases/job/event";
import { ModelEventMap } from "@/lib/usecases/model/event";
import { UserEventMap } from "@/lib/usecases/user/event";

export type AppEventHub = {
  globalEventHub: EventHub<ModelEventMap & JobEventMap & UserEventMap>;
};

export const eventHubFactory = async (): Promise<AppEventHub> => {
  const globalEventHub = new MittEventHub<
    ModelEventMap & JobEventMap & UserEventMap
  >();
  return { globalEventHub };
};
