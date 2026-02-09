# N8N Integration Guide

## Overview
Your React app is now integrated with your n8n workflows for AI-powered fact-checking.

## Workflows Setup

### 1. Frontend API Trigger
- **Webhook URL**: `http://localhost:5678/webhook/400c39a2-1bf7-4ffa-bafe-02a3888db41c`
- **Status**: Must be ACTIVE
- **Purpose**: Receives requests from your React app

### 2. Main Workflow
- **ID**: EMkGYJhDsghRxIhJ
- **Status**: Should remain INACTIVE (triggered by other workflows)
- **Purpose**: Processes fact-checking using Google Gemini AI

### 3. Scheduled Scraper
- **Status**: ACTIVE for automated news monitoring
- **Schedule**: Runs every hour
- **Purpose**: Monitors BBC RSS feed for potential misinformation

## Integration Components

### N8N Service (`src/services/n8nService.js`)
- Handles communication with n8n webhooks
- Formats data for your workflows
- Parses AI responses

### Environment Configuration (`.env`)
```
REACT_APP_N8N_WEBHOOK_URL=http://localhost:5678/webhook/400c39a2-1bf7-4ffa-bafe-02a3888db41c
```

## Setup Instructions

1. **Start N8N**:
   ```bash
   npx n8n
   ```

2. **Import Workflows**:
   - Import all three JSON files into your n8n instance
   - Activate "Frontend API Trigger" and "Scheduled Scraper"
   - Keep "Main Workflow" inactive

3. **Configure Credentials**:
   - Set up Google Gemini API credentials in n8n
   - Configure Gmail credentials for alerts

4. **Start React App**:
   ```bash
   npm start
   ```

## Data Flow

1. User submits content via React app
2. React app calls n8n webhook
3. Frontend API Trigger receives data
4. Main Workflow processes with Google Gemini AI
5. Result returned to React app
6. User sees fact-check results

## Production Deployment

For production, update the webhook URL in `.env`:
```
REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/400c39a2-1bf7-4ffa-bafe-02a3888db41c
```

## Monitoring

- Scheduled Scraper automatically monitors news feeds
- Misinformation alerts sent to configured email
- All executions logged in n8n interface