@echo off
rem Minimal mvnw stub for Windows: forward to mvn if installed
where mvn >nul 2>&1
if %errorlevel%==0 (
  mvn %*
) else (
  echo mvn not found. Please install Maven and run this script again.
  exit /b 1
)
