# Stage 1: Build frontend
FROM node:22 as frontend-builder
WORKDIR /app
COPY . .
RUN npm install && \
	npm run build

# Stage 2: Build backend
FROM node:22 as backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server .

# Stage 3: Runtime
FROM node:22
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/dist ./dist
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/package*.json ./

# Copy built backend
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/package*.json ./server/
COPY --from=backend-builder /app/server .

# Copy required files
COPY server/.env.example ./server/.env

# Expose ports
EXPOSE 5173 3001 27017

# Start application
CMD ["npm", "run", "start"]