import { Status, Wrapper } from "./style";

const palette = ["#f59e0b", "#3b82f6", "#10b981", "#ec4899", "#8b5cf6", "#ef4444"];

interface AvatarProps {
  name: string;
  size?: number;
  online?: boolean;
}

const colorFor = (name: string) => {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
};

const Avatar = ({ name, size = 32, online }: AvatarProps) => {
  return (
    <Wrapper $size={size} $color={colorFor(name)} title={name}>
      {name.charAt(0).toUpperCase()}
      {online && <Status />}
    </Wrapper>
  );
};

export default Avatar;
