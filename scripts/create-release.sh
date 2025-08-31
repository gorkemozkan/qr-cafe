#!/bin/bash

# Simple Release Script for QR Cafe
# Usage: ./scripts/create-release.sh [version] [message]

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get version from arguments or package.json
VERSION=${1:-$(node -p "require('./package.json').version")}
MESSAGE=${2:-"Release v$VERSION"}

echo -e "${GREEN}Creating release v$VERSION${NC}"
echo "Message: $MESSAGE"
echo ""

# Check if tag exists
if git rev-parse "v$VERSION" >/dev/null 2>&1; then
    echo -e "${RED}Error: Tag v$VERSION already exists${NC}"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}Warning: You have uncommitted changes${NC}"
    git status --short
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create and push tag
echo "Creating tag..."
git tag -a "v$VERSION" -m "$MESSAGE"
echo "Pushing to remote..."
git push origin "v$VERSION"

echo -e "${GREEN}✅ Release v$VERSION created and pushed successfully!${NC}"
echo ""
echo "Recent commits:"
git log --oneline -5
