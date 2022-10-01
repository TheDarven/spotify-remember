FROM node:14-alpine as base

WORKDIR /usr/src/app

# Set environment
ENV NODE_ENV=production

# Install dependencies
COPY package*.json .
COPY tsconfig.json .
COPY prisma ./prisma

# Copy source code into image
COPY src ./src

RUN npm ci

EXPOSE 8000
CMD ["npm", "run", "start"]
