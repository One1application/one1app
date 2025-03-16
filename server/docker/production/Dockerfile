# Use a specific node version for stability
FROM node:20

# Switch to root to install system dependencies and set up directories
USER root

# Install OpenSSL 1.1.x
RUN apt-get update -y && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create and set working directory
WORKDIR /usr/src/app

# Create public directories with proper permissions
RUN mkdir -p /usr/src/app/public/temp && \
    chown -R node:node /usr/src/app && \
    chmod -R 777 /usr/src/app/public/temp

# Copy package files
COPY package*.json ./

# Install production dependencies and Prisma CLI
RUN npm ci --only=production && \
    npm install -D prisma && \
    chown -R node:node /usr/src/app/node_modules

# Copy application code and Prisma schema
COPY src/ ./src/
COPY prisma/ ./prisma/
RUN chown -R node:node /usr/src/app

# Generate Prisma Client
RUN npx prisma generate

# Switch back to node user for security
USER node

# Expose the port
EXPOSE 5000

# Set NODE_ENV
ENV NODE_ENV=production

# Start the application
CMD ["node", "src/index.js"]