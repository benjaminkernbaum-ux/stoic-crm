"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  prefix?: string;
  delta: number;
  deltaLabel?: string;
  trend: "up" | "down" | "neutral";
  sparkData: number[];
  color?: string;
  delay?: number;
}

function AnimatedNumber({ value, prefix = "" }: { value: string; prefix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const numericVal = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.,]/g, "");
    const duration = 1200;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
      const current = numericVal * eased;
      if (numericVal >= 1000) {
        setDisplay(current.toLocaleString("en-US", { maximumFractionDigits: 0 }) + suffix);
      } else {
        setDisplay(current.toFixed(1) + suffix);
      }
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span ref={ref}>{prefix}{display}</span>;
}

function Sparkline({ data, color = "var(--purple-500)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return (
    <div className="sparkline" style={{ gap: 2 }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="sparkline-bar"
          initial={{ height: 0 }}
          animate={{ height: `${((v - min) / range) * 100}%` }}
          transition={{ delay: i * 0.03, duration: 0.4, ease: "easeOut" }}
          style={{
            background: `linear-gradient(to top, ${color}, ${color}88)`,
            minHeight: 2,
            width: 3,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

export default function MetricCard({ title, value, prefix, delta, deltaLabel, trend, sparkData, color = "var(--purple-500)", delay = 0 }: MetricCardProps) {
  const trendColor = trend === "up" ? "var(--green-400)" : trend === "down" ? "var(--red-400)" : "var(--text-tertiary)";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      whileHover={{
        borderColor: "var(--border-active)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        y: -2,
      }}
    >
      {/* Subtle top glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "60%", height: 1,
        background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
      }} />

      {/* Title */}
      <div style={{
        fontSize: 11, fontWeight: 500, color: "var(--text-tertiary)",
        textTransform: "uppercase", letterSpacing: "0.8px",
      }}>
        {title}
      </div>

      {/* Value + Sparkline */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{
            fontSize: 28, fontWeight: 800, color: "var(--text-primary)",
            letterSpacing: "-1px", lineHeight: 1,
          }}>
            <AnimatedNumber value={value} prefix={prefix} />
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            marginTop: 6, fontSize: 12, fontWeight: 500,
            color: trendColor,
          }}>
            <TrendIcon size={12} />
            <span>{delta > 0 ? "+" : ""}{delta}{deltaLabel || ""}</span>
            <span style={{ color: "var(--text-muted)", fontSize: 10, marginLeft: 2 }}>vs 7d</span>
          </div>
        </div>
        <Sparkline data={sparkData} color={color} />
      </div>
    </motion.div>
  );
}
