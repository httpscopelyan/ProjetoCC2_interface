# Guia para testar o dashboard com o Arduino/ESP32 real

Este guia é para quem cuida do hardware. Ele explica como instalar e iniciar o **backend** (recebe e guarda as leituras) e o **front** (o site), e como enviar as leituras reais. O projeto vem **sem dados simulados**: o site começa vazio e só mostra o que o seu equipamento enviar.

## 1. O que instalar (uma vez)

| Programa | Versão | Para quê |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | **22.18 ou superior** (recomendado 24 LTS) | roda o backend e o site |
| [Git](https://git-scm.com/) | qualquer | baixar o projeto (ou receba a pasta zipada) |

Confira no terminal (PowerShell, CMD ou Terminal):

```bash
node -v    # precisa ser v22.18 ou maior
npm -v
```

Não precisa instalar banco de dados: o backend usa um arquivo SQLite criado sozinho em `server/data/`.

## 2. Instalar o projeto

Na pasta do projeto (`dashboard`):

```bash
npm install            # dependências do site
npm run server:install # dependências do backend
```

Depois crie o arquivo de configuração do backend, copiando o exemplo:

- **Windows (PowerShell):** `Copy-Item server\.env.example server\.env`
- **Mac/Linux:** `cp server/.env.example server/.env`

O padrão já serve para o teste: `SIMULATE=false` (só aceita dados reais). Não é preciso editar mais nada.

## 3. Iniciar tudo

```bash
npm run dev:full
```

Esse único comando sobe os dois:

- **Backend (API):** <http://localhost:3000>
- **Site:** <http://localhost:5173>

Para conferir que o backend está de pé, abra <http://localhost:3000/api/health>. Deve aparecer `{"ok":true,"readings":0}`.

Com o banco vazio o site abre normalmente, mas sem valores. Eles aparecem assim que a primeira leitura chegar (o site atualiza sozinho a cada 15 segundos).

Para parar: `Ctrl + C` no terminal.

## 4. Descobrir o IP do computador (para o Arduino alcançar o backend)

O Arduino/ESP32 precisa estar **na mesma rede Wi-Fi** do computador que roda o backend.

- **Windows:** abra o PowerShell e rode `ipconfig`. Procure o **Endereço IPv4** do adaptador Wi-Fi (ex.: `192.168.1.50`).
- **Mac/Linux:** `ifconfig` ou `ip a`.

O endereço que o Arduino vai usar é: `http://IP-DO-COMPUTADOR:3000/api/readings`

> **Firewall do Windows:** na primeira vez o Windows pergunta se permite o Node.js na rede. Marque **Redes privadas** e permita. Se não perguntou e o Arduino não conecta, libere a porta 3000 de entrada no Firewall do Windows.

## 5. Contrato de envio (o que o Arduino deve mandar)

**Requisição:** `POST http://IP-DO-COMPUTADOR:3000/api/readings`
**Cabeçalho:** `Content-Type: application/json`

**Formato simples** (recomendado: um objeto com os sensores que tiver; pode mandar só alguns):

```json
{ "temperature": 24.1, "humidity": 61, "pressure": 1012, "airQuality": 42, "luminosity": 55, "rain": 0 }
```

Também é aceito o formato em lista, com data/hora própria (ISO 8601 ou milissegundos):

```json
{ "readings": [ { "sensorId": "temperature", "value": 24.1, "at": "2026-11-14T12:00:00Z" } ] }
```

Se não enviar `at`, o backend usa a hora em que recebeu a leitura (o mais fácil para o Arduino, que não tem relógio).

### Sensores, unidades e faixas aceitas

| Chave | Sensor | Unidade | Faixa aceita |
| --- | --- | --- | --- |
| `temperature` | Temperatura | °C | -40 a 60 |
| `humidity` | Umidade | % | 0 a 100 |
| `pressure` | Pressão | hPa | 800 a 1100 |
| `airQuality` | Qualidade do ar | AQI | 0 a 500 |
| `luminosity` | Luminosidade | % | 0 a 100 |
| `rain` | Chuva | mm/h | 0 a 500 |

Valores fora da faixa são **rejeitados** (a resposta diz qual). Converta no Arduino antes de enviar (ex.: luminosidade do sensor LDR para 0 a 100 %). Não existe sensor de vento nesta versão.

### Respostas da API

| Código | Significado |
| --- | --- |
| `201` `{"saved":6,"errors":[]}` | leituras salvas |
| `400` `{"saved":0,"errors":[...]}` | nada salvo; `errors` explica (valor fora da faixa, sensor desconhecido, corpo vazio) |
| `401` | a chave `x-api-key` está errada (só se `INGEST_API_KEY` estiver definida em `server/.env`) |

**Frequência sugerida:** uma leitura a cada 5 a 30 segundos. Os gráficos fazem a média por hora/dia, então não é preciso mandar mais rápido.

**Segurança (opcional):** para exigir uma chave, defina `INGEST_API_KEY=minha-chave` em `server/.env`, reinicie o backend e envie o cabeçalho `x-api-key: minha-chave` no Arduino.

## 6. Teste sem o Arduino (confirma que o backend recebe)

Com o backend rodando, num **segundo terminal**:

**Windows (PowerShell):**

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/readings -ContentType "application/json" -Body '{"temperature":24.1,"humidity":61,"pressure":1012,"airQuality":42,"luminosity":55,"rain":0}'
```

**Mac/Linux/Git Bash:**

```bash
curl -X POST http://localhost:3000/api/readings -H "Content-Type: application/json" \
  -d '{"temperature":24.1,"humidity":61,"pressure":1012,"airQuality":42,"luminosity":55,"rain":0}'
```

Deve responder `saved: 6`. Em até 15 segundos os cards do site mostram os valores. **Esses dados de teste ficam no banco**: antes do teste real, pare o backend e apague a pasta `server/data/` (ela é recriada vazia na próxima inicialização).

## 7. Exemplo de código para ESP32 (Arduino IDE)

Ajuste Wi-Fi, IP e as funções `ler...()` para os seus sensores. As funções de leitura abaixo são **marcadores**: troque pelo código real dos seus sensores.

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* WIFI_SSID = "NOME_DA_REDE";
const char* WIFI_PASS = "SENHA_DA_REDE";
const char* API_URL   = "http://192.168.1.50:3000/api/readings"; // IP do computador com o backend
const char* API_KEY   = "";                                      // preencha se usar INGEST_API_KEY
const unsigned long INTERVALO_MS = 10000;

// TROQUE pelas leituras reais dos seus sensores
float lerTemperatura()  { return 0; } // °C
float lerUmidade()      { return 0; } // %
float lerPressao()      { return 0; } // hPa
float lerQualidadeAr()  { return 0; } // AQI
float lerLuminosidade() { return 0; } // 0 a 100 %
float lerChuva()        { return 0; } // mm/h

void conectarWifi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWi-Fi conectado: " + WiFi.localIP().toString());
}

void enviarLeituras() {
  String json = "{\"temperature\":" + String(lerTemperatura(), 1) +
                ",\"humidity\":" + String(lerUmidade(), 1) +
                ",\"pressure\":" + String(lerPressao(), 1) +
                ",\"airQuality\":" + String(lerQualidadeAr(), 0) +
                ",\"luminosity\":" + String(lerLuminosidade(), 0) +
                ",\"rain\":" + String(lerChuva(), 1) + "}";

  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  if (strlen(API_KEY) > 0) http.addHeader("x-api-key", API_KEY);
  int codigo = http.POST(json);
  Serial.printf("POST %s -> %d %s\n", json.c_str(), codigo, http.getString().c_str());
  http.end();
}

void setup() {
  Serial.begin(115200);
  conectarWifi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) conectarWifi();
  enviarLeituras();
  delay(INTERVALO_MS);
}
```

No Monitor Serial, `201` indica sucesso. Se um sensor falhar, **omita a chave dele** do JSON em vez de enviar `0` ou `NaN` (`0` seria gravado como leitura verdadeira).

## 8. O que esperar no site

- **Cards:** mostram a última leitura de cada sensor e mudam de cor/ícone conforme o estado (ex.: temperatura acima de 29 °C vira "Muito quente").
- **Gráficos:** o período **Agora** mostra as últimas 24 h em médias **por hora**; logo no começo aparece só 1 ponto. Semana e mês aparecem por dia, ano por mês. Os dias só ficam selecionáveis no calendário depois de haver leituras neles.
- **Avisos:** surgem quando um sensor entra em faixa de alerta (ex.: chuva, calor forte).
- **Chat:** responde perguntas sobre os sensores a partir do banco (valor atual, máxima/mínima/média, tendência, "posso correr agora?"). Perguntas fora desse padrão só são respondidas se houver uma IA configurada (opcional, veja o `README.md`); sem ela, o chat devolve o resumo atual.
- **Notícias do carrossel:** vêm da internet (GDELT, com reserva do g1). Se o computador estiver sem internet, o carrossel fica vazio e o resto funciona.

## 9. Problemas comuns

| Sintoma | O que fazer |
| --- | --- |
| `node -v` abaixo de 22.18 | atualize o Node.js (backend usa o SQLite embutido do Node) |
| Arduino recebe erro de conexão (`-1`) | confira o IP do computador, a mesma rede Wi-Fi e o Firewall (porta 3000) |
| `400` com "fora de X..Y" | converta a unidade/faixa do sensor antes de enviar (tabela da seção 5) |
| `401` | `x-api-key` diferente do `INGEST_API_KEY` do `server/.env` |
| Site vazio mesmo com `201` | aguarde até 15 s e atualize; confira <http://localhost:3000/api/sensors/latest> |
| Porta 3000 ou 5173 ocupada | feche instâncias antigas do `npm run dev:full` e inicie de novo |
| Quer zerar os dados | pare o backend e apague a pasta `server/data/` |
| Quer ver dados de demonstração | em `server/.env` ponha `SIMULATE=true` (gera 1 ano de histórico falso; volte a `false` e apague `server/data/` antes do teste real) |
