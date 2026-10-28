import React from "react";
import {ShoppingBag, Users, DollarSign, ArrowUpRight, Icon} from "lucide-react"
import { type LucideIcon } from "lucide-react";

import {Card, Change, Header, Title, Value} from "./style"


interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  gradient?: string;
} 

const StatsCard = ({title, value, icon: Icon, gradient}: StatsCardProps) => {
    return (
    <Card whileHover={{ y: -5 }} $gradient={gradient}>
      <Header>
        <div>
          <Title>{title}</Title>
          <Value>{value}</Value>
          <Change>
            <ArrowUpRight size={16} />
            12%
          </Change>
        </div>
        {Icon && <Icon color="white"/>}
      </Header>
    </Card>
  );
};

export default StatsCard