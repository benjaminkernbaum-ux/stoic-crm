"use client";
import { motion } from "framer-motion";
import { Bot, Activity, Zap, Shield, Target, Mail, Search, TrendingUp, Eye, Link, Cpu, Brain } from "lucide-react";

const AGENTS = [
  { name: "HUNTER", role: "Lead Discovery", status: "active", icon: Search, color: "#22D3EE", leads: 847, action: "Scanning LinkedIn Sales Navigator..." },
  { name: "QUALIFIER", role: "Lead Scoring", status: "active", icon: Target, color: "#A855F7", leads: 623, action: "Scoring 12 new leads from HUNTER" },
  { name: "NURTURE", role: "Email Sequences", status: "active", icon: Mail, color: "#3B82F6", leads: 412, action: "Drip sequence #3 → 47 contacts" },
  { name: "CLOSER", role: "Deal Closing", status: "processing", icon: Zap, color: "#22C55E", leads: 89, action: "Analyzing Acme Corp → 78% win prob" },
  { name: "SENTINEL", role: "Risk Monitor", status: "active", icon: Shield, color: "#F59E0B", leads: 234, action: "Monitoring pipeline for anomalies" },
  { name: "FORECAST", role: "Revenue AI", status: "active", icon: TrendingUp, color: "#EC4899", leads: 0, action: "Q3 projection: $185K (+18%)" },
  { name: "INTEGRATOR", role: "CRM Sync", status: "idle", icon: Link, color: "#6B7280", leads: 0, action: "Standby — awaiting sync trigger" },
  { name: "SCRAPER", role: "Data Mining", status: "active", icon: Cpu, color: "#14B8A6", leads: 1247, action: "Mining 3 data sources in parallel" },
];

const STATUS_CONFIG = {
  active: { color: "var(--green-500)", label: "Active", glow: true },
  processing: { color: "var(--amber-500)", label: "Processing", glow: true },
  idle: { color: "var(--gray-500)", label: "Standby", glow: false },
  error: { color: "var(--red-500)", label: "Error", glow: true },
};

export default function AgentStatusBoard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 4,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Bot size={16} color="var(--purple-500)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Agent Workforce</span>
        </div>
        <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "'JetBrains Mono', monospace" }}>
          {AGENTS.filter(a => a.status !== "idle").length}/{AGENTS.length} active
        </span>
      </div>

      {AGENTS.map((agent, i) => {
        const status = STATUS_CONFIG[agent.status as keyof typeof STATUS_CONFIG];
        const Icon = agent.icon;
        return (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: "easeOut" }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            whileHover={{ borderColor: "var(--border-active)", backgroundColor: "var(--bg-hover)" }}
          >
            {/* Agent icon */}
            <div style={{
              width: 32, height: 32, borderRadius: "var(--radius-md)",
              background: `${agent.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon size={16} color={agent.color} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
                  {agent.name}
                </span>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                  {agent.role}
                </span>
              </div>
              <div style={{
                fontSize: 10, color: "var(--text-tertiary)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                maxWidth: 200, marginTop: 2,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {agent.action}
              </div>
            </div>

            {/* Status dot */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {agent.leads > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 600, color: agent.color,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {agent.leads}
                </span>
              )}
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: status.color,
                boxShadow: status.glow ? `0 0 8px ${status.color}` : "none",
                animation: agent.status === "active" ? "pulse-glow 2s ease-in-out infinite" : "none",
              }} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
