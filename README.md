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
- `POST /api/chat` com `{ messages }`, que responde `{ reply }`

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
