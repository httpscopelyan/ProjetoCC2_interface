import { Routes, Route } from "react-router-dom";
import AppShell from "../layout/AppShell";
import Index from "../../pages/Initial";
import Chat from "../../pages/Chat";
import Alerts from "../../pages/Alerts";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Index/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/avisos" element={<Alerts/>} />
      </Route>
    </Routes>
  );
}
