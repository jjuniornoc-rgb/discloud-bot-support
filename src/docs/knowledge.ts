import { DocTopic, topics } from './topics';

function normalize(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

export function findRelevantDocs(query: string): DocTopic[] {
    const normalizedQuery = normalize(query);
    const queryWords = normalizedQuery.split(/\s+/);

    const scored = topics.map(topic => {
        let score = 0;
        const normalizedTitle = normalize(topic.title + ' ' + topic.titleEn);
        const normalizedKeywords = topic.keywords.map(normalize);
        const normalizedBody = normalize(topic.summary + ' ' + topic.summaryEn);

        for (const kw of normalizedKeywords) {
            if (normalizedQuery.includes(kw)) {

                if (normalizedTitle.includes(kw)) {
                    score += 2;
                } else {
                    score += 1;
                }
            }
        }

        // +1 por cada palavra da query que aparece no body
        for (const word of queryWords) {
            if (word.length > 2 && normalizedBody.includes(word)) {
                score += 1;
            }
        }

        return { topic, score };
    });

    return scored
        .filter(entry => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(entry => entry.topic);
}

export function getAllTopicsContext(): string {
    return topics
        .map(t => `- ${t.title}: ${t.summary} (${t.url})`)
        .join('\n');
}
