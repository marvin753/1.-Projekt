#!/bin/bash

echo "🚀 Setting up HabitTrackr project..."

# Check Node version
NODE_VERSION=$(node -v)
echo "Node version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp env.example .env.local
    echo "✅ .env.local created. Please update with your configuration."
fi

# Check for nvm and use correct node version
if command -v nvm &> /dev/null; then
    echo "🔧 Using nvm to set Node version..."
    nvm use
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration"
echo "2. Run 'npm run dev' to start development server"
echo "3. Run 'npm run test:unit' to run tests"



