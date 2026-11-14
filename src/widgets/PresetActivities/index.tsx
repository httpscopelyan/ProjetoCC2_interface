import { GlassPanel, PanelHeader, PanelTitle } from "../../shared/ui/GlassPanel/style";
import { ACTIVITIES, evaluateActivity } from "../../entities/activity/activities";
import { verdictColor, verdictLabel } from "../../entities/activity/verdict";
import { useSensorData } from "../../entities/sensor/context";
import { Chip, Chips, Dot, Empty, Hint } from "./style";

interface PresetActivitiesProps {
  onPick: (question: string) => void;
}

const PresetActivities = ({ onPick }: PresetActivitiesProps) => {
  const { live } = useSensorData();
  const hasReadings = Object.keys(live).length > 0;

  return (
    <GlassPanel>
      <PanelHeader>
        <PanelTitle>Ideias fixas</PanelTitle>
      </PanelHeader>
      <Hint>Clique para perguntar. O semáforo usa as leituras atuais dos sensores.</Hint>

      {hasReadings ? (
        <Chips>
          {ACTIVITIES.map((activity) => {
            const { status } = evaluateActivity(activity, live);
            const Icon = activity.icon;
            return (
              <li key={activity.id}>
                <Chip type="button" title={verdictLabel[status]} onClick={() => onPick(`Posso ${activity.title.toLowerCase()} agora?`)}>
                  <Dot $color={verdictColor[status]} />
                  <Icon size={14} />
                  {activity.title}
                </Chip>
              </li>
            );
          })}
        </Chips>
      ) : (
        <Empty>Carregando leituras…</Empty>
      )}
    </GlassPanel>
  );
};

export default PresetActivities;
