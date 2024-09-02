export function nextImageLoader(asset: string, width: number) {
  return `/_next/image?url=${encodeURIComponent(`${asset}`)}&w=${width}&q=75`;
}
