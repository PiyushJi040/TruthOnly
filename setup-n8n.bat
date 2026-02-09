@echo off
echo 🚀 N8N Setup Instructions
echo.
echo 1. Open n8n in browser: http://localhost:5678
echo 2. Import workflows manually:
echo    - Go to Workflows tab
echo    - Click "Import from file"
echo    - Import: Frontend API Trigger.json
echo    - Import: Main Workflow.json  
echo    - Import: Scheduled Scraper.json
echo.
echo 3. Activate workflows:
echo    - Activate: Frontend API Trigger
echo    - Activate: Scheduled Scraper
echo    - Keep Main Workflow INACTIVE
echo.
echo 4. Configure credentials in n8n:
echo    - Google Gemini API key
echo    - Gmail OAuth2
echo.
echo Press any key to open n8n in browser...
pause >nul
start http://localhost:5678