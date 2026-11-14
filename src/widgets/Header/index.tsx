import DatePicker from "../../features/DatePicker";
import AiSearch from "../../features/AiSearch";
import Feedback from "../../features/Feedback";
import KioskMode from "../../features/KioskMode";
import VoiceReadout from "../../features/VoiceReadout";
import { Bar, Tools } from "./style";

const Header = () => {
  return (
    <Bar>
      <DatePicker />
      <Tools>
        <VoiceReadout />
        <KioskMode />
        <Feedback />
        <AiSearch />
      </Tools>
    </Bar>
  );
};

export default Header;
