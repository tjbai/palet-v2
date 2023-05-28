import { authMiddleware } from "@clerk/nextjs";
import { AuthObject } from "@clerk/nextjs/dist/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

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
  beforeAuth: (auth: NextRequest, evt: NextFetchEvent) => {
    return fetchHeaders(auth);
  },
  afterAuth: (
    auth: AuthObject & {
      isPublicRoute: boolean;
    },
    req: NextRequest
  ) => {
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  },
  publicRoutes: ["/", "/api/webhooks(.*)"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
