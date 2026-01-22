import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

export function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const { pathname } = request.nextUrl;
    
    // user NOT logged in and trying to access protected page
    if (!token && !publicRoutes.includes(pathname)) {
        console.log("Redirecting to /login");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // user logged in but trying to access public page
    if (token && publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/main", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};