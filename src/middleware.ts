import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/travel-planner/page(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  console.log("Middleware executed"); // Basic log to confirm middleware execution
  console.log(`Request URL: ${req.url}`); // Log the request URL
  if (isProtectedRoute(req)) {
    console.log("Protected route accessed"); // Log when a protected route is accessed
    await auth.protect();
  } else {
    console.log("Non-protected route accessed"); // Log when a non-protected route is accessed
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};