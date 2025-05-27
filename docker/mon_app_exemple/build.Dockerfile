FROM node:22.13-bookworm-slim AS base
WORKDIR /app
RUN apt update

FROM base AS installer
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@9.1.0
COPY . /app

FROM installer AS build
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --prod
RUN pnpm --filter=mon_app_exemple run build
RUN pnpm --filter=mon_app_exemple --prod deploy ./deploy/mon_app_exemple

FROM base AS production
WORKDIR /app
COPY --from=build /app/apps/mon_app_exemple/build /app
COPY --from=build /app/deploy/mon_app_exemple/node_modules /app/node_modules
EXPOSE 8080
CMD [ "node", "bin/server.js" ]
