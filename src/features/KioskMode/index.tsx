import { useCallback, useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { useInterval } from "usehooks-ts";

import IconButton from "../../shared/ui/IconButton";
import { useSensorControls } from "../../entities/sensor/context";
import { useSensorDefs } from "../../entities/settings/useSensorDefs";

const ROTATION_MS = 8000;

const KioskMode = () => {
  const { selectedId, setSelectedId } = useSensorControls();
  const { defs } = useSensorDefs();
  const [active, setActive] = useState(false);

  const rotateToNextSensor = () => {
    const currentIndex = defs.findIndex((def) => def.id === selectedId);
    setSelectedId(defs[(currentIndex + 1) % defs.length].id);
  };

  useInterval(rotateToNextSensor, active ? ROTATION_MS : null);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-kiosk", active);
    return () => document.documentElement.removeAttribute("data-kiosk");
  }, [active]);

  useEffect(() => {
    const onFullscreenChange = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggle = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  }, []);

  return (
    <IconButton
      icon={active ? Minimize : Maximize}
      label={active ? "Sair do modo quiosque" : "Modo quiosque"}
      active={active}
      onClick={toggle}
    />
  );
};

export default KioskMode;
