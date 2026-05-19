#!/bin/sh

# Set up SQLite Database file in database folder if missing
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "Creating database.sqlite file..."
    touch /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
fi

# Set up storage links
echo "Creating storage link..."
php artisan storage:link --force

# Cache config & routes for high speed
echo "Caching Laravel config & routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations and seed default credentials
echo "Running migrations..."
php artisan migrate --force

# Start Apache in the foreground
echo "Starting Apache Web Server..."
exec apache2-foreground
