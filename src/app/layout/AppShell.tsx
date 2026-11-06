import { Outlet } from "react-router-dom";

import Sidebar from "../../widgets/Sidebar";
import AmbientLayer from "../../widgets/AmbientLayer";
import { Shell } from "./style";

const AppShell = () => {
  return (
    <Shell>
      <Sidebar />
      <AmbientLayer />
      <Outlet />
    </Shell>
  );
};

export default AppShell;
