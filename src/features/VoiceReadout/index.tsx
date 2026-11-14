import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import IconButton from "../../shared/ui/IconButton";
import { describeReadings } from "../../entities/sensor/describe";
import { useSensorData } from "../../entities/sensor/context";
import { useSensorDefs } from "../../entities/settings/useSensorDefs";

const isSupported = "speechSynthesis" in window;

const VoiceReadout = () => {
  const { live } = useSensorData();
  const { defs } = useSensorDefs();
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  if (!isSupported) return null;

  const toggle = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(describeReadings(defs, live));
    utterance.lang = "pt-BR";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <IconButton
      icon={speaking ? VolumeX : Volume2}
      label={speaking ? "Parar leitura" : "Ler estado atual em voz alta"}
      active={speaking}
      onClick={toggle}
    />
  );
};

export default VoiceReadout;
