import { YoutubeAdapter } from "./youtube-adapter";

test("YoutubeAdapter", () => {
  const urls = [
    {
      url: "https://www.youtube.com/watch?v=TT_RLWmIsbY",
      videoId: "TT_RLWmIsbY",
      valid: true,
    },
    {
      url: "https://youtu.be/TT_RLWmIsbY?si=_gH6jybEr0thZ11S",
      videoId: "TT_RLWmIsbY",
      valid: true,
    },
    {
      url: "https://vimeo.com/channels/bestofstaffpicks/1006042481?autoplay=1",
      valid: false,
    },
  ];
  const adapter = new YoutubeAdapter();
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
