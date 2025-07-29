#!/bin/bash

# Deploy from dev to production script
# Usage: ./deploy-to-production.sh

set -e  # Exit on any error

echo "🚀 Starting deployment from dev to production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DEV_REPO_PATH="/Users/seandinwiddie/GitHub/preview.adultstherapy.com"
PROD_REPO_PATH="/Users/seandinwiddie/Documents/GitHub/adultstherapy.com"
BACKUP_DIR="/tmp/adultstherapy-backup-$(date +%Y%m%d-%H%M%S)"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "$DEV_REPO_PATH" ] || [ ! -d "$PROD_REPO_PATH" ]; then
    print_error "Repository paths not found. Please check the paths in the script."
    exit 1
fi

# Step 1: Create backup of production
print_status "Creating backup of production repository..."
cp -r "$PROD_REPO_PATH" "$BACKUP_DIR"
print_status "Backup created at: $BACKUP_DIR"

# Step 2: Check for uncommitted changes in both repos
echo "🔍 Checking for uncommitted changes..."

cd "$DEV_REPO_PATH"
if ! git diff-index --quiet HEAD --; then
    print_warning "Dev repository has uncommitted changes. Commit them first? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Pre-deployment commit: $(date)"
        print_status "Changes committed in dev repository"
    else
        print_error "Please commit or stash changes in dev repository before deploying"
        exit 1
    fi
fi

cd "$PROD_REPO_PATH"
if ! git diff-index --quiet HEAD --; then
    print_warning "Production repository has uncommitted changes. These will be lost. Continue? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled"
        exit 1
    fi
fi

# Step 3: Get latest changes from dev
print_status "Pulling latest changes from dev repository..."
cd "$DEV_REPO_PATH"
git pull origin main

# Step 4: Show what will be deployed
echo "📋 Changes to be deployed:"
git log --oneline -5

print_warning "Do you want to proceed with deployment? (y/n)"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    print_error "Deployment cancelled"
    exit 1
fi

# Step 5: Sync files (excluding .git directory)
print_status "Syncing files from dev to production..."
rsync -av --exclude='.git' --exclude='.DS_Store' --delete "$DEV_REPO_PATH/" "$PROD_REPO_PATH/"

# Step 6: Commit changes in production
print_status "Committing changes in production repository..."
cd "$PROD_REPO_PATH"
git add .

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    print_status "No changes to commit - repositories are already in sync"
else
    # Get the latest commit message from dev for reference
    cd "$DEV_REPO_PATH"
    LATEST_DEV_COMMIT=$(git log -1 --pretty=format:"%s")
    
    cd "$PROD_REPO_PATH"
    git commit -m "Deploy from dev: $LATEST_DEV_COMMIT"
    print_status "Changes committed in production repository"
fi

# Step 7: Push to production
print_warning "Push changes to production remote? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    git push origin main
    print_status "Changes pushed to production remote"
else
    print_status "Changes committed locally but not pushed to remote"
fi

echo ""
print_status "🎉 Deployment completed successfully!"
print_status "Backup available at: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "- Test the production site"
echo "- Monitor for any issues"
echo "- Remove backup when satisfied: rm -rf $BACKUP_DIR"