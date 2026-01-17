# VITAM CMS - Quick Start Script

Write-Host "🚀 Starting VITAM CMS..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path "server/.env")) {
    Write-Host "⚠️  Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "server/.env.example" "server/.env"
    Write-Host "✅ .env file created!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "📋 Instructions:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "   - If local: Run 'mongod' in another terminal" -ForegroundColor Gray
Write-Host "   - If Atlas: Update MONGO_URI in server/.env" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Open TWO PowerShell terminals:" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 1 (Server):" -ForegroundColor Yellow
Write-Host "   cd server" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 2 (Client):" -ForegroundColor Yellow
Write-Host "   cd client" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Open browser:" -ForegroundColor White
Write-Host "   http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Quick Test URLs:" -ForegroundColor Yellow
Write-Host "   - 2FA Setup: http://localhost:5173/setup-2fa" -ForegroundColor White
Write-Host "   - HOD Leaves: http://localhost:5173/dashboard/hod/leave-approvals" -ForegroundColor White
Write-Host "   - HOD Subjects: http://localhost:5173/dashboard/hod/subject-assignment" -ForegroundColor White
Write-Host ""
Write-Host "📚 For detailed guide, see: HOW_TO_RUN.md" -ForegroundColor Cyan
Write-Host ""
