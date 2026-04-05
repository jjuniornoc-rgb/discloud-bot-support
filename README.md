# Discloud AI Bot

Bot de suporte técnico com inteligência artificial para Discord, focado na plataforma [Discloud](https://discloud.com). Responde dúvidas de usuários automaticamente usando modelos de IA gratuitos via [OpenRouter](https://openrouter.ai), com detecção de idioma, base de conhecimento integrada e sistema de feedback por reações.

## Funcionalidades

- **Respostas com IA** — Usa modelos gratuitos do OpenRouter com fallback automático entre 5 modelos (Qwen, Llama, Nemotron, StepFun, auto)
- **Detecção de idioma** — Identifica automaticamente Português, Inglês e Espanhol e responde no mesmo idioma
- **Detecção de intenção** — Só responde mensagens que realmente pedem ajuda sobre Discloud
- **Base de conhecimento** — Busca tópicos relevantes da documentação da Discloud e injeta no contexto da IA
- **Histórico de conversa** — Mantém contexto por canal para respostas mais coerentes
- **Few-Shot Learning** — Exemplos curados de perguntas e respostas injetados no prompt do sistema
- **Sistema de feedback** — Reações ✅/❌ nas respostas para coletar feedback dos usuários
- **Logging de interações** — Registra todas as interações em JSONL (user IDs anonimizados com SHA256)
- **Cooldown por usuário** — Evita spam com limite configurável
- **Filtros** — Restrição por canal e servidor

## Arquitetura

```
src/
├── index.ts                    # Entry point
├── config.ts                   # Variáveis de ambiente
├── ai/
│   ├── agent.ts                # Orquestrador de requisições IA
│   ├── history.ts              # Histórico de conversa por canal
│   ├── openrouter.ts           # Cliente OpenRouter com fallback
│   └── prompts.ts              # Builder de system prompts + few-shot
├── bot/
│   ├── client.ts               # Cliente Discord.js
│   ├── filters.ts              # Filtros de mensagem (bot, canal, guild)
│   └── events/
│       └── messageCreate.ts    # Handler do evento de mensagem
├── docs/
│   ├── knowledge.ts            # Busca de docs relevantes por keywords
│   └── topics.ts               # Base de conhecimento (tópicos Discloud)
├── training/
│   ├── examples.ts             # Loader de exemplos few-shot
│   ├── feedbackHandler.ts      # Handler de reações ✅/❌
│   └── interactionLogger.ts    # Logger JSONL de interações
└── utils/
    ├── cooldown.ts             # Cooldown por usuário
    ├── detectIntent.ts         # Detecção de intenção de ajuda
    ├── detectLanguage.ts       # Detecção de idioma (PT/EN/ES)
    ├── logger.ts               # Logger com timestamp
    └── reply.ts                # Chunking e envio de mensagens
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- Um bot criado no [Discord Developer Portal](https://discord.com/developers/applications)
- Uma API key do [OpenRouter](https://openrouter.ai/keys) (gratuita)

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/discloud-ai-bot.git
cd discloud-ai-bot
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env
```

Edite o `.env`:

```properties
# Obrigatórios
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui
OPENROUTER_API_KEY=sua_api_key_aqui

# Opcionais
ALLOWED_CHANNEL_IDS=123456789,987654321
ALLOWED_GUILD_IDS=111111111,222222222
COOLDOWN_SECONDS=30
MAX_HISTORY_MESSAGES=10
STAFF_USER_ID=id_do_staff_para_notificacoes
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DISCORD_TOKEN` | Sim | Token do bot do Discord Developer Portal |
| `DISCORD_CLIENT_ID` | Sim | Client ID da aplicação |
| `OPENROUTER_API_KEY` | Sim | API key do OpenRouter |
| `ALLOWED_CHANNEL_IDS` | Não | IDs dos canais monitorados (vírgula). Vazio = todos |
| `ALLOWED_GUILD_IDS` | Não | IDs dos servidores autorizados (vírgula). Vazio = todos |
| `COOLDOWN_SECONDS` | Não | Cooldown por usuário em segundos (padrão: 30) |
| `MAX_HISTORY_MESSAGES` | Não | Máximo de mensagens no histórico por canal (padrão: 10) |
| `STAFF_USER_ID` | Não | ID do usuário staff para notificações de feedback negativo |

### 4. Configurar o bot no Discord

No [Discord Developer Portal](https://discord.com/developers/applications):

1. Vá em **Bot** → ative **Message Content Intent**
2. Vá em **OAuth2** → **URL Generator** → marque `bot` com permissões:
   - Send Messages
   - Read Message History
   - Add Reactions
   - View Channels
3. Use a URL gerada para convidar o bot ao seu servidor

## Uso

### Desenvolvimento

```bash
npm run dev
```

Usa `nodemon` + `ts-node` para hot reload automático.

### Build para produção

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Deploy na Discloud

O projeto já inclui o `discloud.config` configurado:

```properties
ID=discloud-ai-bot
TYPE=bot
MAIN=dist/index.js
RAM=256
VERSION=current
AUTORESTART=true
```

Para fazer deploy:

1. Faça o build: `npm run build`
2. Suba via [CLI da Discloud](https://docs.discloud.com/how-to-host-using/cli) ou pelo [bot no Discord](https://docs.discloud.com/how-to-host-using/discord-bot)

## Sistema de Treinamento

O bot possui um sistema de aprendizado em camadas:

### Few-Shot (T1)

Exemplos curados em `training/examples/examples.json` são injetados no system prompt da IA para guiar o estilo e formato das respostas.

### Feedback Loop (T2)

- Cada resposta do bot recebe reações ✅ e ❌
- Usuários clicam para avaliar a qualidade
- Feedback negativo notifica a staff via DM
- Todas as interações são logadas em `training/logs/` (formato JSONL)

## Stack

- **Runtime**: Node.js 20+
- **Linguagem**: TypeScript 5
- **Discord**: discord.js v14
- **IA**: OpenRouter API (modelos gratuitos)
- **Build**: tsc (CommonJS, ES2022)

## Licença

ISC
