$ProgressPreference = 'SilentlyContinue'
Write-Host "Downloading PHP..."
Invoke-WebRequest -Uri "https://downloads.php.net/~windows/releases/archives/php-8.5.6-nts-Win32-vs17-x64.zip" -OutFile "php.zip"
Write-Host "Extracting PHP..."
Expand-Archive "php.zip" -DestinationPath "php_portable" -Force
Write-Host "Configuring php.ini..."
Copy-Item "php_portable\php.ini-development" "php_portable\php.ini"
$ini = Get-Content "php_portable\php.ini"
$ini = $ini -replace ";extension_dir = `"ext`"", "extension_dir = `"ext`""
$ini = $ini -replace ";extension=curl", "extension=curl"
$ini = $ini -replace ";extension=fileinfo", "extension=fileinfo"
$ini = $ini -replace ";extension=mbstring", "extension=mbstring"
$ini = $ini -replace ";extension=openssl", "extension=openssl"
$ini = $ini -replace ";extension=pdo_sqlite", "extension=pdo_sqlite"
$ini = $ini -replace ";extension=sqlite3", "extension=sqlite3"
$ini = $ini -replace ";extension=zip", "extension=zip"
Set-Content "php_portable\php.ini" $ini

Write-Host "Downloading Composer..."
Invoke-WebRequest -Uri "https://getcomposer.org/download/latest-stable/composer.phar" -OutFile "composer.phar"

Write-Host "Done!"
