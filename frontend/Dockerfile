# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json tsconfig.json vite.config.ts ./
COPY index.html ./
COPY src ./src
RUN npm install && npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
