import { Input } from "./style";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const Switch = ({ checked, onChange, label }: SwitchProps) => (
  <Input type="checkbox" role="switch" aria-label={label} checked={checked} onChange={(e) => onChange(e.target.checked)} />
);

export default Switch;
