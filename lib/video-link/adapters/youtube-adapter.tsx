import { InvalidLinkError, VideoInput } from "../video-link-processor";

export class YoutubeAdapter implements VideoInput {
  private readonly linkPattern =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(\?\S*)?$/;
  getRegexMatcher(): RegExp {
    return this.linkPattern;
  }

  matchUrl(url: string): boolean {
    return this.linkPattern.test(url);
  }

  getVideoId(url: string): string {
    const regexArr = url.match(this.linkPattern);
    if (!regexArr) {
      throw new InvalidLinkError();
    }
    if (regexArr.length < 2) {
      throw new InvalidLinkError("Cannot extract video id from the link");
    }
    return regexArr[1];
  }

  getVideoSourceName(): string {
    return "youtube";
  }

  generateIframeSrc(url: string): string {
    const videoId = this.getVideoId(url);
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
