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

export type VideoIframe = {
  iframeSrc: string;
  videoSource: string;
  videoId: string;
};
export interface VideoIframeStrategy {
  process(url: string): VideoIframe | null;
}

export class VideoIframeProcressor {
  private readonly adapters: VideoIframeStrategy[];
  constructor(adapters: VideoIframeStrategy[]) {
    this.adapters = adapters;
  }

  process(url: string): VideoIframe | null {
    for (const adapter of this.adapters) {
      const result = adapter.process(url);
      if (result) {
        return result;
      }
    }
    return null;
  }
}
