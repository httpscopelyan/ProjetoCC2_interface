import {AppRouter}  from "./router";
import SmoothScroll from "./SmoothScroll";
import { SensorDataProvider } from "./providers/SensorDataProvider";
import { SettingsProvider } from "./providers/SettingsProvider";
import AppGate from "./AppGate";
import LocalAiPreloader from "./LocalAiPreloader";

export default function App() {
  return (
    <SettingsProvider>
      <SensorDataProvider>
        <AppGate>
          <SmoothScroll />
          <LocalAiPreloader />
          <AppRouter />
        </AppGate>
      </SensorDataProvider>
    </SettingsProvider>
  );
}
