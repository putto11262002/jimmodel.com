export async function blobToFile(blob: Blob) {
  return <File>Object.assign(blob);
}
