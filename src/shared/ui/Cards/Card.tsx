import { memo } from "react";
import type { KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

import Badge from "../Badge";
import Sparkline from "../Sparkline";
import StateHelp from "../StateHelp";
import type { Readings, SensorDef, SensorId } from "../../config/sensors";
import { changePct, formatNumber, resolveState, stateColor } from "../../../entities/sensor/states";
import type { SeriesPoint } from "../../../entities/sensor/model";
import { Body, Card, Corner, Footer, Header, IconBox, StateLabel, Title, Unit, Value } from "./style";

interface StatsCardProps {
  def: SensorDef;
  value: number;
  all: Readings;
  series: SeriesPoint[];
  selected: boolean;
  onSelect: (id: SensorId) => void;
  onHoverChange: (color: string | null) => void;
}

const StatsCard = ({ def, value, all, series, selected, onSelect, onHoverChange }: StatsCardProps) => {
  const { state, index } = resolveState(def, value, all);
  const color = stateColor(def, value, all);
  const change = changePct(series);
  const positive = change >= 0;
  const Arrow = positive ? TrendingUp : TrendingDown;
  const Icon = state.icon;
  const iconKey = Icon.displayName ?? state.label;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(def.id);
    }
  };

  return (
    <Card
      id={`sensor-${def.id}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      $color={color}
      $selected={selected}
      onClick={() => onSelect(def.id)}
      onKeyDown={onKeyDown}
      onMouseEnter={() => onHoverChange(color)}
      onMouseLeave={() => onHoverChange(null)}
    >
      <Header>
        <IconBox $accent={color}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={iconKey}
              style={{ display: "inline-flex" }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
            >
              <Icon size={16} />
            </motion.span>
          </AnimatePresence>
        </IconBox>
        <Corner>
          <StateHelp def={def} activeIndex={index} />
          <ArrowUpRight size={16} />
        </Corner>
      </Header>

      <Title>{def.title}</Title>

      <Body>
        <Value>
          {formatNumber(def, value)}
          <Unit>{def.unit}</Unit>
        </Value>
        {series.length > 1 && <Sparkline data={series.map((p) => p.value)} color={color} />}
      </Body>

      <Footer>
        <Badge tone={positive ? "success" : "danger"}>
          <Arrow size={12} />
          {positive ? "+" : ""}
          {change}%
        </Badge>
        <StateLabel $color={color}>{state.label}</StateLabel>
      </Footer>
    </Card>
  );
};

export default memo(StatsCard);
