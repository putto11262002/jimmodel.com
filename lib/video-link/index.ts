import { FacebookAdapter } from "./adapters/facebook-adapter";
import { VimeoAdapter } from "./adapters/vimeo-adapter";
import { YoutubeAdapter } from "./adapters/youtube-adapter";
import { VideoIframeProcressor } from "./video-iframe-procressor";

export const videoIframeProcessor = new VideoIframeProcressor([
  new FacebookAdapter(),
  new YoutubeAdapter(),
  new VimeoAdapter(),
]);
