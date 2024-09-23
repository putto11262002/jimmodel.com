import { FacebookAdapter } from "./facebook-adapter";

test("FacebookAdapter", () => {
  const urls = [
    {
      url: "https://vimeo.com/channels/bestofstaffpicks/1006042481?autoplay=1",
      valid: false,
    },
    {
      url: "https://web.facebook.com/watch?v=1060162925683341",
      valid: true,
      videoId: "1060162925683341",
    },
    {
      url: "https://web.facebook.com/jimmodeling/videos/380614781790539",
      valid: true,
      videoId: "380614781790539",
    },
  ];

  const adapter = new FacebookAdapter();
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
