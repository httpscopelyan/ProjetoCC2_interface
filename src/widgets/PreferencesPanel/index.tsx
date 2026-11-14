import { Contrast } from "lucide-react";

import SettingRow from "../../shared/ui/SettingRow";
import Switch from "../../shared/ui/Switch";
import { GlassPanel, PanelHeader, PanelTitle } from "../../shared/ui/GlassPanel/style";
import { useSettings } from "../../entities/settings/context";

const PreferencesPanel = () => {
  const { highContrast, setHighContrast } = useSettings();

  return (
    <GlassPanel>
      <PanelHeader>
        <PanelTitle>Acessibilidade</PanelTitle>
      </PanelHeader>

      <SettingRow icon={Contrast} title="Alto contraste" description="Reforça bordas, texto e fundos para leitura mais fácil.">
        <Switch label="Alto contraste" checked={highContrast} onChange={setHighContrast} />
      </SettingRow>
    </GlassPanel>
  );
};

export default PreferencesPanel;
