import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AppShell from "../layout/AppShell";
import Index from "../../pages/Initial";

const Chat = lazy(() => import("../../pages/Chat"));
const Alerts = lazy(() => import("../../pages/Alerts"));
const Settings = lazy(() => import("../../pages/Settings"));
const Activities = lazy(() => import("../../pages/Activities"));

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Index/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/atividades" element={<Activities/>} />
        <Route path="/avisos" element={<Alerts/>} />
        <Route path="/configuracoes" element={<Settings/>} />
      </Route>
    </Routes>
  );
}
