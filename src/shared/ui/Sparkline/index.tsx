interface SparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

const Sparkline = ({ data, color, width = 84, height = 36 }: SparklineProps) => {
  const min = Math.min(...data);
  const range = Math.max(...data) - min || 1;
  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 36 - ((value - min) / range) * 32 - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden>
      <polyline
        points={points}
        fill="none"
        style={{ stroke: color, transition: "stroke 0.6s ease" }}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default Sparkline;
