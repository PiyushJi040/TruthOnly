const fs = require('fs');
const axios = require('axios');

const N8N_BASE_URL = 'http://localhost:5678';

async function importWorkflow(filePath, workflowName) {
  try {
    const workflowData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const response = await axios.post(`${N8N_BASE_URL}/api/v1/workflows`, workflowData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`✅ Imported: ${workflowName}`);
    return response.data.id;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log(`⚠️  Already exists: ${workflowName}`);
    } else {
      console.log(`❌ Failed to import ${workflowName}:`, error.response?.data?.message || error.message);
    }
  }
}

async function activateWorkflow(workflowId, workflowName) {
  try {
    await axios.patch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}/activate`);
    console.log(`🟢 Activated: ${workflowName}`);
  } catch (error) {
    console.log(`❌ Failed to activate ${workflowName}:`, error.response?.data?.message || error.message);
  }
}

async function main() {
  console.log('🚀 Starting workflow import...\n');
  
  // Import workflows
  const frontendTriggerId = await importWorkflow('./Frontend API Trigger.json', 'Frontend API Trigger');
  const mainWorkflowId = await importWorkflow('./Main Workflow.json', 'Main Workflow');
  const scheduledScraperId = await importWorkflow('./Scheduled Scraper.json', 'Scheduled Scraper');
  
  console.log('\n📋 Activation status:');
  
  // Activate required workflows
  if (frontendTriggerId) {
    await activateWorkflow(frontendTriggerId, 'Frontend API Trigger');
  }
  
  if (scheduledScraperId) {
    await activateWorkflow(scheduledScraperId, 'Scheduled Scraper');
  }
  
  console.log('\n✨ Import complete!');
  console.log('📝 Next: Configure Google Gemini API and Gmail credentials in n8n UI');
  console.log('🌐 Open: http://localhost:5678');
}

main().catch(console.error);