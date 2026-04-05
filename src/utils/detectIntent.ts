const HELP_KEYWORDS_PT = [
    'ajuda', 'como', 'erro', 'bug', 'problema', 'nao funciona', 'não funciona',
    'como faco', 'como faço', 'como fazer', 'nao sobe', 'não sobe', 'falha',
    'duvida', 'dúvida', 'como configurar', 'nao consigo', 'não consigo',
    'ta dando erro', 'tá dando erro', 'nao roda', 'não roda', 'nao sobe',
    'crash', 'dando crash', 'ta crashando', 'caindo', 'nao liga', 'não liga',
];

const HELP_KEYWORDS_EN = [
    'help', 'how', 'error', 'bug', 'issue', 'problem', 'not working', 'how to',
    'how do i', "can't", 'cannot', 'failing', 'doesnt work', "doesn't work", 'stuck',
    'crash', 'crashing', 'crashes', 'keeps', 'broken', 'fix', 'not starting',
];

const HELP_KEYWORDS_ES = [
    'ayuda', 'como', 'error', 'problema', 'no funciona', 'cómo', 'como hago',
    'falla', 'no puedo',
];

const ALL_HELP_KEYWORDS = [...HELP_KEYWORDS_PT, ...HELP_KEYWORDS_EN, ...HELP_KEYWORDS_ES];

const DISCLOUD_TERMS = [
    'discloud', 'discloud.config', 'deploy', 'bot discord', 'hospedagem',
    'dominio', 'domínio', 'plano', 'ram', 'cpu', 'status', 'cli', 'upload', 'zip',
    'apt', 'python', 'node', 'java', 'go', 'rust', 'php',
];

function normalize(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

export function detectHelpIntent(message: string): boolean {
    const words = message.trim().split(/\s+/);
    if (words.length < 3) return false;

    const normalized = normalize(message);

    const helpMatches = ALL_HELP_KEYWORDS.filter(kw => normalized.includes(normalize(kw)));
    const discloudMatches = DISCLOUD_TERMS.filter(term => normalized.includes(normalize(term)));

    if (helpMatches.length >= 1 && discloudMatches.length >= 1) return true;

    if (helpMatches.length >= 2) return true;

    return false;
}
