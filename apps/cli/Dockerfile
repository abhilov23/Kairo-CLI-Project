FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY apps/cli/ ./apps/cli/
RUN pnpm --filter @abhilov/kairo build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/cli/dist ./dist
COPY --from=builder /app/apps/cli/package.json ./

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
