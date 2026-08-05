type RainGlassProps = {
  className?: string;
  intensity?: "soft" | "medium";
};

const droplets = [
  [4, 5, 18, 9.2, -2.1], [9, 17, 10, 7.6, -5.4], [14, 9, 24, 10.4, -7.2],
  [19, 29, 13, 8.5, -1.8], [24, 3, 19, 11.1, -9.4], [29, 21, 9, 7.9, -3.6],
  [34, 12, 27, 12.2, -6.7], [39, 35, 14, 8.9, -4.8], [44, 6, 20, 10.8, -8.5],
  [49, 25, 11, 7.4, -2.7], [54, 14, 25, 11.7, -10.2], [59, 31, 15, 9.5, -5.9],
  [64, 4, 17, 8.2, -7.9], [69, 22, 28, 12.9, -3.1], [74, 10, 12, 7.7, -9.8],
  [79, 28, 23, 10.2, -1.5], [84, 7, 16, 8.7, -6.2], [89, 20, 26, 12.4, -4.2],
  [94, 13, 10, 7.2, -8.8], [98, 33, 19, 10.6, -2.4],
] as const;

const beads = [
  [7, 12, 7], [12, 44, 4], [18, 62, 6], [23, 19, 5], [28, 51, 8], [33, 74, 4],
  [38, 28, 6], [43, 58, 5], [48, 16, 8], [53, 70, 4], [58, 39, 7], [63, 8, 5],
  [68, 65, 8], [73, 34, 4], [78, 53, 6], [83, 18, 5], [88, 72, 7], [93, 42, 4],
] as const;

export function RainGlass({ className = "", intensity = "soft" }: RainGlassProps) {
  return (
    <div className={`rain-glass rain-glass-${intensity} ${className}`} aria-hidden="true">
      <div className="rain-glass-haze" />
      <div className="rain-glass-stars">
        {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
      </div>
      <div className="rain-glass-drops">
        {droplets.map(([left, top, height, duration, delay], index) => (
          <i
            key={index}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              height: `${height}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
      <div className="rain-glass-beads">
        {beads.map(([left, top, size], index) => (
          <i key={index} style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }} />
        ))}
      </div>
    </div>
  );
}
