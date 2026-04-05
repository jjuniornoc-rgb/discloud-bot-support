export type DocTopic = {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  url: string;
  keywords: string[];
};

export const topics: DocTopic[] = [
  {
    id: 'getting-started',
    title: 'Introdução / Getting Started',
    titleEn: 'Getting Started',
    summary: 'Como começar a usar a Discloud: criar conta, fazer o primeiro deploy e configurar seu app.',
    summaryEn: 'How to get started with Discloud: create an account, make your first deploy and configure your app.',
    url: 'https://docs.discloud.com/how-to-host/bots',
    keywords: ['comecar', 'inicio', 'introducao', 'introduction', 'start', 'setup', 'primeiro', 'first', 'começar', 'introdução'],
  },
  {
    id: 'discloud-config',
    title: 'discloud.config',
    titleEn: 'discloud.config',
    summary: 'Arquivo de configuração obrigatório para hospedar na Discloud. Campos: ID (nome do app), TYPE (bot ou site), MAIN (arquivo principal), RAM (memória em MB), VERSION (versão do runtime), AUTORESTART (reinício automático), APT (pacotes do sistema), BUILD (comando de build).',
    summaryEn: 'Required configuration file to host on Discloud. Fields: ID (app name), TYPE (bot or site), MAIN (entry file), RAM (memory in MB), VERSION (runtime version), AUTORESTART (auto restart), APT (system packages), BUILD (build command).',
    url: 'https://docs.discloud.com/configurations/discloud.config',
    keywords: ['config', 'configuracao', 'configuração', 'main', 'ram', 'version', 'type', 'apt', 'build', 'autorestart', 'id', 'discloud.config'],
  },
  {
    id: 'cli',
    title: 'Deploy via CLI',
    titleEn: 'Deploy via CLI',
    summary: 'Como instalar e usar o CLI da Discloud para fazer deploy, atualizar e gerenciar apps via terminal. Comandos: discloud upload, discloud commit, discloud apps.',
    summaryEn: 'How to install and use the Discloud CLI to deploy, update and manage apps via terminal. Commands: discloud upload, discloud commit, discloud apps.',
    url: 'https://docs.discloud.com/how-to-host-using/cli',
    keywords: ['cli', 'upload', 'deploy', 'zip', 'terminal', 'command', 'comando', 'instalar', 'install', 'commit'],
  },
  {
    id: 'github-actions',
    title: 'Deploy via GitHub Actions',
    titleEn: 'Deploy via GitHub Actions',
    summary: 'Como configurar CI/CD automático com GitHub Actions para fazer deploy na Discloud sempre que houver push no repositório.',
    summaryEn: 'How to set up automatic CI/CD with GitHub Actions to deploy to Discloud whenever there is a push to the repository.',
    url: 'https://docs.discloud.com/api-and-integrations/github-integration',
    keywords: ['github', 'actions', 'cicd', 'ci/cd', 'automatico', 'automático', 'auto deploy', 'workflow', 'pipeline'],
  },
  {
    id: 'domain',
    title: 'Domínios / Domains',
    titleEn: 'Domains',
    summary: 'Como configurar domínios customizados para apps web hospedados na Discloud. Suporte a subdomínios discloud.app e domínios próprios.',
    summaryEn: 'How to configure custom domains for web apps hosted on Discloud. Support for discloud.app subdomains and custom domains.',
    url: 'https://docs.discloud.com/api-and-integrations/custom-domain',
    keywords: ['dominio', 'domínio', 'domain', 'url', 'endpoint', 'web', 'site', 'subdominio', 'subdomain', 'https'],
  },
  {
    id: 'bot-commands',
    title: 'Comandos do Bot Discloud',
    titleEn: 'Discloud Bot Commands',
    summary: 'Comandos do bot oficial da Discloud no Discord: .up/.deploy (upload de app), .commit/.c (atualizar arquivos), .status/.s (ver estado), .terminal/.logs (ver logs), .reiniciar/.restart (reiniciar), .iniciar/.start (iniciar), .parar/.stop (parar), .backup/.b (backup), .apps/.a (listar apps), .removerapp/.ra (apagar app), .memoria/.ram (mudar RAM), .version/.v (mudar versão), .apt (instalar pacotes), .git (sincronizar repositório), .dominio/.dc (configurar domínio), .subdominio/.sd (subdomínio), .autorestart/.ar (ativar autorestart), .dir/.d (ver diretório), .status/.s (status), .upconfig/.upc (upload com discloud.config), .upsite (upload de site), .userinfo/.ui (info do usuário), .planos (ver planos), .resetweek/.rw (resetar semana), .restorepoints/.rp (pontos de restauração), .transferir/.tr (transferir plano), .gift (ativar presente), .api (gerar token API), .ping (ver latência), .help/.h (listar comandos).',
    summaryEn: 'Official Discloud Discord bot commands: .up/.deploy (upload app), .commit/.c (update files), .status/.s (check status), .terminal/.logs (view logs), .reiniciar/.restart (restart), .iniciar/.start (start), .parar/.stop (stop), .backup/.b (backup), .apps/.a (list apps), .removerapp/.ra (delete app), .memoria/.ram (change RAM), .version/.v (change version), .apt (install packages), .git (sync repository), .dominio/.dc (configure domain), .subdominio/.sd (subdomain), .autorestart/.ar (toggle autorestart), .dir/.d (view directory), .upconfig/.upc (upload with discloud.config), .upsite (upload site), .userinfo/.ui (user info), .planos (view plans), .gift (activate gift plan), .api (generate API token), .ping (latency), .help/.h (list commands).',
    url: 'https://docs.discloud.com/how-to-host-using/discord-bot',
    keywords: ['comando', 'command', 'status', 'backup', 'commit', 'logs', 'start', 'stop', 'restart', 'reiniciar', 'parar', 'iniciar', 'ram', 'memoria', 'memory', 'deploy', 'up', 'upload', 'terminal', 'console', 'version', 'apt', 'git', 'dominio', 'subdominio', 'autorestart', 'dir', 'diretorio', 'planos', 'plans', 'userinfo', 'ping', 'help', 'ajuda', 'remover', 'delete', 'apagar', 'transferir', 'gift', 'presente', 'api', 'token', 'upsite', 'upconfig', 'resetweek', 'restorepoints'],
  },
  {
    id: 'status',
    title: 'Status e Monitoramento',
    titleEn: 'Status and Monitoring',
    summary: 'Como verificar o status dos seus apps na Discloud, ver uptime, uso de RAM e CPU, e monitorar se o bot está online.',
    summaryEn: 'How to check the status of your apps on Discloud, view uptime, RAM and CPU usage, and monitor if the bot is online.',
    url: 'https://docs.discloud.com/faq/troubleshooting-solutions/diagnosing-offline-applications',
    keywords: ['status', 'online', 'offline', 'uptime', 'monitoring', 'monitoramento', 'cpu', 'ram', 'memoria', 'memória'],
  },
  {
    id: 'plans',
    title: 'Planos e Limites',
    titleEn: 'Plans and Limits',
    summary: 'Informações sobre os planos da Discloud: Free (gratuito com limites de RAM e apps) e planos pagos com mais recursos. Limites de RAM, número de apps, e funcionalidades por plano.',
    summaryEn: 'Information about Discloud plans: Free (with RAM and app limits) and paid plans with more resources. RAM limits, number of apps, and features per plan.',
    url: 'https://docs.discloud.com/faq/general-questions',
    keywords: ['plano', 'plan', 'free', 'premium', 'limite', 'limit', 'pago', 'paid', 'gratuito', 'recursos', 'resources', 'app', 'quantidade'],
  },
  {
    id: 'common-errors',
    title: 'Erros Comuns',
    titleEn: 'Common Errors',
    summary: 'Soluções para os erros mais frequentes na Discloud: exit code 1 (erro de código), heap out of memory (aumentar RAM), missing discloud.config, app ficando offline, crash, dependências faltando.',
    summaryEn: 'Solutions for the most frequent errors on Discloud: exit code 1 (code error), heap out of memory (increase RAM), missing discloud.config, app going offline, crash, missing dependencies.',
    url: 'https://docs.discloud.com/faq/troubleshooting-solutions',
    keywords: ['erro', 'error', 'crash', 'exit', 'code 1', 'heap', 'memory', 'offline', 'falha', 'bug', 'problema', 'nao inicia', 'não inicia', 'nao sobe', 'não sobe'],
  },
  {
    id: 'env',
    title: 'Variáveis de Ambiente',
    titleEn: 'Environment Variables',
    summary: 'Como configurar variáveis de ambiente (secrets) nos apps hospedados na Discloud, sem expor tokens e senhas no código. Uso via painel ou comando /env.',
    summaryEn: 'How to configure environment variables (secrets) in apps hosted on Discloud, without exposing tokens and passwords in the code. Usage via panel or /env command.',
    url: 'https://docs.discloud.com/configurations/environment-variables',
    keywords: ['env', 'variavel', 'variável', 'variable', '.env', 'secret', 'token', 'senha', 'password', 'chave', 'key', 'ambiente'],
  },
];
