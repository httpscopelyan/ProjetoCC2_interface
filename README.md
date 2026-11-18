# Dashboard de Sensores

Dashboard em React para monitorar sensores ambientais (temperatura, umidade, chuva, qualidade do ar etc.), com estados por faixa de valor, efeitos de ambiente, gráficos por período, alertas, chat e exportação em CSV.

Por padrão o projeto roda com **dados simulados (mock)**. Não precisa de backend, banco ou hardware para ver o design.

## Requisitos

- [Node.js](https://nodejs.org/) 20 ou superior (inclui o npm)
- [Git](https://git-scm.com/)

Para conferir o que você já tem:

```bash
node -v
npm -v
```

## Como rodar

```bash
git clone <URL-DO-REPOSITORIO>
cd dashboard
npm install
npm run dev
```

Abra o endereço que o terminal mostrar, normalmente <http://localhost:5173>.

Não é preciso criar nenhum arquivo `.env`: sem ele, o modo mock já fica ativo.

## Scripts

| Comando           | O que faz                                          |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento com recarga automática |
| `npm run build`   | Checa os tipos e gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente a build de produção               |
| `npm run lint`    | Roda o ESLint                                      |

## Dados simulados e backend real

As variáveis ficam no `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_MOCK=true
```

- `VITE_USE_MOCK=true` (padrão): usa os dados simulados.
- Para usar um backend real, copie `.env.example` para `.env`, defina `VITE_USE_MOCK=false` e aponte `VITE_API_BASE_URL` para a API.

Endpoints esperados:

- `GET /api/sensors/latest`
- `GET /api/sensors/:id/series?period=now|week|month|year&day=YYYY-MM-DD`
- `GET /api/sensors/available-days`
- `GET /api/alerts`
- `POST /api/chat` com `{ messages: [{ role, text }] }`, que responde `{ reply, source }`
- `GET /api/ai/status` e `POST /api/ai/generate` com `{ prompt, json }` (só com LLM configurado; veja abaixo)
- `GET /api/news`
- `POST /api/readings` (entrada dos dados do Arduino)

## Backend incluído (`server/`)

O repositório traz um backend pronto (Node 22.18+ ou 24, Express, SQLite embutido do Node, sem dependências nativas).

```bash
npm run server:install   # uma vez
npm run dev:full         # sobe API (porta 3000) + site, já conectados (usa .env.backend)
```

Para testar com o Arduino/ESP32 real, siga o passo a passo em **[GUIA-ARDUINO.md](GUIA-ARDUINO.md)**. O backend vem **sem dados simulados** (`SIMULATE=false` por padrão). Para ver uma demonstração sem hardware, ponha `SIMULATE=true` em `server/.env` (gera 1 ano de histórico falso e leituras ao vivo; volte a `false` e apague `server/data/` antes de usar dados reais). Exemplo de envio:

```bash
curl -X POST http://localhost:3000/api/readings -H "Content-Type: application/json" \
  -d '{"temperature":24.1,"humidity":61,"pressure":1012,"airQualityRaw":500,"luminosity":55,"rain":0}'
```

`airQualityRaw` é a leitura bruta do MQ-135 (0 a 4095): aparece como indicador bruto, sem classificação nem alertas. `airQuality` (AQI, 0 a 500) é um campo separado, reservado para uma fonte de AQI real.

Também vale `{"readings":[{"sensorId":"temperature","value":24.1,"at":"2026-11-14T12:00:00Z"}]}`. Defina `INGEST_API_KEY` para exigir o header `x-api-key`. Valores fora da faixa física de cada sensor são rejeitados.

### Como a IA funciona

- **Sem treino e sem dados externos:** o chat (`POST /api/chat`) entende a pergunta (sensor, período, mínima/máxima/média, tendência, comparação com ontem, resumo) e **calcula a resposta direto do banco**, em milissegundos e sem inventar nada.
- **LLM opcional:** com `LLM_BASE_URL` e `LLM_MODEL` no `server/.env` (qualquer API compatível com OpenAI, como o Ollama), perguntas que as regras não entendem e os textos gerados (resumo do dia, ideias de atividades) passam pelo LLM. Ele só recebe os dados dos sensores lidos do banco, com instrução de não usar mais nada, e as respostas ficam em cache por 2 minutos.
- **Você controla o que a IA vê:** edite `server/ai.config.json` (recarrega sozinho, sem reiniciar): `sensors` (quais sensores ela enxerga), `historyHours` (quantas horas de histórico por hora), `notes` (fatos extras, como local da estação), `systemPrompt` (personalidade/regras), `rulesFirst` (`true`: regras primeiro, LLM só no que elas não entendem; `false`: tudo pelo LLM). Para ver exatamente o que ela recebe: `GET /api/ai/context`.
- **IA local, rápida e sem limite:** instale o [Ollama](https://ollama.com), rode `ollama pull qwen2.5:3b` e preencha `LLM_BASE_URL`/`LLM_MODEL` no `server/.env` (exemplo em `server/.env.example`). Roda na sua máquina, sem custo, sem cota e offline. O servidor pré-carrega o modelo ao iniciar.
- **IA no navegador (WebLLM):** continua disponível em Configurações, mas vem desligada quando o backend está ligado, porque baixa um modelo grande e é mais lenta que o servidor.
- Toda a IA do site passa por `src/shared/api/chat.ts`; no servidor, por `server/src/ai/`.

Para forçar um valor no mock (por exemplo, ver o efeito de chuva), edite `src/shared/api/mock/sensors.ts`.

## Tecnologias

React 19, TypeScript, Vite, styled-components, Framer Motion, Lenis (scroll suave), React Router e Lucide Icons.

## Estrutura

O projeto segue a arquitetura Feature-Sliced Design:

```
src/
  app/        providers, rotas e layout base
  pages/      Initial, Alerts, Chat
  widgets/    blocos de tela (gráfico, sidebar, chat, ambiente...)
  features/   interações (busca com IA, seletor de data, exportar CSV...)
  entities/   modelos e hooks de sensor, alerta e chat
  shared/     UI base, API, configuração dos sensores e utilitários
```

## Problemas comuns

- **Porta ocupada:** o Vite escolhe a próxima porta livre e mostra no terminal.
- **Erro no `npm install`:** confirme que o Node é 20 ou superior e tente de novo.
- **Animações pesadas:** o design usa efeitos de ambiente e transições. Em computadores mais fracos, feche outras abas ou use `npm run build && npm run preview`, que é mais leve que o modo dev.

## Notícias (contrato com o backend)

O carrossel do "Resumo do dia" lê `GET /api/news` e espera uma lista de:

```json
[{ "id": "...", "title": "...", "summary": "...", "source": "g1.globo.com", "url": "https://..." }]
```

Fonte sugerida: **GDELT DOC 2.0 API** (`https://api.gdeltproject.org/api/v2/doc/doc`), sem chave, com uso comercial permitido, desde que haja citação ao GDELT Project com link (o carrossel já exibe). Exemplo de consulta: `query=(clima OR chuva OR previsão) sourcelang:portuguese sourcecountry:BR&mode=artlist&format=json&sort=datedesc&timespan=3d&maxrecords=10`.

Regras para o backend:

- **Chame a GDELT pelo servidor, nunca pelo navegador.** Assim o IP e os dados dos usuários não vão para terceiros (LGPD).
- **Guarde em cache** (por exemplo 30 minutos). A GDELT limita a 1 requisição a cada 5 segundos.
- A GDELT devolve título, URL, domínio, idioma e data, sem resumo. Use o domínio e a data como `summary`/`source`.
- Não são enviados dados pessoais do usuário à GDELT, apenas a consulta fixa acima.

Implementação atual: tenta a GDELT (repete uma vez se ela limitar a taxa) e, se ela falhar ou vier vazia, usa o feed RSS do g1 Meio Ambiente filtrado por palavras de clima (o carrossel mostra a fonte). O servidor busca ao iniciar e renova a cada 30 minutos.

Em modo mock (`VITE_USE_MOCK` diferente de `false`) o carrossel mostra textos de exemplo.
