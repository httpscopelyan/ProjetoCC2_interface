import Reveal from "../../shared/ui/Reveal";
import AiSettingsPanel from "../../widgets/AiSettingsPanel";
import PreferencesPanel from "../../widgets/PreferencesPanel";
import ThresholdEditor from "../../widgets/ThresholdEditor";
import { Content, Intro, Subtitle, Title, TwoColumns } from "./style";

const Settings = () => {
  return (
    <Content>
      <Reveal order={0}>
        <Intro>
          <Title>Configurações</Title>
          <Subtitle>Ajuste o painel do seu jeito: acessibilidade, inteligência artificial e limites dos sensores.</Subtitle>
        </Intro>
      </Reveal>

      <TwoColumns>
        <Reveal order={1}>
          <PreferencesPanel />
        </Reveal>
        <Reveal order={2}>
          <AiSettingsPanel />
        </Reveal>
      </TwoColumns>

      <Reveal order={3}>
        <ThresholdEditor />
      </Reveal>
    </Content>
  );
};

export default Settings;
