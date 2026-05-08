"use client";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const REVENUE_DATA = [
  { label: "W1", actual: 22400, forecast: null },
  { label: "W2", actual: 28100, forecast: null },
  { label: "W3", actual: 31200, forecast: null },
  { label: "W4", actual: 26800, forecast: null },
  { label: "W5", actual: 35400, forecast: null },
  { label: "W6", actual: 42100, forecast: null },
  { label: "W7", actual: 38700, forecast: null },
  { label: "W8", actual: 45200, forecast: null },
  { label: "W9", actual: 52800, forecast: null },
  { label: "W10", actual: 48300, forecast: null },
  { label: "W11", actual: 56100, forecast: null },
  { label: "W12", actual: 61400, forecast: null },
  { label: "W13", actual: null, forecast: 67000 },
  { label: "W14", actual: null, forecast: 72500 },
  { label: "W15", actual: null, forecast: 78200 },
  { label: "W16", actual: null, forecast: 85000 },
];

export default function RevenueChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    const allVals = REVENUE_DATA.map(d => d.actual || d.forecast || 0);
    const maxVal = Math.max(...allVals) * 1.15;
    const minVal = 0;

    const getX = (i: number) => padding.left + (i / (REVENUE_DATA.length - 1)) * chartW;
    const getY = (v: number) => padding.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

    let progress = 0;
    const duration = 60;

    const draw = () => {
      progress = Math.min(progress + 1, duration);
      const p = progress / duration;
      const ease = 1 - Math.pow(1 - p, 3);

      ctx.clearRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = "#1A1A1A";
      ctx.lineWidth = 1;
      const gridSteps = 5;
      for (let i = 0; i <= gridSteps; i++) {
        const y = padding.top + (chartH / gridSteps) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(W - padding.right, y);
        ctx.stroke();

        // Y-axis labels
        const val = maxVal - (maxVal / gridSteps) * i;
        ctx.fillStyle = "#52525B";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "right";
        ctx.fillText("$" + (val / 1000).toFixed(0) + "K", padding.left - 8, y + 3);
      }

      // X-axis labels
      ctx.fillStyle = "#52525B";
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "center";
      REVENUE_DATA.forEach((d, i) => {
        if (i % 2 === 0) {
          ctx.fillText(d.label, getX(i), H - padding.bottom + 20);
        }
      });

      // Actual data — gradient fill
      const actualData = REVENUE_DATA.filter(d => d.actual !== null);
      if (actualData.length > 1) {
        const lastActualIdx = REVENUE_DATA.findIndex(d => d.actual === null) - 1;
        const drawCount = Math.ceil(actualData.length * ease);

        // Fill gradient
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(0));
        for (let i = 0; i < drawCount; i++) {
          const val = REVENUE_DATA[i].actual! * ease;
          ctx.lineTo(getX(i), getY(val));
        }
        ctx.lineTo(getX(drawCount - 1), padding.top + chartH);
        ctx.lineTo(getX(0), padding.top + chartH);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        grad.addColorStop(0, "rgba(147, 51, 234, 0.25)");
        grad.addColorStop(1, "rgba(147, 51, 234, 0.01)");
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        for (let i = 0; i < drawCount; i++) {
          const val = REVENUE_DATA[i].actual! * ease;
          if (i === 0) ctx.moveTo(getX(i), getY(val));
          else ctx.lineTo(getX(i), getY(val));
        }
        ctx.strokeStyle = "#9333EA";
        ctx.lineWidth = 2.5;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.stroke();

        // Dots
        for (let i = 0; i < drawCount; i++) {
          const val = REVENUE_DATA[i].actual! * ease;
          ctx.beginPath();
          ctx.arc(getX(i), getY(val), 3, 0, Math.PI * 2);
          ctx.fillStyle = "#9333EA";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(getX(i), getY(val), 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "#000";
          ctx.fill();
        }

        // Forecast line (dashed)
        if (ease > 0.5) {
          const forecastStart = lastActualIdx >= 0 ? lastActualIdx : 0;
          const forecastData = REVENUE_DATA.slice(forecastStart);
          const fEase = (ease - 0.5) * 2;

          ctx.beginPath();
          ctx.setLineDash([6, 4]);
          forecastData.forEach((d, i) => {
            const val = (d.actual || d.forecast || 0) * fEase + (1 - fEase) * (forecastData[0].actual || 0);
            const idx = forecastStart + i;
            if (i === 0) ctx.moveTo(getX(idx), getY(REVENUE_DATA[idx].actual || val));
            else ctx.lineTo(getX(idx), getY(val));
          });
          ctx.strokeStyle = "#22D3EE";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.setLineDash([]);

          // Forecast dots
          forecastData.forEach((d, i) => {
            if (d.forecast && i > 0) {
              const val = d.forecast * fEase + (1 - fEase) * (forecastData[0].actual || 0);
              const idx = forecastStart + i;
              ctx.beginPath();
              ctx.arc(getX(idx), getY(val), 3, 0, Math.PI * 2);
              ctx.fillStyle = "#22D3EE";
              ctx.globalAlpha = fEase;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          });
        }
      }

      if (progress < duration) requestAnimationFrame(draw);
      else setAnimated(true);
    };

    // Start after a short delay
    const timer = setTimeout(() => requestAnimationFrame(draw), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Revenue Trajectory</div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>Actual vs AI Forecast</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 2, background: "#9333EA", borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Actual</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 2, background: "#22D3EE", borderRadius: 1, borderTop: "1px dashed #22D3EE" }} />
            <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>AI Forecast</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 260, display: "block" }}
      />
    </motion.div>
  );
}
