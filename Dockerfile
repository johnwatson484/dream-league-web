# Development
FROM node:18-alpine AS development
ENV NODE_ENV development
ARG PORT=3000
ENV PORT ${PORT}
EXPOSE ${PORT} 9229
# Set global npm dependencies to be stored under the node user directory
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Add Git
RUN apk update && \
    apk add --no-cache git

USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node ./app ./app
COPY --chown=node:node ./test ./test
COPY --chown=node:node ./.git ./.git
CMD [ "npm", "run", "start:watch" ]

# Production
FROM development AS production
ENV NODE_ENV production
RUN npm ci
CMD [ "node", "app" ]
