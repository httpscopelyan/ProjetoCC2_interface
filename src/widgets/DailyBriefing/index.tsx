import { Newspaper } from "lucide-react";

import NewsCarousel from "../../features/NewsCarousel";
import { GlassPanel, PanelHeader, PanelTitle } from "../../shared/ui/GlassPanel/style";
import { buildBriefingPrompt } from "../../entities/insight/briefing";
import { useAiText } from "../../entities/insight/useAiText";
import { useDailyBriefing } from "../../entities/insight/useDailyBriefing";
import { Icon, Text } from "./style";

const DailyBriefing = () => {
  const facts = useDailyBriefing();
  const { text, loading } = useAiText(facts === null ? null : buildBriefingPrompt(facts), facts ?? "");

  return (
    <GlassPanel>
      <PanelHeader>
        <PanelTitle>Resumo do dia</PanelTitle>
        <Icon>
          <Newspaper size={16} />
        </Icon>
      </PanelHeader>
      <Text $loading={facts === null || loading}>{facts === null ? "Preparando o resumo…" : text}</Text>
      <NewsCarousel />
    </GlassPanel>
  );
};

export default DailyBriefing;
