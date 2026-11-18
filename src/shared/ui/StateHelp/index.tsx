import { CircleAlert } from "lucide-react";
import type { SensorDef } from "../../config/sensors";
import { Intro, List, Panel, Row, Swatch, Text, Trigger, Wrapper } from "./style";

interface StateHelpProps {
  def: SensorDef;
  activeIndex: number;
}

const StateHelp = ({ def, activeIndex }: StateHelpProps) => {
  const id = `state-help-${def.id}`;

  return (
    <Wrapper onClick={(e) => e.stopPropagation()}>
      <Trigger type="button" aria-label={`O que significam os estados de ${def.title}`} aria-describedby={id}>
        <CircleAlert size={13} />
      </Trigger>
      <Panel id={id} role="tooltip">
        <Intro>{def.help}</Intro>
        <List>
          {def.states.map((state, index) => {
            const Icon = state.icon;
            return (
              <Row key={state.label} $active={index === activeIndex}>
                <Swatch $color={state.color}>
                  <Icon size={15} />
                </Swatch>
                <Text>
                  <strong>{state.label}</strong>
                  <span>{state.range}</span>
                  {state.meaning && <em>{state.meaning}</em>}
                </Text>
              </Row>
            );
          })}
        </List>
      </Panel>
    </Wrapper>
  );
};

export default StateHelp;
