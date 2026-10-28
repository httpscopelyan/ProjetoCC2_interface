import { Routes, Route } from "react-router";
import App from "../App";
import Index from "../../pages";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/index" element={<Index/>}/>
    </Routes>
  );
}