FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
EXPOSE 8081
WORKDIR /app
COPY . ./


RUN npm cache clean --force
RUN npm install
RUN npm version
CMD ["npm", "run", "serve"]