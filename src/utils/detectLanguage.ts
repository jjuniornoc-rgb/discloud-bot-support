export type Language = 'pt' | 'en' | 'es' | 'other';

const PT_INDICATORS = new Set([
    'o', 'a', 'os', 'as', 'um', 'uns', 'umas',
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
    'ao', 'aos', 'a', 'pelo', 'pela', 'pelos', 'pelas',
    'por', 'para', 'com', 'sem', 'sob', 'sobre', 'entre', 'ate', 'apos',
    'desde', 'durante', 'contra', 'perante', 'mediante',
    'eu', 'tu', 'ele', 'ela', 'nos', 'vos', 'eles', 'elas',
    'voce', 'voces', 'meu', 'minha', 'meus', 'minhas',
    'seu', 'sua', 'seus', 'suas', 'dele', 'dela', 'deles', 'delas',
    'me', 'te', 'se', 'nos', 'vos', 'lhe', 'lhes',
    'isso', 'este', 'essa', 'esse', 'aquele', 'aquela', 'aquilo',
    'deste', 'desta', 'neste', 'nesta', 'nisso', 'naquele', 'naquela',
    'qual', 'quais', 'quem', 'cujo', 'cuja',
    'que', 'e', 'mas', 'ou', 'pois', 'porque', 'portanto', 'logo',
    'entao', 'contudo', 'todavia', 'porem', 'embora', 'se', 'caso',
    'quando', 'enquanto', 'assim', 'tambem', 'nem', 'tanto', 'ja',
    'ser', 'estar', 'ter', 'haver', 'fazer', 'ir', 'vir', 'poder',
    'querer', 'dever', 'saber', 'ver', 'dar', 'ficar', 'deixar',
    'estou', 'esta', 'estao', 'estamos', 'estava', 'estavam',
    'sou', 'somos', 'sao', 'era', 'eram', 'fui', 'foi', 'fomos', 'foram',
    'tenho', 'tem', 'temos', 'tinham', 'tinha', 'tive', 'teve',
    'faco', 'faz', 'fazemos', 'fazem', 'fez', 'fiz',
    'vou', 'vai', 'vamos', 'vao', 'vim', 'veio', 'virei',
    'posso', 'pode', 'podemos', 'podem', 'pude', 'poderao',
    'quero', 'quer', 'queremos', 'querem', 'quis',
    'devo', 'deve', 'devemos', 'devem',
    'sei', 'sabe', 'sabemos', 'sabem',
    'fico', 'fica', 'ficamos', 'ficam', 'fiquei', 'ficou',
    'preciso', 'precisa', 'precisamos', 'precisam',
    'consigo', 'consegue', 'consegui', 'conseguiu',
    'coloco', 'coloca', 'coloquei', 'colocou',
    'funciona', 'funcionando', 'funcionou', 'funcione',
    'roda', 'rodando', 'rodei', 'rodou',
    'sobe', 'subindo', 'subi', 'subiu',
    'inicia', 'iniciando', 'iniciei', 'iniciou', 'iniciando',
    'atualiza', 'atualizando', 'atualizei', 'atualizou',
    'configuro', 'configura', 'configurei', 'configurou', 'configurar',
    'registar', 'registro', 'registrei', 'registrou',
    'hospedar', 'hospedo', 'hospedei', 'hospedou', 'hospedando',
    'colocar', 'conseguir', 'subir', 'testar', 'testando',
    'novo', 'nova', 'novos', 'novas', 'velho', 'velha',
    'grande', 'pequeno', 'pequena', 'proprio', 'propria',
    'personalizado', 'personalizada', 'correto', 'correta',
    'errado', 'errada', 'certo', 'certa', 'diferente',
    'nao', 'sim', 'aqui', 'ali', 'la', 'ca', 'ja', 'ainda',
    'sempre', 'nunca', 'talvez', 'provavelmente', 'certamente',
    'muito', 'pouco', 'mais', 'menos', 'bem', 'mal', 'melhor', 'pior',
    'so', 'apenas', 'somente', 'mesmo', 'tambem', 'depois', 'antes',
    'arquivo', 'projeto', 'servidor', 'conta', 'usuario',
    'dominio', 'codigo', 'versao', 'erro', 'falha',
    'aplicacao', 'aplicativo', 'bot', 'hospedagem', 'plano',
    'configuracao', 'variavel', 'senha', 'token', 'chave',
    'banco', 'dados', 'deploy', 'atualizar', 'instalar',
    'terminal', 'comando', 'log', 'logs', 'memoria', 'acesso',
]);

const EN_INDICATORS = new Set([
    'the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your',
    'his', 'her', 'its', 'our', 'their', 'some', 'any', 'each', 'every',
    'of', 'in', 'to', 'for', 'with', 'on', 'at', 'by', 'from',
    'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'out', 'off', 'under', 'over',
    'against', 'without', 'within', 'along', 'across',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
    'us', 'them', 'who', 'which', 'what', 'whose',
    'and', 'but', 'or', 'nor', 'so', 'yet', 'because', 'although',
    'while', 'if', 'when', 'where', 'as', 'since', 'unless', 'until',
    'though', 'whether', 'both', 'either', 'neither', 'not',
    'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'shall', 'should', 'may', 'might',
    'can', 'could', 'must', 'need', 'dare', 'ought',
    'get', 'got', 'make', 'made', 'use', 'used', 'go', 'going',
    'know', 'think', 'take', 'see', 'come', 'want', 'look',
    'give', 'find', 'tell', 'work', 'call', 'try', 'keep',
    'set', 'run', 'deploy', 'install', 'configure', 'update',
    'check', 'need', 'help', 'start', 'stop', 'restart',
    'not', 'no', 'yes', 'here', 'there', 'now', 'then', 'still',
    'also', 'just', 'only', 'even', 'already', 'always', 'never',
    'very', 'too', 'more', 'most', 'well', 'back', 'up', 'down',
    'new', 'old', 'good', 'bad', 'right', 'wrong', 'same', 'different',
    'first', 'last', 'long', 'little', 'own', 'other', 'small',
    'file', 'project', 'server', 'account', 'user', 'domain',
    'code', 'version', 'error', 'issue', 'config', 'bot',
    'token', 'key', 'password', 'app', 'api', 'log', 'logs',
    'memory', 'command', 'access', 'build', 'host',
]);

const ES_INDICATORS = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
    'de', 'del', 'al', 'en', 'a', 'por', 'para', 'con', 'sin',
    'sobre', 'entre', 'ante', 'bajo', 'desde', 'hasta', 'durante',
    'mediante', 'segun', 'hacia', 'contra',
    'yo', 'tu', 'el', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas',
    'usted', 'ustedes', 'mi', 'su', 'sus', 'mis', 'tus',
    'me', 'te', 'se', 'nos', 'os', 'le', 'les',
    'este', 'esta', 'esto', 'ese', 'esa', 'eso',
    'aquel', 'aquella', 'aquello', 'quien', 'cual', 'cuales',
    'que', 'y', 'pero', 'o', 'porque', 'aunque', 'cuando', 'si',
    'como', 'donde', 'mientras', 'pues', 'sino', 'ni', 'tambien',
    'ademas', 'entonces', 'luego', 'sin', 'embargo',
    'ser', 'estar', 'tener', 'haber', 'hacer', 'ir', 'poder',
    'querer', 'deber', 'saber', 'ver', 'dar', 'venir',
    'soy', 'eres', 'es', 'somos', 'sois', 'son',
    'estoy', 'esta', 'estamos', 'estan',
    'tengo', 'tienes', 'tiene', 'tenemos', 'tienen',
    'hago', 'hace', 'hacemos', 'hacen', 'hice', 'hizo',
    'voy', 'vas', 'va', 'vamos', 'van',
    'puedo', 'puedes', 'puede', 'podemos', 'pueden',
    'quiero', 'quieres', 'quiere', 'queremos', 'quieren',
    'debo', 'debes', 'debe', 'debemos', 'deben',
    'se', 'sabes', 'sabe', 'sabemos', 'saben',
    'no', 'si', 'aqui', 'ahi', 'alla', 'ya', 'todavia', 'aun',
    'siempre', 'nunca', 'quizas', 'probablemente',
    'muy', 'poco', 'mas', 'menos', 'bien', 'mal', 'mejor', 'peor',
    'solo', 'solamente', 'mismo', 'tambien', 'despues', 'antes',
    'archivo', 'proyecto', 'servidor', 'cuenta', 'usuario',
    'dominio', 'codigo', 'version', 'error', 'fallo',
    'aplicacion', 'bot', 'hospedaje', 'plan', 'configuracion',
    'variable', 'contrasena', 'token', 'clave', 'acceso',
]);

function normalize(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

export function detectLanguage(text: string): Language {
    const words = normalize(text).split(/\s+/);

    let ptScore = 0;
    let enScore = 0;
    let esScore = 0;

    for (const word of words) {
        const clean = word.replace(/[^a-z]/g, '');
        if (!clean) continue;
        if (PT_INDICATORS.has(clean)) ptScore++;
        if (EN_INDICATORS.has(clean)) enScore++;
        if (ES_INDICATORS.has(clean)) esScore++;
    }

    const max = Math.max(ptScore, enScore, esScore);

    if (max < 1) return 'en';

    if (ptScore === enScore && ptScore === esScore) return 'en';
    if (ptScore === max && ptScore > enScore && ptScore > esScore) return 'pt';
    if (enScore === max && enScore > ptScore && enScore > esScore) return 'en';
    if (esScore === max && esScore > ptScore && esScore > enScore) return 'es';

    if (ptScore === max && ptScore === esScore) return 'pt';

    return 'en';
}
