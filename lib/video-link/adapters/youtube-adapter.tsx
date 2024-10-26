import { VideoIframe, VideoIframeStrategy } from "../video-iframe-procressor";

export class YoutubeAdapter implements VideoIframeStrategy {
  private readonly regex =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(\?\S*)?$/;

  process(url: string): VideoIframe | null {
    const matchArr = url.match(this.regex);
    if (!matchArr) {
      return null;
    }
    if (matchArr.length < 2) {
      return null;
    }
    const videoId = matchArr[1];
    return {
      iframeSrc: `https://www.youtube.com/embed/${videoId}`,
      videoSource: "youtube",
      videoId: videoId,
    };
  }
}
