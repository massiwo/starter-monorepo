# base.Dockerfile – image de base mutualisée

FROM node:22.13-bookworm-slim AS base

WORKDIR /app

# Activation de corepack pour PNPM si utilisé
RUN corepack enable
