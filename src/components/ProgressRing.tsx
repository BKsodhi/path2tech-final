import React from "react";

export function ProgressRing({
  percent,
  size = 120,
  stroke = 8,
  color = "#06b6d4",
  trackColor = "#1a2d4a",
}: {
  percent: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
    </svg>
  );
}
