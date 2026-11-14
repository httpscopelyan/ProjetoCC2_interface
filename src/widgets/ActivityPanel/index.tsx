import { ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { GlassPanel, PanelAction, PanelHeader, PanelTitle } from "../../shared/ui/GlassPanel/style";
import { verdictColor, verdictIcon, verdictLabel } from "../../entities/activity/verdict";
import { useActivitySuggestions } from "../../entities/activity/useActivitySuggestions";
import { Empty, Item, Light, List, Reason, Source, Text, Title, Verdict } from "./style";

interface ActivityPanelProps {
  limit?: number;
  expanded?: boolean;
}

const ActivityPanel = ({ limit, expanded = false }: ActivityPanelProps) => {
  const navigate = useNavigate();
  const { suggestions, loading, source, refresh } = useActivitySuggestions();
  const visible = limit ? suggestions.slice(0, limit) : suggestions;

  return (
    <GlassPanel>
      <PanelHeader>
        <PanelTitle>
          Posso fazer agora? <Source>{loading ? "pensando…" : source}</Source>
        </PanelTitle>
        {expanded ? (
          <PanelAction type="button" onClick={refresh} disabled={loading}>
            <RefreshCw size={12} />
            Novas ideias
          </PanelAction>
        ) : (
          <PanelAction type="button" onClick={() => navigate("/atividades")}>
            Ver todas
            <ArrowRight size={12} />
          </PanelAction>
        )}
      </PanelHeader>

      {visible.length === 0 ? (
        <Empty>Carregando leituras…</Empty>
      ) : (
        <List $loading={loading}>
          {visible.map(({ id, title, reason, status }) => {
            const Icon = verdictIcon[status];
            const color = verdictColor[status];
            return (
              <Item key={id}>
                <Light $color={color}>
                  <Icon size={16} />
                </Light>
                <Text>
                  <Title>{title}</Title>
                  <Reason $wrap={expanded}>{reason}</Reason>
                </Text>
                <Verdict $color={color}>{verdictLabel[status]}</Verdict>
              </Item>
            );
          })}
        </List>
      )}
    </GlassPanel>
  );
};

export default ActivityPanel;
