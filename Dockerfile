# ==============================================
# Stage 1: Build React Frontend
# ==============================================
FROM node:18-alpine AS frontend-build

WORKDIR /app/testing-dashboard

# Copy package files first for better layer caching
COPY testing-dashboard/package.json testing-dashboard/package-lock.json* ./
RUN npm ci --silent

# Copy source and build
COPY testing-dashboard/ ./
RUN npm run build

# ==============================================
# Stage 2: Production Server
# ==============================================
FROM node:18-alpine AS production

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy backend package files and install production deps
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm ci --omit=dev --silent

# Copy backend source
COPY backend/ ./backend/

# Copy built React app from stage 1
COPY --from=frontend-build /app/testing-dashboard/build ./testing-dashboard/build

# Create database directory with correct ownership
RUN mkdir -p /app/database && chown -R appuser:appgroup /app/database

# Copy database files (will be overridden by volume mount in docker-compose)
COPY database/ ./database/

# Set ownership for the entire app directory
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the backend port
EXPOSE 3001

# Healthcheck: verify the API is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/dashboard/stats || exit 1

# Start the backend server (which also serves the React build)
CMD ["node", "backend/server.js"]
