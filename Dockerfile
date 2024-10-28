FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install sharp@0.32.6

# --------------- APP ---------------


FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN ls node_modules/.pnpm

RUN pnpm build:standalone

# ----------------------------------

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./


USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD node server.js


# --------------- BOOTSTRAP ---------------


FROM base As bootstrap_builder	

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm rollup -c rollup.config.seed.js

# ----------------------------------

FROM base AS bootstrap_runner

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

COPY --from=bootstrap_builder /app/dist ./dist

COPY ./db/migrations ./db/migrations

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install sharp@0.32.6

CMD node ./dist/seed-existing.js



