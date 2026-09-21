# Use the official PHP 8.3 FPM image
FROM php:8.3-fpm

# Install system dependencies required for Laravel
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Clear apt cache to keep the image size small
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install essential PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Copy the latest Composer binary from the official composer image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory inside the container
WORKDIR /var/www

# Notice: We don't copy the application code here yet!
# For local development, docker-compose will mount your code directly into /var/www
# so that changes you make in VS Code are instantly reflected without rebuilding.
