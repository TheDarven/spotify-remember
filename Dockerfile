FROM node:14-alpine as base

WORKDIR /usr/src/app

# Set environment
ENV NODE_ENV=production

# Install dependencies
COPY package*.json ./

RUN npm ci

# Copy source code into image
COPY . .

EXPOSE 8000
CMD ["npm", "run", "start"]