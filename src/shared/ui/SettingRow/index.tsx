import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Control, Description, IconBox, Row, Text, Title } from "./style";

interface SettingRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

const SettingRow = ({ icon: Icon, title, description, children }: SettingRowProps) => (
  <Row>
    <IconBox>
      <Icon size={16} />
    </IconBox>
    <Text>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Text>
    <Control>{children}</Control>
  </Row>
);

export default SettingRow;
