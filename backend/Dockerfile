# Stage 1: Build the Rust app
FROM alpine:latest as build

# Install Rust & necessary system dependencies
RUN apk add --no-cache rust cargo build-base musl-dev

# Install Rust, Cargo, build tools, OpenSSL, and pkg-config
RUN apk add --no-cache rust cargo build-base musl-dev pkgconfig openssl-dev

# Set the working directory
WORKDIR /app

# Copy Cargo files first for caching dependencies
COPY Cargo.toml Cargo.lock ./

# Build dependencies (this step is cached)
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release

# Copy the rest of the application code
COPY . .

# Build the application
RUN cargo build --release

# Stage 2: Run the Rust app
FROM alpine:latest

# Install system dependencies (if needed)
RUN apk add --no-cache libgcc

# Copy the built binary from the build stage
COPY --from=build /app/target/release/crynk-backend /usr/local/bin/crynk-backend

# Expose the backend port
EXPOSE 8080

# Set the environment variables (if needed)
ENV "DATABASE_URL mysql://crynk:1NeSSie$21987@crynk-cluster-db.czc00ei667ah.eu-north-1.rds.amazonaws.com:3306/crynk"

# Run the backend
CMD ["crynk-backend"]
