# Deployment Guide

## Docker Deployment (Local/Server)

```bash
# Build and run
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Cloud Deployment Options

### 1. AWS ECS/Fargate
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t procurement-portal .
docker tag procurement-portal:latest <account>.dkr.ecr.us-east-1.amazonaws.com/procurement-portal:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/procurement-portal:latest
```

### 2. Railway (Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### 3. Render
- Connect GitHub repo
- Set build command: `docker build -t app .`
- Set start command: `docker run -p 8000:8000 app`

### 4. DigitalOcean App Platform
- Connect GitHub repo
- Auto-detects Dockerfile
- Set HTTP port: 8000

### 5. Heroku (with Docker)
```bash
heroku create procurement-portal
heroku container:push web
heroku container:release web
```

## Environment Variables

Set these in production:
- `AUTO_CREATE_DB=true` (for first deployment)
- `DATABASE_URL` (if using external DB)
- `DEBUG=false`

## Database Considerations

**SQLite (Current)**: Good for small-medium deployments
**PostgreSQL**: Recommended for production
**MySQL**: Alternative for production

## SSL/HTTPS

Use a reverse proxy like Nginx or cloud load balancer for SSL termination.