export async function blobToFile(blob: Blob) {
  return <File>Object.assign(blob);
}

export async function newFile(
  parts: BlobPart[],
  filename: string,
  options: FilePropertyBag,
) {
  return <File>Object.assign(new Blob(parts, options), { name: filename });
}
