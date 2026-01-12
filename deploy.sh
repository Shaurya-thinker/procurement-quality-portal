#!/bin/bash
# Simple server deployment script

echo "🚀 Deploying Procurement Quality Portal..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3 python3-pip nodejs npm nginx

# Clone/update code
if [ ! -d "/opt/procurement-portal" ]; then
    sudo git clone <your-repo-url> /opt/procurement-portal
else
    cd /opt/procurement-portal && sudo git pull
fi

cd /opt/procurement-portal

# Backend setup
cd backend
sudo pip3 install -r requirements.txt
export AUTO_CREATE_DB=true
alembic upgrade head

# Frontend setup
cd ../frontend
npm install
npm run build

# Copy frontend build to nginx
sudo cp -r dist/* /var/www/html/

# Start backend service
cd ../backend
nohup python3 -m app.main > /var/log/procurement-portal.log 2>&1 &

echo "✅ Deployment complete!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost (via Nginx)"