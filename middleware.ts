import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Limit: 3 messages per 1 minute per IP address
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "240 s"), 
})

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/' && request.method === 'POST') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || "127.0.0.1";
    const { success } = await ratelimit.limit(ip)

    if (!success) {
      return NextResponse.json(
        { error: "Too many messages, please wait 4 minutes" }, // <--- Eto yung message
        { status: 429 }
      )
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}