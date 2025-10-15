# Docker Setup for Event Board Website

This guide explains how to run the Event Board Website using Docker for both development and production environments.

## Files Overview

- `Dockerfile` - Production build (multi-stage with Nginx)
- `Dockerfile.dev` - Development build (with hot reloading)
- `docker-compose.yml` - Basic production setup
- `docker-compose.prod.yml` - Full production stack with database
- `docker-compose.dev.yml` - Development environment
- `nginx.conf` - Nginx configuration for production
- `.dockerignore` - Files to exclude from Docker build
- `.env.example` - Environment variables template

## Quick Start

### Development Environment

1. **Clone the repository and navigate to the project directory**
   ```bash
   cd EventBoardWebsite
   ```

2. **Start development environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:4200
   - Hot reloading is enabled for code changes

### Production Environment

1. **Build and run production container**
   ```bash
   docker-compose up --build -d
   ```

2. **Access the application**
   - Frontend: http://localhost

## Detailed Instructions

### Production Deployment

1. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Build the production image**
   ```bash
   docker build -t event-board-website .
   ```

3. **Run with full stack (including database)**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Check container status**
   ```bash
   docker-compose ps
   ```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DB_PASSWORD=your_secure_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# API Configuration
FRONTEND_API_URL=http://localhost:3000/api
```

## Container Details

### Production Container (Dockerfile)

- **Base Images**: 
  - Build stage: `node:18-alpine`
  - Runtime stage: `nginx:alpine`
- **Size**: ~50MB (optimized)
- **Features**:
  - Multi-stage build for smaller image size
  - Nginx for serving static files
  - Gzip compression enabled
  - Security headers configured
  - Health check endpoint

### Development Container (Dockerfile.dev)

- **Base Image**: `node:18-alpine`
- **Features**:
  - Angular CLI pre-installed
  - Hot reloading enabled
  - File watching with polling
  - Development dependencies included

## Build Optimization

The production Dockerfile uses several optimization techniques:

1. **Multi-stage build** - Separates build and runtime environments
2. **Alpine Linux** - Smaller base image
3. **npm ci** - Faster, more reliable dependency installation
4. **Static file serving** - Nginx for optimal performance
5. **Gzip compression** - Reduced bandwidth usage
6. **Caching layers** - Docker layer caching for faster rebuilds

## Commands Reference

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Build development image
docker build -f Dockerfile.dev -t event-board-dev .

# Run development container
docker run -p 4200:4200 -v $(pwd):/app event-board-dev
```

### Production

```bash
# Build production image
docker build -t event-board-website .

# Run production container
docker run -p 80:80 event-board-website

# Start full production stack
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop and remove containers
docker-compose down
```

### Maintenance

```bash
# Remove unused images
docker image prune

# Remove all containers and volumes
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Update containers
docker-compose pull
docker-compose up -d
```

## Nginx Configuration

The production setup uses Nginx with the following features:

- **SPA Routing**: Handles Angular routing with `try_files`
- **Gzip Compression**: Reduces file sizes
- **Caching**: Static assets cached for 1 year
- **Security Headers**: XSS protection, frame options, etc.
- **Health Check**: `/health` endpoint for monitoring

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :80
   
   # Use different port
   docker run -p 8080:80 event-board-website
   ```

2. **Permission issues on Linux/Mac**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Hot reloading not working in development**
   - Ensure `CHOKIDAR_USEPOLLING=true` is set
   - Volume mount is correct: `-v $(pwd):/app`

4. **Build fails**
   ```bash
   # Clear Docker cache
   docker system prune -a
   
   # Rebuild from scratch
   docker-compose build --no-cache
   ```

### Debugging

```bash
# Enter running container
docker exec -it <container_id> sh

# View container logs
docker logs <container_id>

# Check container resource usage
docker stats

# Inspect container
docker inspect <container_id>
```

## Production Considerations

### Performance

1. **Resource Limits**: Set memory and CPU limits in docker-compose.prod.yml
2. **Health Checks**: Configure appropriate health check intervals
3. **Logging**: Set up log rotation and centralized logging
4. **Monitoring**: Use tools like Prometheus/Grafana for monitoring

### Security

1. **Environment Variables**: Never commit secrets to version control
2. **User Permissions**: Run containers as non-root user
3. **Network Security**: Use custom networks for container isolation
4. **Image Scanning**: Regularly scan images for vulnerabilities

### Scaling

1. **Load Balancing**: Use nginx or cloud load balancers
2. **Database**: Use managed database services in production
3. **CDN**: Serve static assets through a CDN
4. **Container Orchestration**: Consider Kubernetes for large deployments

## Backup and Recovery

```bash
# Backup database (if using PostgreSQL)
docker exec postgres_container pg_dump -U eventboard eventboard > backup.sql

# Restore database
docker exec -i postgres_container psql -U eventboard eventboard < backup.sql

# Backup volumes
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data
```

This Docker setup provides a robust foundation for both development and production deployment of the Event Board Website.