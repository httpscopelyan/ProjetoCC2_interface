import DatePicker from "../../features/DatePicker";
import AiSearch from "../../features/AiSearch";
import { Bar } from "./style";

const Header = () => {
  return (
    <Bar>
      <DatePicker />
      <AiSearch />
    </Bar>
  );
};

export default Header;
