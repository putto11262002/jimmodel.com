import { VideoIframe, VideoIframeStrategy } from "../video-iframe-procressor";

export class FacebookAdapter implements VideoIframeStrategy {
  private readonly regex =
    /(?:https?:\/\/)?(?:www\.|web\.|m\.)?(?:facebook|fb)\.(?:com|watch)\/(?:video\.php\?v=(\d+)|watch\/?\?v=(\d+)|\S+\/videos\/(?:(\S+)\/(\d+)|(\d+)))\/?/;
  process(url: string): VideoIframe | null {
    const matchArr = url.match(this.regex);
    if (!matchArr) {
      return null;
    }
    if (matchArr.length < 2) {
      return null;
    }
    const videoId = matchArr.find(
      (x) => typeof x === "string" && x.match(/^\d+$/)
    );
    if (!videoId) {
      return null;
    }

    return {
      iframeSrc: `https://www.facebook.com/plugins/video.php?href=${url}&show_text=0&width=560`,
      videoSource: "facebook",
      videoId: videoId,
    };
  }
}
