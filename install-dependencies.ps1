# VITAM CMS - Installation Script for Missing Dependencies

Write-Host "🚀 Installing VITAM CMS Missing Dependencies..." -ForegroundColor Cyan
Write-Host ""

# Navigate to server directory
Write-Host "📦 Installing Server Dependencies..." -ForegroundColor Yellow
Set-Location server

# Install new dependencies
npm install twilio @sendgrid/mail multer multer-s3 @aws-sdk/client-s3 express-rate-limit

Write-Host "✅ Server dependencies installed!" -ForegroundColor Green
Write-Host ""

# Navigate back to root
Set-Location ..

Write-Host "🎉 All dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Copy server/.env.example to server/.env"
Write-Host "2. Fill in your API keys (Twilio, SendGrid, AWS)"
Write-Host "3. Run 'npm run dev' to start the development server"
Write-Host ""
