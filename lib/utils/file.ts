export const blobToFile = (blob: Blob, fileName: string): File => {
  const b: any = blob;
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;

  //Cast to a File() type
  return blob as File;
};
