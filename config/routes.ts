const routes = {
  getFiles: (fileId: string) => `/files/${fileId}`,
} as const;
export default routes;
