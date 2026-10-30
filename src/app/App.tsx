import {AppRouter}  from "./router";
import SmoothScroll from "./SmoothScroll";
import { SensorDataProvider } from "./providers/SensorDataProvider";

export default function App() {
  return (
    <SensorDataProvider>
      <SmoothScroll />
      <AppRouter />
    </SensorDataProvider>
  );
}
