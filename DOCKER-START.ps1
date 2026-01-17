# 🚀 VITAM CMS - One-Click Docker Start

Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                ║" -ForegroundColor Cyan
Write-Host "║         VITAM CMS - Docker Deployment          ║" -ForegroundColor Cyan
Write-Host "║                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "🔍 Checking Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed or not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Docker Desktop from:" -ForegroundColor Yellow
    Write-Host "https://www.docker.com/products/docker-desktop" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# Check if Docker daemon is running
Write-Host "🔍 Checking Docker daemon..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Desktop is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start Docker Desktop and wait for it to fully start" -ForegroundColor Yellow
    Write-Host "Then run this script again" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "🐳 Starting VITAM CMS with Docker..." -ForegroundColor Cyan
Write-Host ""

# Stop any existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Start containers
Write-Host "🚀 Starting containers..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                ║" -ForegroundColor Green
    Write-Host "║            ✅ SUCCESS!                          ║" -ForegroundColor Green
    Write-Host "║                                                ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 VITAM CMS is now running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Access the application:" -ForegroundColor Cyan
    Write-Host "   Local:   http://localhost" -ForegroundColor White
    Write-Host ""
    
    # Get local IP
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*"} | Select-Object -First 1).IPAddress
    if ($localIP) {
        Write-Host "   Network: http://$localIP" -ForegroundColor White
        Write-Host "   (Share this with others on same WiFi)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "🧪 Test URLs:" -ForegroundColor Cyan
    Write-Host "   - 2FA Setup:     http://localhost/setup-2fa" -ForegroundColor White
    Write-Host "   - HOD Leaves:    http://localhost/dashboard/hod/leave-approvals" -ForegroundColor White
    Write-Host "   - HOD Subjects:  http://localhost/dashboard/hod/subject-assignment" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 Container Status:" -ForegroundColor Cyan
    docker-compose ps
    Write-Host ""
    Write-Host "📝 View logs:" -ForegroundColor Cyan
    Write-Host "   docker-compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 Stop application:" -ForegroundColor Cyan
    Write-Host "   docker-compose down" -ForegroundColor White
    Write-Host ""
    
    # Wait a moment for containers to fully start
    Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Open browser
    Write-Host "🌐 Opening browser..." -ForegroundColor Yellow
    Start-Process "http://localhost"
    
} else {
    Write-Host ""
    Write-Host "❌ Failed to start containers!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Make sure Docker Desktop is running" -ForegroundColor White
    Write-Host "2. Check if ports 80, 5000, 27017 are available" -ForegroundColor White
    Write-Host "3. Try: docker-compose down" -ForegroundColor White
    Write-Host "4. Then run this script again" -ForegroundColor White
    Write-Host ""
}
