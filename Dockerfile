# Optimized production Dockerfile for Next.js App Router
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install necessary packages for Prisma and builds
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev for building)
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder

# Install build dependencies
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Generate Prisma client (if needed)
RUN if [ -f "prisma/schema.prisma" ]; then npx prisma generate; fi

# Build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Copy environment variables for build (required for NEXT_PUBLIC_ vars)
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXTAUTH_URL
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Use production config if exists
RUN if [ -f "next.config.prod.js" ]; then cp next.config.prod.js next.config.js; fi

# Build the application with optimizations
RUN npm run build:prod

# Production image
FROM base AS runner

WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache \
    curl \
    openssl \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy public assets (if exists)
COPY --from=builder /app/public ./public

# Create .next directory with proper permissions
RUN mkdir .next && chown nextjs:nodejs .next

# Copy built application (standalone includes everything needed for App Router)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files only if they exist
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma 
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma 

# Scripts are not needed in production container

# Create logs directory
RUN mkdir -p logs && chown nextjs:nodejs logs

# Switch to nextjs user
USER nextjs

# Expose port
EXPOSE 3000

# Health check for App Router
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application (standalone server.js works for App Router)
CMD ["node", "server.js"]