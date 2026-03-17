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
  limiter: Ratelimit.slidingWindow(10, "240 s"), 
})//four minutes 

export async function middleware(request: NextRequest) {
  // 1. I-target lang ang root path
  if (request.nextUrl.pathname === '/') {
    
    if (request.method === 'POST') {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                 request.headers.get('x-real-ip') || 
                 "127.0.0.1";

      const { success } = await ratelimit.limit(ip)

      if (!success) {
        return NextResponse.json(
          { error: "Stop, please wait for a while 🥭" },
          { status: 429 }
        )
      }
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}