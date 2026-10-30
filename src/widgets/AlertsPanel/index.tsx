import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { GlassPanel, PanelAction, PanelHeader, PanelTitle } from "../../shared/ui/GlassPanel/style";
import { SENSOR_BY_ID } from "../../shared/config/sensors";
import { relative } from "../../shared/lib/date";
import { useAlerts } from "../../entities/alert/useAlerts";
import { severityColor } from "../../entities/alert/severity";
import { Empty, Icon, Item, List, Name, Text, Time } from "./style";

const RECENT = 4;

const AlertsPanel = () => {
  const navigate = useNavigate();
  const { alerts, loading } = useAlerts();
  const recent = alerts.slice(0, RECENT);

  return (
    <GlassPanel>
      <PanelHeader>
        <PanelTitle>Avisos</PanelTitle>
        <PanelAction type="button" onClick={() => navigate("/avisos")}>
          Ver mural
          <ArrowRight size={12} />
        </PanelAction>
      </PanelHeader>

      {recent.length === 0 ? (
        <Empty>{loading ? "Carregando avisos…" : "Nenhum aviso recente."}</Empty>
      ) : (
        <List>
          {recent.map(({ id, sensorId, severity, title, at }) => {
            const SensorIcon = SENSOR_BY_ID[sensorId].icon;
            return (
              <Item key={id} $color={severityColor[severity]}>
                <Icon $color={severityColor[severity]}>
                  <SensorIcon size={16} />
                </Icon>
                <Text>
                  <Name>{title}</Name>
                  <Time>{relative(at)}</Time>
                </Text>
              </Item>
            );
          })}
        </List>
      )}
    </GlassPanel>
  );
};

export default AlertsPanel;
