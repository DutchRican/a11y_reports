# Stage 1: Build frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY . .
RUN npm install && \
	npm run build && \
	rm -rf ./node_modules

# Stage 2: Build backend
FROM node:22-alpine AS backend-builder
WORKDIR /app/server
ENV NODE_ENV=production
COPY server/package*.json ./
RUN npm install && \
	npm prune production
COPY server .

# Stage 3: Runtime
FROM node:22-alpine
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/dist ./dist
COPY --from=backend-builder /app/server ./

# Copy required files
COPY server/.env ./server/.env

# Expose ports
EXPOSE 5173 3001 27017

# Start application
CMD ["npm", "run", "start"]