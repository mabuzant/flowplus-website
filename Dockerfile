FROM node:20-alpine

WORKDIR /app

# install deps first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# app source (static site + server)
COPY . .

ENV NODE_ENV=production
# Railway injects PORT; the server falls back to 3000 locally.
EXPOSE 3000

CMD ["node", "server.js"]
