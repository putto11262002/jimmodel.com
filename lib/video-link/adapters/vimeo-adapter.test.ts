import { VimeoAdapter } from "./vimeo-adapter";

test("VimeoAdpter", () => {
  const urls = [
    {
      url: "https://vimeo.com/channels/bestofstaffpicks/1006042481?autoplay=1",
      videoId: "1006042481",
      valid: true,
    },
    {
      url: "https://vimeo.com/935900769",
      videoId: "935900769",
      valid: true,
    },
    {
      url: "https://www.youtube.com/watch?v=PVX1wUqWGkY&t=444s",
      valid: false,
    },
  ];

  const adapter = new VimeoAdapter();
  urls.forEach(({ url, videoId, valid }) => {
    const result = adapter.process(url);
    if (!valid) {
      expect(result).toBeNull();
      return;
    }
    expect(result).not.toBeNull();
    expect(result!.videoId).toBe(videoId);
  });
});
