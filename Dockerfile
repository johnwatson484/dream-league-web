# Development
FROM node:24-alpine AS development

ENV TZ="Europe/London"
ENV NODE_ENV=development

ARG PORT=3000
ARG PORT_DEBUG=9229
ENV PORT=${PORT}
EXPOSE ${PORT} ${PORT_DEBUG}

USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .

CMD ["node", "src"]

# Production build
FROM development AS production_build

ENV NODE_ENV=production
RUN npm run build:frontend

# Production
FROM node:24-alpine AS production

ENV TZ="Europe/London"
ENV NODE_ENV=production

USER root
RUN apk add --no-cache curl

WORKDIR /home/node/app

COPY --from=production_build --chown=root:root /home/node/package*.json ./
COPY --from=production_build --chown=root:root /home/node/src ./src/
COPY --from=production_build --chown=root:root /home/node/.public ./.public/

RUN npm ci --omit=dev

RUN chmod -R a-w /home/node/app

USER node

ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["node", "src"]
