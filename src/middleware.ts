import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

function fetchHeaders(request: NextRequest) {
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set("x-url", request.url);

  return NextResponse.next({
    request: {
      headers: reqHeaders,
    },
  });
}

export default authMiddleware({
  beforeAuth: (req) => {
    return fetchHeaders(req);
  },
  afterAuth: () => {},
  publicRoutes: ["/", "/api/generatedPresignedUrl"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
