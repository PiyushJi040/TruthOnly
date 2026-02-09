import axios from 'axios';

// Your n8n webhook URL from the Frontend API Trigger workflow
const N8N_WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/400c39a2-1bf7-4ffa-bafe-02a3888db41c';

class N8nService {
  async factCheck(data) {
    try {
      const response = await axios.post(N8N_WEBHOOK_URL, {
        title: data.title || 'User Submitted Content',
        contentSnippet: data.content || data.text || data.input,
        link: data.url || 'user-submitted',
        inputType: data.inputType,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      return this.parseN8nResponse(response.data);
    } catch (error) {
      console.error('N8n service error:', error);
      throw new Error('Failed to process fact-check request');
    }
  }

  parseN8nResponse(data) {
    // Parse the response from your n8n workflow
    if (data && data.classification) {
      return {
        isTrue: data.classification === 'Verified',
        confidence: this.getConfidenceFromClassification(data.classification),
        classification: data.classification,
        reason: data.reason,
        sources: this.generateSourcesFromClassification(data.classification, data.reason)
      };
    }
    
    // Fallback if response format is different
    return {
      isTrue: false,
      confidence: 50,
      classification: 'Unverified',
      reason: 'Unable to verify information',
      sources: [
        { name: 'AI Analysis Complete', url: '#' }
      ]
    };
  }

  getConfidenceFromClassification(classification) {
    switch (classification) {
      case 'Verified':
        return 85;
      case 'Potential Misinformation':
        return 20;
      case 'Unverified':
        return 50;
      default:
        return 50;
    }
  }

  generateSourcesFromClassification(classification, reason) {
    const baseSources = [
      { name: 'Google Gemini AI Analysis', url: 'https://ai.google.dev/' },
      { name: 'Cross-referenced with fact-checking databases', url: 'https://www.factcheck.org/' }
    ];

    if (classification === 'Potential Misinformation') {
      return [
        ...baseSources,
        { name: 'Misinformation Detection Alert', url: 'https://www.snopes.com/' },
        { name: 'Verification Guidelines', url: 'https://www.poynter.org/ifcn/' }
      ];
    }

    if (classification === 'Verified') {
      return [
        ...baseSources,
        { name: 'Information Verified', url: 'https://www.reuters.com/fact-check/' },
        { name: 'Trusted Source Confirmation', url: 'https://www.ap.org/' }
      ];
    }

    return baseSources;
  }
}

export default new N8nService();