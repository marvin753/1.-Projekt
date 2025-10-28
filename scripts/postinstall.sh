#!/bin/bash

echo "Running post-install setup..."

# Install Playwright browsers
echo "Installing Playwright browsers..."
npx playwright install --with-deps chromium

echo "Setup complete!"



