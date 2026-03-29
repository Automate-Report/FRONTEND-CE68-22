FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
#npm i
RUN npm ci

COPY . .

# Set this ARG so it can be passed in during docker-compose build 
# and baked into Next.js static files
ENV NEXT_PUBLIC_API_URL=http://ad14eb44-0070-4ec8-8a76-6d204c46ade0.cloud.ce.kmitl.ac.th/api

# Build the Next.js application
RUN npm run build



FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=http://ad14eb44-0070-4ec8-8a76-6d204c46ade0.cloud.ce.kmitl.ac.th/api

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
