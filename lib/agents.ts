import { API_KEYS } from './api-config';

export type AgentType = 
  | 'alpaco'
  | 'news'
  | 'technical'
  | 'financial'
  | 'geopolitical'
  | 'macro'
  | 'risk'
  | 'satellite'
  | 'sec'
  | 'sector';

interface AgentConfig {
  title: string;
  description: string;
  prompt: string;
  isPremium: boolean;
}

export const AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  sagehood: {
    title: 'Alpaco',
    description: 'Leverages a spectrum of expert analyzes to deliver a holistic overview of global economic trends and investment prospects.',
    prompt: 'You are Alpaco, an expert AI analyst. Analyze the following query with a focus on overall market trends and investment opportunities: ',
    isPremium: false
  },
  news: {
    title: 'News Agent',
    description: 'Aggregates and analyzes breaking news to identify immediate impacts on market trends.',
    prompt: 'You are a News Analysis Agent. Analyze the following market-related query with focus on recent news and their market impact: ',
    isPremium: true
  },
  technical: {
    title: 'Technical Trader',
    description: 'Focuses on trading strategies in the technology sector, analyzing trends and performance in tech stocks.',
    prompt: 'You are a Technical Trading Expert. Analyze the following query with focus on technical analysis and trading patterns: ',
    isPremium: true
  },
  financial: {
    title: 'Financial Analyst',
    description: 'Provides detailed financial analysis, including company valuations, earnings reports, and financial health assessments.',
    prompt: 'You are a Financial Analysis Expert. Provide detailed financial analysis for the following query: ',
    isPremium: false
  },
  geopolitical: {
    title: 'Geopolitical Analyst',
    description: 'Monitors and analyzes global political events and international relations to identify investment risks and opportunities.',
    prompt: 'You are a Geopolitical Analysis Expert. Analyze the following query with focus on geopolitical impacts: ',
    isPremium: true
  },
  macro: {
    title: 'Macro Economist',
    description: 'Expert in analyzing global economic trends, government policies, and major events to inform investment decisions.',
    prompt: 'You are a Macroeconomic Expert. Analyze the following query with focus on macro trends and economic policies: ',
    isPremium: false
  },
  risk: {
    title: 'Risk Management',
    description: 'Assesses and advises on risk factors across different sectors to support informed investment decisions.',
    prompt: 'You are a Risk Management Expert. Analyze the following query with focus on risk assessment and mitigation: ',
    isPremium: true
  },
  satellite: {
    title: 'Satellite Imagery',
    description: 'Utilizes satellite data to provide visual insights into economic activities and environmental changes affecting global markets.',
    prompt: 'You are a Satellite Data Analysis Expert. Analyze the following query using satellite imagery insights: ',
    isPremium: true
  },
  sec: {
    title: 'SEC Filing Watchdog',
    description: 'Monitors and analyzes SEC filings to identify regulatory risks and opportunities in the market.',
    prompt: 'You are an SEC Filing Expert. Analyze the following query with focus on regulatory filings and compliance: ',
    isPremium: false
  },
  sector: {
    title: 'Sector Analyst',
    description: 'Provides in-depth analysis of the 11 GICS sectors and their sub-industries to guide sector-specific investment decisions.',
    prompt: 'You are a Sector Analysis Expert. Analyze the following query with focus on sector-specific trends: ',
    isPremium: true
  }
};

export async function getAgentResponse(agentType: AgentType, query: string) {
  try {
    const config = AGENT_CONFIGS[agentType];
    const fullPrompt = config.prompt + query;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEYS.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }]
        }),
      }
    );
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Agent Response Error:', error);
    return 'I apologize, but I encountered an error processing your request.';
  }
}