#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Backend Setup & Seed Script${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python 3 found${NC}\n"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
pip install -r requirements.txt > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}\n"

# Run migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
cd backend
alembic upgrade head > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Migrations not available, skipping...${NC}"
fi

# Seed database
echo -e "${YELLOW}🌱 Seeding database with sample data...${NC}"
python3 seed_data.py

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to seed database${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Database seeded${NC}\n"

# Start the server
echo -e "${YELLOW}🚀 Starting backend server on http://0.0.0.0:8000${NC}\n"
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
