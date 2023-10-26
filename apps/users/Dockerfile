# Development stage
FROM node:20 AS development
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules

RUN npm install --only=production

# Set execute permission
RUN chmod +x /usr/src/app/dist/apps/users/main.js
CMD ["node", "dist/apps/users/main.js"]
