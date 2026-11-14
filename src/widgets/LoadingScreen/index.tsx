import { CloudSun } from "lucide-react";
import { Caption, Overlay, Ring, Spinner } from "./style";

const LoadingScreen = ({ leaving }: { leaving: boolean }) => (
  <Overlay $leaving={leaving} role="status" aria-live="polite">
    <Spinner>
      <Ring />
      <CloudSun size={28} />
    </Spinner>
    <Caption>Carregando estação meteorológica…</Caption>
  </Overlay>
);

export default LoadingScreen;
