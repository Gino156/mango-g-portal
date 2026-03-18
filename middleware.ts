import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "240 s"), 
})

export async function middleware(request: NextRequest) {
  // I-limit lang ang POST request (Form submission)
  if (request.nextUrl.pathname === '/' && request.method === 'POST') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || "127.0.0.1";
    const { success } = await ratelimit.limit(ip)

    if (!success) {
      // MAG-RETURN NG RESPONSE NA MAY 429 STATUS PARA MA-CATCH NG TRY-CATCH SA UI
      return new NextResponse(
        JSON.stringify({ error: "Masyado ka nang madaldal! Chill muna ng 4 minutes. 🥭" }),
        { status: 429, headers: { 'content-type': 'application/json' } }
      )
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}