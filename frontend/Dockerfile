# Official Node.js runtime as the base image
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# dependencies
RUN npm install

# Copy application code
COPY . .

# Build React app
RUN npm run build

# lightweight web server to serve the static files
FROM nginx:alpine

# Copy the built React app to the Nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
