$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'
$xamppRoot = 'C:\xampp'
$mysqlExe = Join-Path $xamppRoot 'mysql\bin\mysql.exe'

function Stop-Setup([string]$message) {
    throw $message
}

function Test-MySqlPort {
    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $pending = $client.BeginConnect('127.0.0.1', 3306, $null, $null)
        if (-not $pending.AsyncWaitHandle.WaitOne(700)) { return $false }
        $client.EndConnect($pending)
        return $true
    } catch {
        return $false
    } finally {
        $client.Dispose()
    }
}

function Invoke-Npm([string]$directory, [string[]]$arguments) {
    Push-Location $directory
    try {
        & npm @arguments
        if ($LASTEXITCODE -ne 0) {
            Stop-Setup "npm $($arguments -join ' ') failed with exit code $LASTEXITCODE."
        }
    } finally {
        Pop-Location
    }
}

function Read-EnvFile([string]$path) {
    $values = @{}
    foreach ($line in [System.IO.File]::ReadAllLines($path)) {
        if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$') {
            $values[$Matches[1]] = $Matches[2].Trim().Trim('"').Trim("'")
        }
    }
    return $values
}

function Write-EnvFile([string]$path, [string[]]$lines) {
    $encoding = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllLines($path, $lines, $encoding)
}

try {
    Write-Host ''
    Write-Host 'MediFlow first-time local setup' -ForegroundColor Cyan
    Write-Host 'This sets up a local XAMPP database. It will not connect to or change Aiven.'
    Write-Host ''

    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Stop-Setup 'Node.js was not found. Install Node.js 22 LTS, reopen this window, and run setup again.'
    }
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Stop-Setup 'npm was not found. Reinstall Node.js with npm, reopen this window, and run setup again.'
    }
    if ($env:AIVEN_PRISMA_URL -or $env:MYSQL_DATABASE_URL) {
        Stop-Setup 'AIVEN_PRISMA_URL or MYSQL_DATABASE_URL is set in Windows environment variables. This local setup stops to avoid running migrations against a cloud database.'
    }
    if ($env:DATABASE_URL) {
        Stop-Setup 'DATABASE_URL is set in Windows environment variables. Remove that override so Prisma uses the local DATABASE_URL stored in backend/.env.'
    }
    if ($env:VITE_API_URL -and $env:VITE_API_URL -ne 'http://localhost:5000/api') {
        Stop-Setup 'VITE_API_URL is set to a non-local API in Windows environment variables. Clear the override or set it to http://localhost:5000/api.'
    }
    if (-not (Test-Path $mysqlExe)) {
        Stop-Setup 'XAMPP MySQL was not found at C:\xampp. Install XAMPP to C:\xampp, then run setup again.'
    }
    if (-not (Test-Path (Join-Path $backend 'package-lock.json')) -or -not (Test-Path (Join-Path $frontend 'package-lock.json'))) {
        Stop-Setup 'Project files are incomplete. Clone or extract the full MediFlow repository before running setup.'
    }

    $nodeVersionText = (& node --version).Trim().TrimStart('v')
    $nodeVersion = [version]$nodeVersionText
    $nodeSupported = ($nodeVersion.Major -ge 22) -or ($nodeVersion.Major -eq 20 -and $nodeVersion -ge [version]'20.19')
    if (-not $nodeSupported) {
        Stop-Setup "Node.js $nodeVersionText was found. Install Node.js 22 LTS (or 20.19+) and run setup again."
    }
    Write-Host "Node.js $nodeVersionText found."

    if (-not (Test-MySqlPort)) {
        Write-Host 'Starting XAMPP MySQL...'
        $mysqlStart = Join-Path $xamppRoot 'mysql_start.bat'
        if (-not (Test-Path $mysqlStart)) {
            Stop-Setup 'XAMPP mysql_start.bat was not found. Start MySQL in XAMPP Control Panel and run setup again.'
        }
        Start-Process -FilePath $mysqlStart -WindowStyle Hidden
        $deadline = (Get-Date).AddSeconds(40)
        while ((Get-Date) -lt $deadline -and -not (Test-MySqlPort)) { Start-Sleep -Seconds 2 }
        if (-not (Test-MySqlPort)) {
            Stop-Setup 'XAMPP MySQL did not start on port 3306. Start it in XAMPP Control Panel, check for a port conflict, then retry.'
        }
    }
    Write-Host 'XAMPP MySQL is running.'

    $backendEnv = Join-Path $backend '.env'
    $frontendEnv = Join-Path $frontend '.env'
    $freshDatabase = $false
    $tableCount = $null

    if (-not (Test-Path $backendEnv)) {
        $backendExample = Join-Path $backend '.env.example'
        if (-not (Test-Path $backendExample)) { Stop-Setup 'backend\.env.example is missing.' }

        Write-Host ''
        Write-Host 'Enter the XAMPP MySQL root password. In a standard XAMPP install with no root password, just press Enter.' -ForegroundColor Yellow
        $databasePassword = (& node -e "process.stdout.write(require('node:crypto').randomBytes(24).toString('hex'))").Trim()
        $jwtSecret = (& node -e "process.stdout.write(require('node:crypto').randomBytes(48).toString('hex'))").Trim()
        if ($LASTEXITCODE -ne 0 -or $databasePassword.Length -lt 32 -or $jwtSecret.Length -lt 64) {
            Stop-Setup 'Could not generate local application credentials with Node.js.'
        }

        $sql = @"
CREATE DATABASE IF NOT EXISTS mediflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'mediflow_user'@'127.0.0.1' IDENTIFIED BY '$databasePassword';
ALTER USER 'mediflow_user'@'127.0.0.1' IDENTIFIED BY '$databasePassword';
GRANT ALL PRIVILEGES ON mediflow.* TO 'mediflow_user'@'127.0.0.1';
FLUSH PRIVILEGES;
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'mediflow' AND table_type = 'BASE TABLE';
"@
        $sql = $sql -replace "[`r`n]+", ' '
        $mysqlOutput = & $mysqlExe '--user=root' '--password' '--batch' '--skip-column-names' "--execute=$sql"
        if ($LASTEXITCODE -ne 0) {
            Stop-Setup 'Could not prepare the local database. Check the XAMPP root password and try again.'
        }
        $countLine = @($mysqlOutput | Where-Object { $_ -match '^\s*\d+\s*$' } | Select-Object -Last 1)
        if ($countLine.Count -eq 0) { Stop-Setup 'Could not determine whether the local database already contains tables.' }
        $tableCount = [int]$countLine[0].Trim()
        $freshDatabase = ($tableCount -eq 0)

        $databaseUrl = "mysql://mediflow_user:$databasePassword@127.0.0.1:3306/mediflow"
        $backendLines = [System.IO.File]::ReadAllLines($backendExample)
        $backendLines = @($backendLines | ForEach-Object {
            if ($_ -match '^\s*DATABASE_URL\s*=') { "DATABASE_URL=`"$databaseUrl`"" }
            elseif ($_ -match '^\s*JWT_SECRET\s*=') { "JWT_SECRET=$jwtSecret" }
            else { $_ }
        })
        Write-EnvFile $backendEnv $backendLines
        Write-Host 'Created backend/.env with a generated local database password and JWT secret.'
    } else {
        $existingEnv = Read-EnvFile $backendEnv
        $effectiveAivenUrl = if ($env:AIVEN_PRISMA_URL) { $env:AIVEN_PRISMA_URL } else { $existingEnv['AIVEN_PRISMA_URL'] }
        $effectiveMysqlUrl = if ($env:MYSQL_DATABASE_URL) { $env:MYSQL_DATABASE_URL } else { $existingEnv['MYSQL_DATABASE_URL'] }
        if ($effectiveAivenUrl -or $effectiveMysqlUrl) {
            Stop-Setup 'AIVEN_PRISMA_URL or MYSQL_DATABASE_URL is configured. This local setup refuses to migrate a cloud database. Remove that override only if you intend to use a local XAMPP database.'
        }
        if (-not $existingEnv['DATABASE_URL'] -or $existingEnv['DATABASE_URL'] -match 'YOUR_PASSWORD|replace-with') {
            Stop-Setup 'backend/.env already exists but still has example values. Back it up, remove it, and rerun setup to generate local settings.'
        }
        try { $configuredDatabase = [uri]$existingEnv['DATABASE_URL'] } catch { Stop-Setup 'backend/.env contains an invalid DATABASE_URL.' }
        $configuredDatabaseName = $configuredDatabase.AbsolutePath.Trim('/')
        if ($configuredDatabase.Host -notin @('localhost', '127.0.0.1') -or $configuredDatabaseName -ne 'mediflow') {
            Stop-Setup 'backend/.env does not point to the local mediflow database. This setup will not run migrations on a remote database.'
        }
        if ($existingEnv['NODE_ENV'] -and $existingEnv['NODE_ENV'] -ne 'development') {
            Stop-Setup 'backend/.env is not configured for development mode. Set NODE_ENV=development before local setup.'
        }
        Write-Host 'Using the existing local backend/.env without changing its credentials.'
    }

    if (-not (Test-Path $frontendEnv)) {
        Copy-Item (Join-Path $frontend '.env.example') $frontendEnv
        Write-Host 'Created frontend/.env.'
    }
    $frontendValues = Read-EnvFile $frontendEnv
    if ($frontendValues['VITE_API_URL'] -and $frontendValues['VITE_API_URL'] -ne 'http://localhost:5000/api') {
        Stop-Setup 'frontend/.env points to a non-local API. Set VITE_API_URL=http://localhost:5000/api for this local setup.'
    }

    Write-Host ''
    Write-Host 'Installing backend packages...'
    Invoke-Npm $backend @('ci')
    Write-Host 'Installing frontend packages...'
    Invoke-Npm $frontend @('ci')

    Write-Host 'Generating the Prisma client...'
    Invoke-Npm $backend @('run', 'prisma:generate')
    Write-Host 'Applying local database migrations...'
    Invoke-Npm $backend @('run', 'prisma:deploy')

    if ($freshDatabase) {
        Write-Host ''
        Write-Host 'This is a new local database. Demo seed adds example accounts, products, and inventory.'
        $seedAnswer = Read-Host 'Load demo sample data now? [Y/n]'
        if ([string]::IsNullOrWhiteSpace($seedAnswer) -or $seedAnswer -match '^(y|yes)$') {
            Invoke-Npm $backend @('run', 'prisma:seed')
            Write-Host 'Demo data loaded. Demo accounts use the password Demo123!.' -ForegroundColor Green
        } else {
            Write-Host 'Skipped demo data. The database has no demo accounts or sample products.' -ForegroundColor Yellow
        }
    } elseif ($null -ne $tableCount) {
        Write-Host 'Existing local database tables were found; demo seeding was skipped to protect saved data.' -ForegroundColor Yellow
    } else {
        Write-Host 'An existing backend/.env was reused; demo seeding was skipped to protect saved data.' -ForegroundColor Yellow
    }

    Write-Host ''
    Write-Host 'Setup is complete. Starting MediFlow...' -ForegroundColor Green
    Start-Process -FilePath (Join-Path $root 'start-mediflow.bat') -WorkingDirectory $root
} catch {
    Write-Host ''
    Write-Host "SETUP STOPPED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
