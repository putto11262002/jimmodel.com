import { MittEventHub } from "./mitt-event-hub";

describe("MittEventHub", () => {
  test("onAny", () => {
    const eventHub = new MittEventHub();
    const handler = jest.fn();
    eventHub.onAny(handler);
    eventHub.emit("foo", "bar");
    expect(handler).toHaveBeenCalledWith("foo", "bar");
  });
});
