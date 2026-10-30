import type { Period } from "../../shared/config/sensors";
import { useSensorControls } from "../../entities/sensor/context";
import { Group, Option } from "./style";

const options: { value: Period; label: string }[] = [
  { value: "now", label: "Agora" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mês" },
  { value: "year", label: "Ano" },
];

const PeriodSwitch = () => {
  const { period, day, setPeriod } = useSensorControls();

  return (
    <Group role="tablist">
      {options.map(({ value, label }) => {
        // A selected day overrides the period, so no tab is active while one is picked.
        const active = !day && period === value;
        return (
          <Option
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            $active={active}
            onClick={() => setPeriod(value)}
          >
            {label}
          </Option>
        );
      })}
    </Group>
  );
};

export default PeriodSwitch;
