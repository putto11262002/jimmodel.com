import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import requestIp from "request-ip";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  // Set the real IP address of the client
  let ipAddress = request.headers.get("x-real-ip") as string;
  const forwardedFor = request.headers.get("x-forwarded-for") as string;

  if (!ipAddress && forwardedFor) {
    ipAddress = forwardedFor?.split(",").at(0) ?? "Unknown";
  }
  requestHeaders.set("x-real-ip", ipAddress);

  // Set the URL, origin, and pathname of the request
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname;
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
