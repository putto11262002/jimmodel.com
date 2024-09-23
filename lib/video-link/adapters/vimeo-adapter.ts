import { VideoIframe, VideoIframeStrategy } from "../video-iframe-procressor";

export class VimeoAdapter implements VideoIframeStrategy {
  private readonly regex =
    /(?:http|https)?:?\/?\/?(?:www\.)?(?:player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;

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
      iframeSrc: `https://player.vimeo.com/video/${videoId}`,
      videoSource: "vimeo",
      videoId: videoId,
    };
  }
}
