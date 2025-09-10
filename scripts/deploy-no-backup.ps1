param(
  [string]$StagingDir = "C:\deploy\react-dist",
  [string]$SiteRoot = "C:\inetpub\wwwroot",
  [int]$IISPort = 9002
)

if (-not (Test-Path $StagingDir)) {
  Write-Error "Staging directory not found: $StagingDir"
  exit 1
}

Write-Host "Syncing files from $StagingDir to $SiteRoot (no backup) ..."
# Use robocopy to mirror staging into site root
Robocopy $StagingDir $SiteRoot /MIR /R:2 /W:2

Write-Host "Files copied. Restarting IIS..."
# Fast restart of IIS
iisreset /restart | Out-Null

Start-Sleep -Seconds 2

Write-Host "Verifying site..."
try {
  $root = Invoke-WebRequest -Uri "http://localhost:$IISPort/" -UseBasicParsing -TimeoutSec 10
  Write-Host "Root HTTP status:" $root.StatusCode
} catch {
  Write-Warning "Root check failed: $_"
}

try {
  $api = Invoke-WebRequest -Uri "http://localhost:$IISPort/api/todos" -UseBasicParsing -TimeoutSec 10
  Write-Host "/api/todos HTTP status:" $api.StatusCode
} catch {
  Write-Warning "/api/todos check returned error: $_"
}

Write-Host "Deployment (no-backup) finished."
