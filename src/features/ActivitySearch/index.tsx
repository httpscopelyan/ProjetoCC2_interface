import type { FormEvent } from "react";
import { Search } from "lucide-react";

import { verdictColor, verdictIcon, verdictLabel } from "../../entities/activity/verdict";
import type { ScenarioResult } from "../../entities/activity/useScenarioCheck";
import { Answer, AnswerText, Field, Form, Hint, Light, Simulated, SubmitButton, Verdict } from "./style";

interface ActivitySearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: () => void;
  result: ScenarioResult | null;
  loading: boolean;
}

const ActivitySearch = ({ query, onQueryChange, onSubmit, result, loading }: ActivitySearchProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const Icon = result ? verdictIcon[result.status] : null;
  const color = result ? verdictColor[result.status] : undefined;

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Posso fazer tal coisa agora? Ex.: correr com 35 graus"
          aria-label="Perguntar se posso fazer uma atividade"
        />
        <SubmitButton type="submit" disabled={loading || query.trim() === ""}>
          {loading ? "Pensando…" : "Perguntar"}
        </SubmitButton>
      </Field>
      <Hint>Dica: cite valores para simular, como “60% de umidade” ou “chuva de 5 mm”.</Hint>

      {result && Icon && color && (
        <Answer $color={color} aria-live="polite">
          <Light $color={color}>
            <Icon size={18} />
          </Light>
          <AnswerText>
            <strong>{result.title}</strong>
            <span>{result.reason}</span>
            {result.simulated.length > 0 && <Simulated>Simulado: {result.simulated.join(" · ")}</Simulated>}
          </AnswerText>
          <Verdict $color={color}>{verdictLabel[result.status]}</Verdict>
        </Answer>
      )}
    </Form>
  );
};

export default ActivitySearch;
