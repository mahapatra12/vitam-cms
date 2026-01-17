# Create VITAM CMS Zip Package
Write-Host "Packaging VITAM CMS for Industrial Deployment..." -ForegroundColor Cyan

$source = "c:\Users\mahap\OneDrive\Documents\Portal\vitam-cms"
$destination = "c:\Users\mahap\OneDrive\Documents\Portal\vitam-cms-industrial.zip"

if (Test-Path $destination) {
    Remove-Item $destination
}

# Compress
Compress-Archive -Path "$source\client", "$source\server", "$source\*.md", "$source\*.json" -DestinationPath $destination -Force

Write-Host "ZIP FILE CREATED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "Location: $destination" -ForegroundColor White
