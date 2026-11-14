import Reveal from "../../shared/ui/Reveal";
import ActivitySearch from "../../features/ActivitySearch";
import ActivityPanel from "../../widgets/ActivityPanel";
import PresetActivities from "../../widgets/PresetActivities";
import { useScenarioCheck } from "../../entities/activity/useScenarioCheck";
import { Content } from "../Chat/style";

const Activities = () => {
  const { query, setQuery, result, loading, ask } = useScenarioCheck();

  return (
    <Content>
      <Reveal order={0}>
        <ActivitySearch query={query} onQueryChange={setQuery} onSubmit={() => ask()} result={result} loading={loading} />
      </Reveal>
      <Reveal order={1}>
        <ActivityPanel expanded />
      </Reveal>
      <Reveal order={2}>
        <PresetActivities onPick={ask} />
      </Reveal>
    </Content>
  );
};

export default Activities;
