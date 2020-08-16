# Development
FROM node:12.16.0-alpine AS development
ENV NODE_ENV development
ARG PORT=3001
ENV PORT ${PORT}
EXPOSE ${PORT} 9229 9230
# Set global npm dependencies to be stored under the node user directory
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
# node-gyp is a common requirement for NPM packages. It must be installed as root.
RUN apk update && \
    apk add --no-cache git=~2.24 && \
    apk add --no-cache --virtual .gyp python=~2.7 make=~4.2 g++=~9.2
USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./
RUN npm install --production=false
COPY --chown=node:node . .
USER node
CMD [ "npm", "run", "start:watch" ]

# Production
FROM development AS production
ENV NODE_ENV production
RUN npm ci
CMD [ "node", "app" ]
