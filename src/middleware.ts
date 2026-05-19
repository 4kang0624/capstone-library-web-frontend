import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected paths that require authentication
// Note: Since tokens are stored in localStorage (client-side only), the actual
// auth guard happens in (protected)/layout.tsx. This middleware only handles
// server-side accessible tokens (if stored in cookies in the future).
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|images).*)'],
};
