import { auth } from "./auth";

export default auth((request) => {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin") && !request.auth?.user?.email) {
    const loginUrl = new URL("/admin/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
