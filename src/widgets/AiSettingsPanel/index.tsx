import { Bot } from "lucide-react";

import SettingRow from "../../shared/ui/SettingRow";
import Switch from "../../shared/ui/Switch";
import { GlassPanel, PanelHeader, PanelTitle } from "../../shared/ui/GlassPanel/style";
import { USE_MOCK } from "../../shared/api/client";
import type { LocalAiStatus } from "../../shared/api/localLlm";
import { useSettings } from "../../entities/settings/context";
import { useLocalAiStatus } from "../../entities/settings/useLocalAiStatus";
import { Progress, ProgressFill, StatusText } from "./style";

const describeStatus = ({ phase, progress }: LocalAiStatus, enabled: boolean): string => {
  if (!enabled) return USE_MOCK ? "Desligada: as respostas usam regras simples." : "Desligada: o servidor responde na hora, só com os dados dos sensores.";
  switch (phase) {
    case "loading":
      return `Preparando o modelo… ${Math.round(progress * 100)}%`;
    case "ready":
      return "Pronta: responde direto no seu dispositivo, só com os dados dos sensores.";
    case "unsupported":
      return "Este navegador não tem WebGPU. Usando respostas por regras.";
    case "error":
      return "Não foi possível carregar o modelo. Usando respostas por regras.";
    default:
      return "Aguardando o navegador ficar ocioso para preparar o modelo.";
  }
};

const AiSettingsPanel = () => {
  const { localAi, setLocalAi } = useSettings();
  const status = useLocalAiStatus();
  const showProgress = localAi && status.phase === "loading";

  return (
    <GlassPanel>
      <PanelHeader>
        <PanelTitle>Inteligência artificial</PanelTitle>
      </PanelHeader>

      <SettingRow
        icon={Bot}
        title="IA local no navegador"
        description={
          USE_MOCK
            ? "Roda no seu dispositivo, sem enviar dados para fora. O primeiro uso baixa o modelo; depois ele fica salvo."
            : "Opcional: usa o modelo do seu dispositivo em vez do servidor. O primeiro uso baixa o modelo (centenas de MB) e é mais lento que o servidor."
        }
      >
        <Switch label="IA local no navegador" checked={localAi} onChange={setLocalAi} />
      </SettingRow>

      <StatusText>{describeStatus(status, localAi)}</StatusText>
      {showProgress && (
        <Progress role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(status.progress * 100)}>
          <ProgressFill style={{ transform: `scaleX(${status.progress})` }} />
        </Progress>
      )}
    </GlassPanel>
  );
};

export default AiSettingsPanel;
