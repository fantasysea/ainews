import { Category } from './types';

// Keywords to filter AI-related content and categorize it
export const KEYWORDS = {
  [Category.ALL]: [],
  [Category.MODELS]: ['gpt', 'llm', 'transformer', 'llama', 'gemini', 'claude', 'mistral', 'diffusion', 'model', 'weights', 'inference', 'huggingface'],
  [Category.TOOLS]: ['library', 'framework', 'sdk', 'api', 'tool', 'copilot', 'extension', 'cli', 'python', 'javascript', 'agent', 'rag', 'cursor', 'vscode'],
  // Enhanced for Indie Hackers / Monetization
  [Category.STARTUPS]: [
    'funding', 'raised', 'startup', 'yc', 'launch', 'product', 'saas', 'acquisition', 'ipo',
    'bootstrapped', 'indie hacker', 'solopreneur', 'mrr', 'arr', 'revenue', 'monetize', 'profit', 'side project', 'stripe', 'built in public'
  ],
  [Category.RESEARCH]: ['paper', 'arxiv', 'research', 'study', 'experiment', 'benchmark', 'state of the art', 'sota'],
  [Category.GENERAL]: []
};

export const GLOBAL_AI_FILTER = [
  ...KEYWORDS[Category.MODELS],
  ...KEYWORDS[Category.TOOLS],
  ...KEYWORDS[Category.STARTUPS],
  ...KEYWORDS[Category.RESEARCH],
  'ai', 'artificial intelligence', 'ml', 'machine learning', 'neural', 'deep learning', 'automation', 'chatgpt'
];

export const MAX_ITEMS_STORED = 300; // Increased storage
