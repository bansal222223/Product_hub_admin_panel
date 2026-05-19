# ==========================================
# Phase 1: Build React Assets
# ==========================================
FROM node:20-alpine AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ==========================================
# Phase 2: Main Production Apache/PHP App
# ==========================================
FROM php:8.2-apache
WORKDIR /var/www/html

# Install system dependencies required for Laravel & SQLite
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    libsqlite3-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_sqlite

# Enable Apache ModRewrite for Laravel routing
RUN a2enmod rewrite

# Setup Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY composer*.json ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application files
COPY . .
# Copy compiled React frontend assets from node stage
COPY --from=node-builder /app/public/build ./public/build

# Optimise Composer autoload loading speeds
RUN composer dump-autoload --no-dev --optimize

# Change Apache document root to Laravel's public folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Configure storage & bootstrap cache directories permissions
RUN mkdir -p storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/app/public/products \
    database \
    && chown -R www-data:www-data storage bootstrap/cache database

# Expose HTTP standard port
EXPOSE 80

# Setup local entrypoint bootscript
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
