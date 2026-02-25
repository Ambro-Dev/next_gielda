const rateLimit = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple in-memory rate limiter.
 * Returns true if request is allowed, false if rate limit exceeded.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = rateLimit.get(key);

  if (!record || now > record.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up expired entries periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimit.entries()) {
      if (now > record.resetTime) {
        rateLimit.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
