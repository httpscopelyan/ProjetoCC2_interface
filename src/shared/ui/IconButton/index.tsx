import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "./style";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  size?: number;
  active?: boolean;
}

const IconButton = ({ icon: Icon, label, size = 36, active, ...rest }: IconButtonProps) => {
  return (
    <Button type="button" aria-label={label} title={label} $size={size} $active={active} {...rest}>
      <Icon size={Math.round(size * 0.45)} />
    </Button>
  );
};

export default IconButton;
