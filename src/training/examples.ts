import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { log } from '../utils/logger';

export type TrainingExample = {
  id: string;
  category: string;
  question: string;
  idealResponse: string;
  language: string;
  tags: string[];
};

const EXAMPLES_PATH = join(process.cwd(), 'training', 'examples', 'examples.json');

let cachedExamples: TrainingExample[] = [];
let lastLoaded = 0;
const CACHE_TTL = 5 * 60 * 1000;

function loadExamples(): TrainingExample[] {
  try {
    if (!existsSync(EXAMPLES_PATH)) {
      log('WARN', '[Training] Arquivo examples.json não encontrado');
      return [];
    }
    const data = readFileSync(EXAMPLES_PATH, 'utf-8');
    const examples = JSON.parse(data) as TrainingExample[];
    log('INFO', `[Training] ${examples.length} exemplos carregados`);
    return examples;
  } catch (err) {
    log('ERROR', `[Training] Falha ao carregar exemplos: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}

function getExamples(): TrainingExample[] {
  const now = Date.now();
  if (now - lastLoaded > CACHE_TTL || cachedExamples.length === 0) {
    cachedExamples = loadExamples();
    lastLoaded = now;
  }
  return cachedExamples;
}


export function selectExamples(
  query: string,
  language: string,
  maxExamples = 3,
): TrainingExample[] {
  const examples = getExamples();
  if (examples.length === 0) return [];

  const normalizedQuery = query.toLowerCase();
  const queryWords = normalizedQuery.split(/\s+/);

  const scored = examples.map(ex => {
    let score = 0;

    if (ex.language === language) score += 3;

    for (const tag of ex.tags) {
      if (normalizedQuery.includes(tag.toLowerCase())) score += 2;
    }

    const exWords = ex.question.toLowerCase().split(/\s+/);
    for (const word of exWords) {
      if (word.length > 3 && queryWords.includes(word)) score += 1;
    }

    return { example: ex, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxExamples)
    .map(s => s.example);
}

export function reloadExamples(): number {
  cachedExamples = loadExamples();
  lastLoaded = Date.now();
  return cachedExamples.length;
}
