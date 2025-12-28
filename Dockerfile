# ==============================================================================
# BASE STAGE - Foundation for all other stages
# ==============================================================================
# Use Node.js 18 Alpine Linux (lightweight version ~5MB vs ~900MB for full Node)
# AS base: Names this stage for reference in later stages
FROM node:18-alpine AS base

# Set working directory as environment variable for reusability
# All subsequent commands will execute relative to this directory
ENV DIR=/usr/src/app

# Create and set the working directory inside the container
# If the directory doesn't exist, Docker creates it automatically
WORKDIR $DIR

# ==============================================================================
# DEVELOPMENT STAGE - For local development with hot-reload
# ==============================================================================
# Inherits from the base stage (includes Node 18 Alpine + WORKDIR setup)
FROM base AS development

# Copy dependency manifests first (package.json and package-lock.json)
# Copying these separately allows Docker to cache this layer if dependencies haven't changed
COPY package*.json $DIR

# Copy TypeScript configuration files
# tsconfig.json: Main TS config, tsconfig.build.json: Build-specific config
COPY tsconfig*.json $DIR

# Copy source code directory
# Contains all TypeScript source files (.ts files)
COPY src $DIR/src

# Copy static assets directory
# Contains images, CSS, HTML, or other static files served by the application
COPY static $DIR/static

# Copy all environment files (.env, .env.development, .env.production)
# The wildcard * matches any characters after .env
COPY .env.* $DIR

# Install ALL dependencies (including devDependencies)
# npm install: Reads package.json and installs everything, including dev tools
# Used in development because we need tools like nodemon, TypeScript compiler, etc.
RUN npm install

# Expose the application port (dynamic based on environment variable)
# This is a documentation feature - doesn't actually open the port
EXPOSE ${PORT}

# Expose debugger port for Node.js debugging
# Port 9229 is the standard Node.js inspector/debugger port
EXPOSE 9229

# Command to run when container starts
# npm run start:dev: Typically runs nodemon or similar for hot-reload development
CMD ["npm", "run", "start:dev" ]


# ==============================================================================
# BUILD STAGE - Compiles TypeScript and prepares for production
# ==============================================================================
# Starts fresh from base (clean slate without development dependencies)
FROM base AS build

# Update Alpine package manager and install dumb-init
# apk: Alpine Linux package manager
# --no-cache: Don't store the package index locally (saves space)
# dumb-init: Lightweight init system that properly handles signals and zombie processes
RUN apk update && apk add --no-cache dumb-init

# Copy dependency manifests
COPY package*.json $DIR
COPY tsconfig*.json $DIR

# Copy source code and static assets
COPY src $DIR/src
COPY static $DIR/static
COPY .env.* $DIR

# Install ONLY production dependencies (no devDependencies)
# npm ci: "clean install" - faster and more reliable than npm install
# Uses package-lock.json exactly as-is (doesn't modify it)
# Deletes node_modules first to ensure clean state
RUN npm ci

# Build the TypeScript application and remove dev dependencies
# npm run build: Compiles TypeScript (.ts) to JavaScript (.js) in the dist/ folder
# npm prune --production: Removes devDependencies, keeping only production packages
# && chains commands - second command only runs if first succeeds
RUN npm run build && \
    npm prune --production

# ==============================================================================
# PRODUCTION STAGE - Final optimized image for deployment
# ==============================================================================
# Starts fresh from base - this is the final image that will be deployed
# Only contains what's copied from the build stage (no source code, no dev dependencies)
FROM base AS production

# Set Node.js environment to production
# Affects various behaviors: disables dev tools, optimizes performance, etc.
ENV NODE_ENV=production

# Set the user that will run the application
# node: Pre-existing non-root user in the Node.js Alpine image
ENV USER=node

# Copy only the necessary artifacts from the build stage
# --from=build: Pulls files from the "build" stage instead of the host machine
# This keeps the final image small and secure

# Copy dumb-init binary from build stage
# dumb-init: Handles signals (SIGTERM, SIGINT) properly and reaps zombie processes
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

# Copy production node_modules (dev dependencies already removed)
# Only contains packages needed to run the app, not build it
COPY --from=build $DIR/node_modules $DIR/node_modules

# Copy compiled JavaScript code
# dist/: Contains the transpiled TypeScript code ready to execute
COPY --from=build $DIR/dist $DIR/dist

# Copy static assets
COPY --from=build $DIR/static $DIR/static

# Copy the environment file specific to production
# ${NODE_ENV} expands to "production", so it copies .env.production
COPY --from=build $DIR/.env.${NODE_ENV} $DIR 

# Expose the application port
# Container will listen on this port (actual port value comes from ENV variable)
EXPOSE ${PORT}

# Switch from root user to node user for security
# Running as non-root prevents potential security exploits
# ${USER} expands to "node" (defined in ENV USER=node above)
USER ${USER}

# Command to run when container starts
# dumb-init: Wrapper that properly handles process signals
# node dist/main: Runs the compiled JavaScript entry point
# Format: ["executable", "arg1", "arg2"] (exec form - preferred for proper signal handling)
CMD ["dumb-init", "node", "dist/main" ]