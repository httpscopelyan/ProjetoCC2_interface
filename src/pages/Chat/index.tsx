import Reveal from "../../shared/ui/Reveal";
import ChatPanel from "../../widgets/ChatPanel";
import { Content } from "./style";

const Chat = () => {
  return (
    <Content>
      <Reveal order={0}>
        <ChatPanel />
      </Reveal>
    </Content>
  );
};

export default Chat;
