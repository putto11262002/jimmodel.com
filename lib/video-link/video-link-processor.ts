import { YoutubeAdapter } from "./adapters/youtube-adapter";

export class UnsupportedVideoSourceError extends Error {
  constructor() {
    super("Invalid video source");
  }
}

export class InvalidLinkError extends Error {
  constructor(message?: string) {
    super(message || "Invalid link");
  }
}
export interface VideoInput {
  /**
   * Get the regex matcher for the video source
   */
  getRegexMatcher(): RegExp;
  /**
   * Check if the url is valid
   * @param url
   * @returns boolean
   * @throws {InvalidLinkError}
   */
  matchUrl(url: string): boolean;
  /**
   * Get the video id. This is the unique identifier of the video used by the video source platform.
   * No error should be thrown if the url returned true in the matchUrl.
   * @param url
   * @returns string
   * @throws {InvalidLinkError} if the url is invalid - when the matchUrl returns false
   */
  getVideoId(url: string): string;

  /**
   * Get the video source
   * @param url
   * @returns string
   */
  getVideoSourceName(): string;

  /**
   * Generate the iframe html code
   * @param url
   * @returns string
   * @throws {InvalidLinkError} if the url is invalid - when the matchUrl returns false
   */
  generateIframeSrc(url: string): string;
}

class VideoAdapterFactory {
  private static adapters = [
    new YoutubeAdapter(),
    // Add other adapters here as needed
  ];

  static getAdapter(url: string): VideoInput {
    for (const adapter of this.adapters) {
      if (adapter.matchUrl(url)) {
        return adapter;
      }
    }

    throw new UnsupportedVideoSourceError();
  }
}

export class VideoLinkProcessor {
  private adapter: VideoInput;
  private url: string;

  constructor(url: string) {
    this.adapter = VideoAdapterFactory.getAdapter(url);
    this.url = url;
  }

  getVideoId() {
    return this.adapter.getVideoId(this.url);
  }

  generateIframeSrc() {
    return this.adapter.generateIframeSrc(this.url);
  }

  getVideoSource() {
    return this.adapter.getVideoSourceName();
  }
}
