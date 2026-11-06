import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import Reveal from "../../shared/ui/Reveal";
import { GlassPanel } from "../../shared/ui/GlassPanel/style";
import { SENSOR_BY_ID } from "../../shared/config/sensors";
import { clock, relative } from "../../shared/lib/date";
import type { Alert, AlertSeverity } from "../../entities/alert/model";
import { severityColor, severityLabel } from "../../entities/alert/severity";
import { useAlerts } from "../../entities/alert/useAlerts";
import { Back, Chip, Content, DayHeading, Empty, Filters, Icon, Item, List, Meta, Text, Title, Top } from "./style";

const dayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" });

type Filter = AlertSeverity | "all";
const filters: Filter[] = ["all", "critical", "warning", "info"];

const dayKey = (iso: string) => dayFormat.format(new Date(iso));

const Alerts = () => {
  const { alerts, loading } = useAlerts();
  const [filter, setFilter] = useState<Filter>("all");

  const groups = useMemo(() => {
    const byDay = new Map<string, Alert[]>();
    for (const alert of alerts) {
      if (filter !== "all" && alert.severity !== filter) continue;
      const key = dayKey(alert.at);
      byDay.set(key, [...(byDay.get(key) ?? []), alert]);
    }
    return Array.from(byDay.entries());
  }, [alerts, filter]);

  return (
    <Content>
      <Reveal order={0}>
        <Top>
          <div>
            <Back to="/">
              <ArrowLeft size={14} />
              Voltar ao painel
            </Back>
            <Title>Mural de avisos</Title>
          </div>
          <Filters>
            {filters.map((value) => (
              <Chip key={value} type="button" $active={filter === value} onClick={() => setFilter(value)}>
                {value === "all" ? "Todos" : severityLabel[value]}
              </Chip>
            ))}
          </Filters>
        </Top>
      </Reveal>

      <Reveal order={1}>
        <GlassPanel>
          {groups.length === 0 ? (
            <Empty>{loading ? "Carregando avisos…" : "Nenhum aviso encontrado."}</Empty>
          ) : (
            groups.map(([day, items]) => (
              <section key={day}>
                <DayHeading>{day}</DayHeading>
                <List>
                  {items.map(({ id, sensorId, severity, title, message, at }) => {
                    const SensorIcon = SENSOR_BY_ID[sensorId].icon;
                    return (
                      <Item key={id} $color={severityColor[severity]}>
                        <Icon $color={severityColor[severity]}>
                          <SensorIcon size={18} />
                        </Icon>
                        <Text>
                          <strong>{title}</strong>
                          <p>{message}</p>
                        </Text>
                        <Meta>
                          <span>{severityLabel[severity]}</span>
                          <span>
                            {clock(new Date(at))} · {relative(at)}
                          </span>
                        </Meta>
                      </Item>
                    );
                  })}
                </List>
              </section>
            ))
          )}
        </GlassPanel>
      </Reveal>
    </Content>
  );
};

export default Alerts;
