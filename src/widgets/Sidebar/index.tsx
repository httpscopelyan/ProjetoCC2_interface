import { LayoutDashboard, Megaphone, MessageSquare } from "lucide-react";

import { Item, Rail } from "./style";

const items = [
  { label: "Painel", to: "/", icon: LayoutDashboard },
  { label: "Chat", to: "/chat", icon: MessageSquare },
  { label: "Avisos", to: "/avisos", icon: Megaphone },
];

const Sidebar = () => {
  return (
    <Rail
      aria-label="Navegação principal"
      initial={{ x: -90 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
    >
      {items.map(({ label, to, icon: Icon }) => (
        <Item key={to} to={to} end title={label} aria-label={label}>
          <Icon size={16} />
        </Item>
      ))}
    </Rail>
  );
};

export default Sidebar;
