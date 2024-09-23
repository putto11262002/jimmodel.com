import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import geoip from "geoip-lite";

export const getIP = async (headerList: ReadonlyHeaders) => {
  let ipAddress = headerList.get("x-real-ip") as string;

  const forwardedFor = headerList.get("x-forwarded-for") as string;
  if (!ipAddress && forwardedFor) {
    ipAddress = forwardedFor?.split(",").at(0) ?? "Unknown";
  }
  return ipAddress;
};

export const getIPGeo = async (ip: string) => {
  const geo = geoip.lookup(ip);
  return geo;
};
