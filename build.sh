#!/bin/bash
echo "Starting build process..."

# Install dependencies
pip install -r requirements_vercel.txt

# Collect static files
python manage.py collectstatic --noinput

# Create necessary directories
mkdir -p staticfiles
mkdir -p media

echo "Build completed successfully!"
