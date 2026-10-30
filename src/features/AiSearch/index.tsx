import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { SENSOR_DEFS } from "../../shared/config/sensors";
import type { SensorDef } from "../../shared/config/sensors";
import { useSensorControls, useSensorData } from "../../entities/sensor/context";
import { formatValue, resolveState, stateColor } from "../../entities/sensor/states";
import { Backdrop, Hint, Input, Island, Layer, Result, ResultText, Results, Row, Trigger } from "./style";

const LAYOUT_ID = "ai-search";

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

const QUESTION_WORDS = /\b(que|qual|quais|como|quando|por que|porque|media|ontem|hoje|amanha|hora|horas|semana|mes|ano)\b/;

// Questions and time references go to the chatbot; plain sensor names are answered locally.
const isQuestion = (q: string) => q.includes("?") || /\d/.test(q) || QUESTION_WORDS.test(q);

const matches = (def: SensorDef, q: string) =>
  def.aliases.some((alias) => new RegExp(`\\b${alias}\\b`).test(q)) || normalize(def.title).includes(q);

const AiSearch = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { readings } = useSensorData();
  const { setSelectedId } = useSensorControls();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const q = normalize(query);
  const question = q !== "" && isQuestion(q);
  const found = useMemo(() => (q === "" || question ? [] : SENSOR_DEFS.filter((def) => matches(def, q))), [q, question]);
  const askAi = q !== "" && (question || found.length === 0);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const goToSensor = (def: SensorDef) => {
    setSelectedId(def.id);
    close();
    // Wait for the island to start shrinking before scrolling the card into view.
    setTimeout(() => {
      document.getElementById(`sensor-${def.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
  };

  const goToChat = () => {
    const text = query.trim();
    close();
    navigate("/chat", { state: { q: text } });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (found.length > 0) goToSensor(found[0]);
    else if (askAi) goToChat();
  };

  // Slow, harmonic spring: the island grows out of the icon and shrinks back into it.
  const spring = reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 180, damping: 26, mass: 1.1 };

  return (
    <>
      {open ? (
        <span style={{ width: 36, height: 36 }} />
      ) : (
        <Trigger
          layoutId={LAYOUT_ID}
          style={{ borderRadius: 18 }}
          transition={spring}
          aria-label="Pesquisar"
          title="Pesquisar"
          onClick={() => setOpen(true)}
        >
          <Search size={16} />
        </Trigger>
      )}

      <AnimatePresence>
        {open && (
          <>
            <Backdrop
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={close}
            />
            <Layer key="layer">
              <Island layoutId={LAYOUT_ID} style={{ borderRadius: 28 }} transition={spring} role="dialog" aria-label="Pesquisa">
                <motion.form
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: reduceMotion ? 0 : 0.18 }}
                >
                  <Row>
                    <Search size={18} />
                    <Input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Pesquisar sensores ou perguntar à IA…"
                      aria-label="Pesquisar"
                    />
                    <Hint>Esc</Hint>
                  </Row>

                  {(found.length > 0 || askAi) && (
                    <Results>
                      {found.map((def) => {
                        const value = readings[def.id];
                        const Icon = def.icon;
                        const state = value === undefined ? null : resolveState(def, value, readings).state;
                        const color = value === undefined ? undefined : stateColor(def, value, readings);
                        return (
                          <li key={def.id}>
                            <Result type="button" $color={color} onClick={() => goToSensor(def)}>
                              {state ? <state.icon size={18} /> : <Icon size={18} />}
                              <ResultText>
                                <strong>{def.title}</strong>
                                <span>
                                  {value === undefined ? "Sem leitura" : `${formatValue(def, value)} · ${state?.label}`}
                                </span>
                              </ResultText>
                            </Result>
                          </li>
                        );
                      })}
                      {askAi && (
                        <li>
                          <Result type="button" onClick={goToChat}>
                            <Bot size={18} />
                            <ResultText>
                              <strong>Perguntar à IA</strong>
                              <span>{query.trim()}</span>
                            </ResultText>
                          </Result>
                        </li>
                      )}
                    </Results>
                  )}
                </motion.form>
              </Island>
            </Layer>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiSearch;
