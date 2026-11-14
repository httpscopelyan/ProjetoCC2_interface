import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../widgets/Sidebar";
import AmbientLayer from "../../widgets/AmbientLayer";
import { useAppReady } from "../AppReady";
import { Shell } from "./style";

const AppShell = () => {
  const ready = useAppReady();

  return (
    <Shell>
      <Sidebar />
      {ready && <AmbientLayer />}
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </Shell>
  );
};

export default AppShell;
