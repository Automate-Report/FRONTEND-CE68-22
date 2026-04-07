FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
#npm i
RUN npm ci

COPY . .

# Set this ARG so it can be passed in during docker-compose build 
# and baked into Next.js static files
ENV NEXT_PUBLIC_API_URL=http://herosuit3-pc.tail8a5063.ts.net/api
ENV NEXT_PUBLIC_AES_KEY=Jyva4RqLYTPIF2ssYx1wtzAIf0YeY3mH
# Build the Next.js application
RUN npm run build



FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=http://herosuit3-pc.tail8a5063.ts.net/api
ENV NEXT_PUBLIC_AES_KEY=Jyva4RqLYTPIF2ssYx1wtzAIf0YeY3mH
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
