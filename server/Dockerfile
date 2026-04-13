# Node API for AWS App Runner, ECS Fargate, Elastic Beanstalk (Docker), or EC2.
# Set MONGODB_URI to MongoDB Atlas or AWS DocumentDB in the service environment.

FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY index.js seed.js ./
COPY models ./models

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "index.js"]
