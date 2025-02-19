import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute  = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/accept(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if ((await auth()).userId && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/groups", req.url));
  }

  if (!isPublicRoute (req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

